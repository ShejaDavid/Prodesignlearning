import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export const professionalInfoSchema = z.object({
  occupation: z.string().min(2, "Occupation is required"),
  company: z.string().optional(),
  experienceLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
    message: "Please select your experience level",
  }),
});

export const courseSelectionSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  cohortId: z.string().min(1, "Please select a cohort"),
});

export const agreementSchema = z.object({
  agreedToTerms: z.literal(true, {
    message: "You must agree to the terms and conditions",
  }),
});

export const registrationSchema = personalInfoSchema
  .merge(professionalInfoSchema)
  .merge(courseSelectionSchema)
  .merge(agreementSchema);

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export const setPasswordSchema = z
  .object({
    token: z.string().min(1, "Missing token"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Admin manually onboarding a student into a cohort.
export const adminEnrollSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  cohortId: z.string().min(1, "Please select a cohort"),
  // Optional ISO date string; empty means access never expires.
  accessExpiresAt: z.string().optional(),
});

export type AdminEnrollFormData = z.infer<typeof adminEnrollSchema>;

// Admin: update a specific enrolment from a cohort roster. Status changes are
// preferred over deleting the row, so cancellation history is preserved.
export const adminEnrollmentUpdateSchema = z.object({
  status: z.enum(["PENDING", "PAYMENT_PENDING", "ENROLLED", "COMPLETED", "CANCELLED"]),
});

export type AdminEnrollmentUpdateFormData = z.infer<typeof adminEnrollmentUpdateSchema>;

// Admin: create a bare student record (no enrolment; use the enrol flow for access).
export const adminStudentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

export type AdminStudentFormData = z.infer<typeof adminStudentSchema>;

// Admin: create a course.
export const adminCourseSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  overview: z.string().min(10, "Overview must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  taxRate: z.coerce.number().min(0).max(1).default(0),
  durationHours: z.coerce.number().int().min(1, "At least 1 hour"),
  durationDays: z.coerce.number().int().min(1).default(1),
  maxSeats: z.coerce.number().int().min(1).default(20),
  instructorName: z.string().min(2, "Instructor name is required"),
  instructorBio: z.string().min(2, "Instructor bio is required"),
  isActive: z.boolean().default(true),
});

export type AdminCourseFormData = z.infer<typeof adminCourseSchema>;

// Admin: edit an existing course (full replacement, same rules as create).
export const adminCourseUpdateSchema = adminCourseSchema.extend({
  id: z.string().min(1, "Missing course id"),
});

export type AdminCourseUpdateFormData = z.infer<typeof adminCourseUpdateSchema>;

// Admin: create a cohort (a dated, scheduled run of a course).
export const adminCohortSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  name: z.string().min(2, "Name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  schedule: z.string().min(2, "Schedule is required"),
  deliveryMethod: z.enum(["IN_PERSON", "ONLINE", "HYBRID"]).default("IN_PERSON"),
  venue: z.string().optional(),
  seatsTotal: z.coerce.number().int().min(1, "At least 1 seat"),
  status: z
    .enum(["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"])
    .default("UPCOMING"),
});

export type AdminCohortFormData = z.infer<typeof adminCohortSchema>;

// Admin: edit an existing cohort. seatsAvailable is editable directly here
// (e.g. to correct it manually) rather than only ever derived from seatsTotal.
export const adminCohortUpdateSchema = adminCohortSchema.extend({
  id: z.string().min(1, "Missing cohort id"),
  seatsAvailable: z.coerce.number().int().min(0, "Cannot be negative"),
});

export type AdminCohortUpdateFormData = z.infer<typeof adminCohortUpdateSchema>;

// Admin: add a video to a module — either an external URL or a Mux upload.
export const adminVideoSchema = z
  .object({
    moduleId: z.string().min(1, "Module is required"),
    title: z.string().min(2, "Title is required"),
    description: z.string().optional(),
    provider: z.enum(["URL", "MUX"]),
    url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    // When set, attach an existing (signed) Mux playback id instead of uploading.
    muxPlaybackId: z.string().optional(),
  })
  .refine((d) => d.provider !== "URL" || (d.url && d.url.length > 0), {
    message: "A video URL is required",
    path: ["url"],
  });

export type AdminVideoFormData = z.infer<typeof adminVideoSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const checkoutSchema = z.object({
  enrollmentId: z.string().min(1),
  paymentMethod: z.enum(["CREDIT_CARD", "DEBIT_CARD", "MIPS"]),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
