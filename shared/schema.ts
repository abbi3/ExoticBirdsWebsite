import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  fullName: text("full_name").notNull(),
  subscriptionPlan: text("subscription_plan"),
  subscriptionStatus: text("subscription_status").default("active"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptionRequests = pgTable("subscription_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  birdSpecies: text("bird_species").notNull(),
  transactionId: text("transaction_id"), // Optional - for manual UPI payments
  subscriptionPlan: text("subscription_plan"), // monthly, six-month, annual - nullable temporarily for migration
  subscriptionStartDate: timestamp("subscription_start_date").defaultNow(),
  subscriptionEndDate: timestamp("subscription_end_date"),
  amountPaid: integer("amount_paid"), // amount in rupees - nullable temporarily for migration
  consultationsRemaining: integer("consultations_remaining"), // 2, 18, or 48 - nullable temporarily for migration
  discountCoupon: text("discount_coupon"), // coupon code if applied
  status: text("status").default("active").notNull(), // active, expired, exhausted
  razorpayOrderId: text("razorpay_order_id"), // Razorpay order ID
  razorpayPaymentId: text("razorpay_payment_id"), // Razorpay payment ID
  razorpaySignature: text("razorpay_signature"), // Razorpay payment signature
  paymentStatus: text("payment_status").default("pending"), // pending, success, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mobile: text("mobile").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull().references(() => adminUsers.id),
  subscriptionId: varchar("subscription_id").notNull().references(() => subscriptionRequests.id, { onDelete: "cascade" }),
  action: text("action").notNull(), // e.g., "updated_consultations"
  previousValue: text("previous_value"),
  newValue: text("new_value").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const userAccounts = pgTable("user_accounts", {
  phone: text("phone").primaryKey(), // Phone number as user ID
  password: text("password").notNull(), // Hashed password
  fullName: text("full_name").notNull(), // User's full name
  subscriptionId: varchar("subscription_id").references(() => subscriptionRequests.id), // Optional subscription reference
  otp: text("otp"), // Encrypted OTP
  otpExpiry: timestamp("otp_expiry"), // OTP expiration time
  isMobileVerified: boolean("is_mobile_verified").default(false).notNull(), // Mobile verification status
  verifiedAt: timestamp("verified_at"), // Verification timestamp
  twilioMessageSid: text("twilio_message_sid"), // Twilio message SID for tracking
  lastOtpSentAt: timestamp("last_otp_sent_at"), // Last OTP sent time for resend cooldown
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const birdDetails = pgTable("bird_details", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userPhone: text("user_phone").notNull().references(() => userAccounts.phone, { onDelete: "cascade" }),
  birdName: text("bird_name").notNull(),
  species: text("species").notNull(),
  ringId: text("ring_id"),
  weight: integer("weight"), // in grams
  age: text("age"), // e.g., "6 months", "2 years"
  issues: text("issues"), // multi-line symptoms/issues
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const otpAttempts = pgTable("otp_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull(), // Phone number attempting verification
  attempts: integer("attempts").default(0).notNull(), // Number of failed attempts
  lastAttemptAt: timestamp("last_attempt_at").defaultNow().notNull(), // Last attempt timestamp
  windowStartAt: timestamp("window_start_at").defaultNow().notNull(), // Start of 10-minute window
});

export const siteMetrics = pgTable("site_metrics", {
  key: text("key").primaryKey(), // e.g., "active_subscriptions"
  value: integer("value").notNull(), // numeric value
  lastUpdatedAt: timestamp("last_updated_at").defaultNow().notNull(),
  updatedBy: text("updated_by").notNull(), // 'system', 'admin', 'payment'
});

export const metricsAuditLog = pgTable("metrics_audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricKey: text("metric_key").notNull(), // e.g., "active_subscriptions"
  oldValue: integer("old_value"),
  newValue: integer("new_value").notNull(),
  delta: integer("delta").notNull(), // change amount
  updatedBy: text("updated_by").notNull(), // 'system', 'admin', 'payment'
  reason: text("reason"), // description of why it changed
  adminId: varchar("admin_id").references(() => adminUsers.id), // if updated by admin
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = insertUserSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().nullable().optional(),
  subscriptionPlan: z.string().nullable().optional(),
  subscriptionStatus: z.string().nullable().optional(),
  isAdmin: z.boolean().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

export const insertSubscriptionRequestSchema = createInsertSchema(subscriptionRequests).omit({
  id: true,
  createdAt: true,
  status: true,
  subscriptionStartDate: true,
  subscriptionEndDate: true,
  amountPaid: true,
  consultationsRemaining: true,
});

export const subscriptionRequestSchema = insertSubscriptionRequestSchema.extend({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  birdSpecies: z.string().min(1, "Please select a bird species"),
  transactionId: z.string().regex(/^[A-Z0-9]{10,16}$/i, "Please enter a valid UPI transaction ID (10-16 characters). For assistance, contact +91 90142 84059").optional(),
  subscriptionPlan: z.enum(["monthly", "six-month", "annual"]),
  discountCoupon: z.string().optional(),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
  paymentStatus: z.enum(["pending", "success", "failed"]).optional(),
});

export type InsertSubscriptionRequest = z.infer<typeof insertSubscriptionRequestSchema>;
export type SubscriptionRequest = typeof subscriptionRequests.$inferSelect;
export type SubscriptionRequestData = z.infer<typeof subscriptionRequestSchema>;

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const adminLoginSchema = z.object({
  mobile: z.string().regex(/^\+\d{10,15}$/, "Please enter a valid mobile number"),
  password: z.string().min(1, "Password is required"),
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminLoginCredentials = z.infer<typeof adminLoginSchema>;

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

export const updateSubscriptionSchema = z.object({
  fullName: z.string().min(2).optional(),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/).optional(),
  birdSpecies: z.string().min(1).optional(),
  subscriptionPlan: z.enum(["monthly", "six-month", "annual"]).optional(),
  subscriptionStartDate: z.string().optional(),
  subscriptionEndDate: z.string().optional(),
  amountPaid: z.number().optional(),
  consultationsRemaining: z.number().optional(),
  status: z.enum(["active", "expired", "exhausted"]).optional(),
});

export type UpdateSubscriptionData = z.infer<typeof updateSubscriptionSchema>;

export const birdSchema = z.object({
  id: z.string(),
  name: z.string(),
  scientificName: z.string(),
  slug: z.string(),
  image: z.string(),
  size: z.enum(["small", "medium", "large"]),
  noiseLevel: z.enum(["quiet", "moderate", "loud"]),
  traits: z.array(z.string()),
  lifespan: z.string(),
  origin: z.string(),
  behavior: z.string(),
  diet: z.string(),
  humanCompatibility: z.string(),
  priceMin: z.number(),
  priceMax: z.number(),
  lastUpdated: z.string(),
  prosAsPet: z.array(z.string()),
  consAsPet: z.array(z.string()),
  careChecklist: z.array(z.string()),
  legalNotes: z.string().optional(),
});

export const insertBirdSchema = birdSchema.omit({ id: true });

export type Bird = z.infer<typeof birdSchema>;
export type InsertBird = z.infer<typeof insertBirdSchema>;

export const insertUserAccountSchema = createInsertSchema(userAccounts).omit({
  createdAt: true,
});

export const userAccountRegistrationSchema = z.object({
  phone: z.string().regex(/^(\+\d{1,4}\d{7,15}|[6-9]\d{9})$/, "Please enter a valid mobile number"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one capital letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  subscriptionId: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const userAccountLoginSchema = z.object({
  phone: z.string().regex(/^(\+\d{1,4}\d{7,15}|[6-9]\d{9})$/, "Please enter a valid mobile number"),
  password: z.string().min(1, "Password is required"),
});

export const userAccountSignupSchema = z.object({
  phone: z.string().regex(/^(\+\d{1,4}\d{7,15}|[6-9]\d{9})$/, "Please enter a valid mobile number"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one capital letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
});

export type InsertUserAccount = z.infer<typeof insertUserAccountSchema>;
export type UserAccount = typeof userAccounts.$inferSelect;
export type UserAccountRegistrationData = z.infer<typeof userAccountRegistrationSchema>;
export type UserAccountLoginData = z.infer<typeof userAccountLoginSchema>;
export type UserAccountSignupData = z.infer<typeof userAccountSignupSchema>;

export const insertBirdDetailsSchema = createInsertSchema(birdDetails).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const birdDetailsSchema = insertBirdDetailsSchema.extend({
  birdName: z.string().min(1, "Bird name is required"),
  species: z.string().min(1, "Species is required"),
  ringId: z.string().optional(),
  weight: z.number().optional(),
  age: z.string().optional(),
  issues: z.string().optional(),
});

export const updateBirdDetailsSchema = z.object({
  birdName: z.string().min(1).optional(),
  species: z.string().min(1).optional(),
  ringId: z.string().optional(),
  weight: z.number().optional(),
  age: z.string().optional(),
  issues: z.string().optional(),
});

export type InsertBirdDetails = z.infer<typeof insertBirdDetailsSchema>;
export type BirdDetails = typeof birdDetails.$inferSelect;
export type BirdDetailsData = z.infer<typeof birdDetailsSchema>;
export type UpdateBirdDetailsData = z.infer<typeof updateBirdDetailsSchema>;

export const sendOtpSchema = z.object({
  phone: z.string().regex(/^(\+\d{1,4}\d{7,15}|[6-9]\d{9})$/, "Please enter a valid mobile number"),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^(\+\d{1,4}\d{7,15}|[6-9]\d{9})$/, "Please enter a valid mobile number"),
  otp: z.string().length(4, "OTP must be 4 digits").regex(/^\d{4}$/, "OTP must contain only numbers"),
});

export const insertOtpAttemptSchema = createInsertSchema(otpAttempts).omit({
  id: true,
  lastAttemptAt: true,
  windowStartAt: true,
});

export type SendOtpData = z.infer<typeof sendOtpSchema>;
export type VerifyOtpData = z.infer<typeof verifyOtpSchema>;
export type InsertOtpAttempt = z.infer<typeof insertOtpAttemptSchema>;
export type OtpAttempt = typeof otpAttempts.$inferSelect;

// Site Metrics types
export type SiteMetric = typeof siteMetrics.$inferSelect;
export type MetricsAuditLog = typeof metricsAuditLog.$inferSelect;

export const insertSiteMetricSchema = createInsertSchema(siteMetrics);
export const insertMetricsAuditLogSchema = createInsertSchema(metricsAuditLog).omit({
  id: true,
  timestamp: true,
});

export type InsertSiteMetric = z.infer<typeof insertSiteMetricSchema>;
export type InsertMetricsAuditLog = z.infer<typeof insertMetricsAuditLogSchema>;

// Appointment Booking Tables
export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userPhone: text("user_phone").notNull().references(() => userAccounts.phone, { onDelete: "cascade" }),
  subscriptionId: varchar("subscription_id").notNull().references(() => subscriptionRequests.id, { onDelete: "cascade" }),
  birdId: varchar("bird_id").references(() => birdDetails.id, { onDelete: "set null" }),
  birdName: text("bird_name").notNull(), // Store bird name for records even if bird is deleted
  appointmentDate: timestamp("appointment_date", { mode: "string" }).notNull(), // Date and time in ISO format
  slotStartTime: text("slot_start_time").notNull(), // e.g., "10:00"
  slotEndTime: text("slot_end_time").notNull(), // e.g., "10:30"
  symptoms: text("symptoms").notNull(), // Description of bird's issues
  imageUrl: text("image_url"), // Optional uploaded image
  status: text("status").default("booked").notNull(), // booked, completed, canceled, missed
  canceledAt: timestamp("canceled_at"), // When appointment was canceled
  canceledBy: text("canceled_by"), // 'user' or 'admin'
  cancellationReason: text("cancellation_reason"),
  creditRestored: boolean("credit_restored").default(false).notNull(), // Whether consultation credit was restored
  adminNotes: text("admin_notes"), // Admin can add notes
  reminderSent24h: boolean("reminder_sent_24h").default(false).notNull(), // Track if 24h reminder sent
  reminderSent1h: boolean("reminder_sent_1h").default(false).notNull(), // Track if 1h reminder sent
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blockedSlots = pgTable("blocked_slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  blockDate: timestamp("block_date", { mode: "string" }).notNull(), // Full day block or specific date
  slotStartTime: text("slot_start_time"), // null means full day block
  slotEndTime: text("slot_end_time"), // null means full day block
  reason: text("reason").notNull(), // e.g., "Holiday", "Leave", "Maintenance"
  blockedBy: varchar("blocked_by").notNull().references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appointmentSettings = pgTable("appointment_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slotDuration: integer("slot_duration").default(30).notNull(), // in minutes
  bufferTime: integer("buffer_time").default(0).notNull(), // buffer between slots in minutes
  workingHoursStart: text("working_hours_start").default("10:00").notNull(),
  workingHoursEnd: text("working_hours_end").default("17:00").notNull(),
  timezone: text("timezone").default("Asia/Kolkata").notNull(),
  maxAdvanceBookingDays: integer("max_advance_booking_days").default(30).notNull(), // How far in advance users can book
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: varchar("updated_by").references(() => adminUsers.id),
});

// Appointment schemas
export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  canceledAt: true,
  canceledBy: true,
  cancellationReason: true,
  creditRestored: true,
  adminNotes: true,
  reminderSent24h: true,
  reminderSent1h: true,
});

export const createAppointmentSchema = insertAppointmentSchema.extend({
  userPhone: z.string(),
  subscriptionId: z.string(),
  birdId: z.string().optional(),
  birdName: z.string().min(1, "Bird name is required"),
  appointmentDate: z.string(), // ISO date string
  slotStartTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  slotEndTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  symptoms: z.string().min(10, "Please provide at least 10 characters describing the symptoms"),
  imageUrl: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(["booked", "completed", "canceled", "missed"]).optional(),
  adminNotes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const insertBlockedSlotSchema = createInsertSchema(blockedSlots).omit({
  id: true,
  createdAt: true,
});

export const createBlockedSlotSchema = insertBlockedSlotSchema.extend({
  blockDate: z.string(), // ISO date string
  slotStartTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format").optional(),
  slotEndTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format").optional(),
  reason: z.string().min(1, "Reason is required"),
  blockedBy: z.string(),
});

export const updateAppointmentSettingsSchema = z.object({
  slotDuration: z.number().min(15).max(120).optional(),
  bufferTime: z.number().min(0).max(60).optional(),
  workingHoursStart: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format").optional(),
  workingHoursEnd: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format").optional(),
  maxAdvanceBookingDays: z.number().min(1).max(90).optional(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type CreateAppointmentData = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentData = z.infer<typeof updateAppointmentSchema>;

export type BlockedSlot = typeof blockedSlots.$inferSelect;
export type InsertBlockedSlot = z.infer<typeof insertBlockedSlotSchema>;
export type CreateBlockedSlotData = z.infer<typeof createBlockedSlotSchema>;

export type AppointmentSettings = typeof appointmentSettings.$inferSelect;
export type UpdateAppointmentSettingsData = z.infer<typeof updateAppointmentSettingsSchema>;
