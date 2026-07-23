# User Flows
## ProDesign Mauritius Training Academy

---

## Flow 1: Visitor → Paid Student (Primary Conversion)

```mermaid
flowchart TD
    A[Land on Homepage] --> B{Interested?}
    B -->|No| C[Browse FAQ / Blog / About]
    C --> B
    B -->|Yes| D[View Course Details]
    D --> E{Ready to enroll?}
    E -->|Not yet| F[Download Brochure / Contact / WhatsApp]
    F --> E
    E -->|Yes| G[Click Enroll / Register]
    G --> H[Step 1: Personal Info]
    H --> I[Step 2: Professional Info]
    I --> J[Step 3: Course Selection]
    J --> K[Step 4: Review & Agree]
    K --> L{Validation OK?}
    L -->|No| H
    L -->|Yes| M[Submit Registration]
    M --> N[Registration Email Sent]
    N --> O[Redirect to Checkout]
    O --> P[Review Order Summary]
    P --> Q[Select Payment Method]
    Q --> R{Payment}
    R -->|Success| S[Payment Success Page]
    R -->|Failed| T[Payment Failed Page]
    T --> O
    S --> U[Enrollment Confirmation Email]
    U --> V[Access Student Dashboard]
```

**Target time:** < 3 minutes from landing to payment success

---

## Flow 2: Returning Student

```mermaid
flowchart TD
    A[Visit Site] --> B[Login via Email]
    B --> C[Student Dashboard]
    C --> D{Action}
    D --> E[View Enrollment Status]
    D --> F[Download Invoice]
    D --> G[View Payment History]
    D --> H[Update Profile]
    D --> I[Access Course Info]
```

---

## Flow 3: Admin Operations

```mermaid
flowchart TD
    A[Admin Login] --> B[Admin Dashboard]
    B --> C{Section}
    C --> D[Students: View/Search/Edit]
    C --> E[Courses: Add/Edit/Manage Cohorts]
    C --> F[Payments: View Transactions/Status]
    C --> G[Analytics: Registrations/Revenue/Conversion]
    D --> H[Update Student Record]
    E --> I[Update Course/Cohort Seats]
    F --> J[Mark Payment / Issue Refund]
```

---

## Flow 4: Cross-Site Navigation

```mermaid
flowchart LR
    A[prodesign.mu] -->|Training CTA| B[Training Portal]
    B -->|Main Website link| A
    B -->|About ProDesign section| A
    B -->|Services CTA| A
    A -->|Autodesk Training nav| B
```

---

## Flow 5: Email Automation

```mermaid
flowchart TD
    A[Registration Submitted] --> B[Send Registration Confirmation]
    C[Payment Completed] --> D[Send Payment Confirmation]
    C --> E[Send Enrollment Confirmation]
    F[7 Days Before Cohort Start] --> G[Send Course Reminder]
    H[Course Completed] --> I[Send Certificate Delivery]
    
    B --> J[Log in EmailLog table]
    D --> J
    E --> J
    G --> J
    I --> J
```

---

## Flow 6: Payment (MIPS-Ready Architecture)

```mermaid
sequenceDiagram
    participant S as Student
    participant FE as Frontend
    participant API as API Route
    participant DB as PostgreSQL
    participant MIPS as MIPS Gateway
    participant Email as Resend

    S->>FE: Submit checkout
    FE->>API: POST /api/checkout
    API->>DB: Create Payment (PENDING)
    API->>MIPS: Initiate payment session
    MIPS-->>API: Payment URL / Token
    API-->>FE: Redirect to MIPS
    FE->>MIPS: Complete payment
    MIPS->>API: Webhook callback
    API->>DB: Update Payment (COMPLETED)
    API->>DB: Update Enrollment (ENROLLED)
    API->>DB: Generate Invoice
    API->>DB: Decrement cohort seats
    API->>Email: Send confirmations
    MIPS-->>FE: Redirect to success page
    FE->>S: Show success + dashboard link
```

---

## Registration Form Steps

| Step | Fields | Validation |
|------|--------|------------|
| 1 — Personal | First name*, Last name*, Email*, Phone*, DOB* | Required, email format, phone format |
| 2 — Professional | Occupation*, Company, Experience level* | Required occupation & experience |
| 3 — Course | Course selection*, Cohort selection* | Must select active cohort with seats |
| 4 — Review | Terms agreement checkbox* | Must agree to proceed |

*Required fields

---

## Error States

| Scenario | User Experience |
|----------|-----------------|
| Cohort full | Show "Join waitlist" or next cohort option |
| Payment failed | Clear error message, retry button, support contact |
| Duplicate email | Prompt login or use different email |
| Session expired | Preserve form data, re-authenticate |
| Network error | Toast notification, retry mechanism |

---

## Mobile-Specific Considerations

- Sticky "Enroll Now" bar on course page
- Single-column form layout
- Large touch targets (min 44px)
- WhatsApp button always accessible
- Simplified checkout (Apple Pay ready architecture)
