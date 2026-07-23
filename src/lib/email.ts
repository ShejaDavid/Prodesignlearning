import { Resend } from "resend";
import { db } from "./db";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "admin@prodesign.mu";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  userId?: string;
  emailType: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  userId,
  emailType,
}: SendEmailParams) {
  try {
    if (resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      });
    } else {
      // No RESEND_API_KEY configured — log enough to actually use the email
      // (e.g. the activation/reset link) instead of just its subject line.
      const linkMatch = html.match(/href="([^"]+)"/);
      console.log(`\n[Email Mock] To: ${to}`);
      console.log(`[Email Mock] Subject: ${subject}`);
      if (linkMatch) console.log(`[Email Mock] Link: ${linkMatch[1]}`);
      console.log("");
    }

    await db.emailLog.create({
      data: {
        userId,
        emailType,
        recipient: to,
        subject,
        status: "SENT",
      },
    });
  } catch (error) {
    console.error("Email send error:", error);
    await db.emailLog.create({
      data: {
        userId,
        emailType,
        recipient: to,
        subject,
        status: "FAILED",
        metadata: { error: String(error) },
      },
    });
  }
}

export function registrationConfirmationEmail(name: string, courseName: string) {
  return {
    subject: "Registration Confirmed — ProDesign Learning Centre",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0F172A;">Welcome to ProDesign Learning Centre, ${name}!</h1>
        <p>Your registration for <strong>${courseName}</strong> has been received.</p>
        <p>Please complete your payment to secure your seat.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/checkout" 
           style="display: inline-block; background: #A54399; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
          Complete Payment
        </a>
        <p style="color: #64748B; margin-top: 32px; font-size: 14px;">
          ProDesign Learning Centre<br/>
          training@prodesign.mu
        </p>
      </div>
    `,
  };
}

export function setPasswordEmail(
  name: string,
  link: string,
  courseName?: string
) {
  return {
    subject: "Activate Your Account — Prodesign Learning Centre",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0F172A;">Welcome, ${name}!</h1>
        <p>An account has been created for you at Prodesign Learning Centre${
          courseName ? ` and you've been enrolled in <strong>${courseName}</strong>` : ""
        }.</p>
        <p>Set your password to activate your account and access your course:</p>
        <a href="${link}"
           style="display: inline-block; background: #A54399; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
          Set Your Password
        </a>
        <p style="color: #64748B; margin-top: 24px; font-size: 14px;">
          This link expires in 7 days and can be used once. If you didn't expect
          this email, you can ignore it.
        </p>
        <p style="color: #64748B; margin-top: 32px; font-size: 14px;">
          Prodesign Learning Centre<br/>
          training@prodesign.mu
        </p>
      </div>
    `,
  };
}

export function resetPasswordEmail(name: string, link: string) {
  return {
    subject: "Reset Your Password — Prodesign Learning Centre",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0F172A;">Password reset</h1>
        <p>Hi ${name},</p>
        <p>We received a request to reset your Prodesign Learning Centre password. Click below to choose a new one:</p>
        <a href="${link}"
           style="display: inline-block; background: #A54399; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
          Reset Password
        </a>
        <p style="color: #64748B; margin-top: 24px; font-size: 14px;">
          This link expires in 7 days and can be used once. If you didn't request
          this, you can safely ignore this email — your password will not change.
        </p>
        <p style="color: #64748B; margin-top: 32px; font-size: 14px;">
          Prodesign Learning Centre<br/>
          training@prodesign.mu
        </p>
      </div>
    `,
  };
}

export function paymentConfirmationEmail(
  name: string,
  courseName: string,
  amount: string,
  invoiceNumber: string
) {
  return {
    subject: "Payment Confirmed — ProDesign Learning Centre",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0F172A;">Payment Successful!</h1>
        <p>Hi ${name},</p>
        <p>Your payment of <strong>${amount}</strong> for <strong>${courseName}</strong> has been confirmed.</p>
        <p>Invoice Number: <strong>${invoiceNumber}</strong></p>
        <p>You are now enrolled! Access your dashboard for course details.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="display: inline-block; background: #A54399; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
          Go to Dashboard
        </a>
      </div>
    `,
  };
}

export function enrollmentConfirmationEmail(
  name: string,
  courseName: string,
  startDate: string,
  schedule: string
) {
  return {
    subject: "You're Enrolled! — ProDesign Learning Centre",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0F172A;">You're Enrolled!</h1>
        <p>Hi ${name},</p>
        <p>Congratulations! You are officially enrolled in <strong>${courseName}</strong>.</p>
        <div style="background: #F1F5F9; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Start Date:</strong> ${startDate}</p>
          <p><strong>Schedule:</strong> ${schedule}</p>
        </div>
        <p>We look forward to seeing you in class!</p>
      </div>
    `,
  };
}

export function courseReminderEmail(name: string, courseName: string, startDate: string) {
  return {
    subject: "Course Starting Soon — ProDesign Learning Centre",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0F172A;">Your Course Starts in 7 Days!</h1>
        <p>Hi ${name},</p>
        <p>This is a reminder that <strong>${courseName}</strong> begins on <strong>${startDate}</strong>.</p>
        <p>Make sure you're prepared and check your dashboard for any pre-course materials.</p>
      </div>
    `,
  };
}

export function certificateDeliveryEmail(name: string, courseName: string) {
  return {
    subject: "Your Certificate is Ready — ProDesign Learning Centre",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0F172A;">Congratulations, ${name}!</h1>
        <p>You have successfully completed <strong>${courseName}</strong>.</p>
        <p>Your certificate is now available for download in your dashboard.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
          Download Certificate
        </a>
      </div>
    `,
  };
}
