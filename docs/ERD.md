# Database Entity Relationship Diagram (ERD)
## ProDesign Mauritius Training Academy

**Database:** PostgreSQL (Supabase)  
**ORM:** Prisma

---

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Enrollment : "has"
    User ||--o{ Payment : "makes"
    User ||--o{ Invoice : "receives"
    User ||--o{ Certificate : "earns"
    User ||--o| StudentProfile : "has"
    
    Course ||--o{ Enrollment : "includes"
    Course ||--o{ CourseModule : "contains"
    Course ||--o{ Cohort : "runs"
    
    Cohort ||--o{ Enrollment : "assigns"
    
    Enrollment ||--o| Payment : "paid_by"
    Enrollment ||--o| Certificate : "awards"
    
    Payment ||--|| Invoice : "generates"
    
    User {
        uuid id PK
        string email UK
        string password_hash
        enum role "STUDENT|ADMIN"
        string first_name
        string last_name
        string phone
        date date_of_birth
        datetime created_at
        datetime updated_at
    }
    
    StudentProfile {
        uuid id PK
        uuid user_id FK
        string occupation
        string company
        enum experience_level "BEGINNER|INTERMEDIATE|ADVANCED"
        datetime created_at
        datetime updated_at
    }
    
    Course {
        uuid id PK
        string slug UK
        string title
        text description
        text overview
        decimal price
        decimal tax_rate
        int duration_weeks
        int max_seats
        string instructor_name
        text instructor_bio
        string instructor_image
        jsonb curriculum
        jsonb learning_outcomes
        jsonb features
        boolean is_active
        boolean is_featured
        datetime created_at
        datetime updated_at
    }
    
    CourseModule {
        uuid id PK
        uuid course_id FK
        int week_number
        string title
        text description
        jsonb topics
        int sort_order
    }
    
    Cohort {
        uuid id PK
        uuid course_id FK
        string name
        date start_date
        date end_date
        string schedule
        int seats_total
        int seats_available
        enum status "UPCOMING|ACTIVE|COMPLETED|CANCELLED"
        datetime created_at
    }
    
    Enrollment {
        uuid id PK
        uuid user_id FK
        uuid course_id FK
        uuid cohort_id FK
        enum status "PENDING|PAYMENT_PENDING|ENROLLED|COMPLETED|CANCELLED"
        datetime enrolled_at
        datetime completed_at
        datetime created_at
        datetime updated_at
    }
    
    Payment {
        uuid id PK
        uuid user_id FK
        uuid enrollment_id FK
        decimal amount
        decimal tax_amount
        decimal total_amount
        string currency
        enum method "CREDIT_CARD|DEBIT_CARD|MIPS"
        enum status "PENDING|PROCESSING|COMPLETED|FAILED|REFUNDED"
        string transaction_id
        string mips_reference
        jsonb metadata
        datetime paid_at
        datetime created_at
        datetime updated_at
    }
    
    Invoice {
        uuid id PK
        uuid user_id FK
        uuid payment_id FK
        string invoice_number UK
        decimal subtotal
        decimal tax_amount
        decimal total_amount
        string currency
        string pdf_url
        enum status "DRAFT|ISSUED|PAID|VOID"
        datetime issued_at
        datetime created_at
    }
    
    Certificate {
        uuid id PK
        uuid user_id FK
        uuid enrollment_id FK
        uuid course_id FK
        string certificate_number UK
        string pdf_url
        datetime issued_at
        datetime created_at
    }
    
    ContactSubmission {
        uuid id PK
        string name
        string email
        string phone
        string subject
        text message
        enum status "NEW|READ|REPLIED"
        datetime created_at
    }
    
    NewsletterSubscriber {
        uuid id PK
        string email UK
        boolean is_active
        datetime subscribed_at
    }
    
    EmailLog {
        uuid id PK
        uuid user_id FK
        string email_type
        string recipient
        string subject
        enum status "SENT|FAILED|BOUNCED"
        jsonb metadata
        datetime sent_at
        datetime created_at
    }
    
    AnalyticsEvent {
        uuid id PK
        string event_type
        string page_path
        uuid user_id FK
        jsonb metadata
        datetime created_at
    }
```

---

## Table Relationships Summary

| Parent | Child | Relationship | Cascade |
|--------|-------|--------------|---------|
| User | StudentProfile | 1:1 | Delete profile on user delete |
| User | Enrollment | 1:N | Restrict if payments exist |
| User | Payment | 1:N | — |
| User | Invoice | 1:N | — |
| User | Certificate | 1:N | — |
| Course | CourseModule | 1:N | Cascade delete modules |
| Course | Cohort | 1:N | Restrict if enrollments exist |
| Course | Enrollment | 1:N | — |
| Cohort | Enrollment | 1:N | — |
| Enrollment | Payment | 1:1 | — |
| Enrollment | Certificate | 1:1 | — |
| Payment | Invoice | 1:1 | — |

---

## Key Indexes

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_cohorts_start_date ON cohorts(start_date);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
```

---

## Enums

```typescript
enum UserRole { STUDENT, ADMIN }
enum ExperienceLevel { BEGINNER, INTERMEDIATE, ADVANCED }
enum EnrollmentStatus { PENDING, PAYMENT_PENDING, ENROLLED, COMPLETED, CANCELLED }
enum PaymentMethod { CREDIT_CARD, DEBIT_CARD, MIPS }
enum PaymentStatus { PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED }
enum InvoiceStatus { DRAFT, ISSUED, PAID, VOID }
enum CohortStatus { UPCOMING, ACTIVE, COMPLETED, CANCELLED }
enum ContactStatus { NEW, READ, REPLIED }
enum EmailStatus { SENT, FAILED, BOUNCED }
```

---

## Sample Seed Data

| Entity | Sample |
|--------|--------|
| Course | Revit Foundation, MUR 25,000, 8 weeks, 20 seats |
| Cohort | "Cohort 1 — Aug 2026", starts 2026-08-15 |
| Admin User | admin@prodesign.mu |
| CourseModules | 8 weekly modules with topics |
