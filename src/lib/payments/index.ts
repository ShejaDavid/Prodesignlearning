export interface CreateSessionParams {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  enrollmentId: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentSession {
  sessionId: string;
  paymentUrl?: string;
  status: "pending" | "completed" | "failed";
}

export interface PaymentProvider {
  createSession(params: CreateSessionParams): Promise<PaymentSession>;
  verifyWebhook(payload: unknown, signature: string): boolean;
  getPaymentStatus(transactionId: string): Promise<string>;
}

class MockPaymentProvider implements PaymentProvider {
  async createSession(params: CreateSessionParams): Promise<PaymentSession> {
    const sessionId = `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    return {
      sessionId,
      status: "pending",
      paymentUrl: `${params.returnUrl}?session=${sessionId}&mock=true`,
    };
  }

  verifyWebhook(): boolean {
    return true;
  }

  async getPaymentStatus(transactionId: string): Promise<string> {
    return transactionId.startsWith("mock_") ? "completed" : "pending";
  }
}

class MipsPaymentProvider implements PaymentProvider {
  private apiUrl: string;
  private merchantId: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.MIPS_API_URL || "https://api.mips.mu";
    this.merchantId = process.env.MIPS_MERCHANT_ID || "";
    this.apiKey = process.env.MIPS_API_KEY || "";
  }

  async createSession(params: CreateSessionParams): Promise<PaymentSession> {
    const response = await fetch(`${this.apiUrl}/v1/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "X-Merchant-Id": this.merchantId,
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        description: params.description,
        customer: {
          email: params.customerEmail,
          name: params.customerName,
        },
        metadata: { enrollmentId: params.enrollmentId },
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create MIPS payment session");
    }

    const data = await response.json();
    return {
      sessionId: data.id,
      paymentUrl: data.payment_url,
      status: "pending",
    };
  }

  verifyWebhook(payload: unknown, signature: string): boolean {
    const secret = process.env.MIPS_WEBHOOK_SECRET || "";
    // In production, verify HMAC signature from MIPS
    return !!secret && !!signature;
  }

  async getPaymentStatus(transactionId: string): Promise<string> {
    const response = await fetch(`${this.apiUrl}/v1/payments/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "X-Merchant-Id": this.merchantId,
      },
    });

    if (!response.ok) return "failed";
    const data = await response.json();
    return data.status;
  }
}

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER || "mock";
  if (provider === "mips") {
    return new MipsPaymentProvider();
  }
  return new MockPaymentProvider();
}
