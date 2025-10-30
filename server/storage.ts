import { 
  users, 
  subscriptionRequests, 
  adminUsers,
  auditLogs,
  userAccounts,
  birdDetails,
  otpAttempts,
  siteMetrics,
  metricsAuditLog,
  appointments,
  blockedSlots,
  appointmentSettings,
  type User, 
  type InsertUser, 
  type SubscriptionRequest, 
  type InsertSubscriptionRequest,
  type AdminUser,
  type InsertAdminUser,
  type InsertAuditLog,
  type AuditLog,
  type UpdateSubscriptionData,
  type UserAccount,
  type InsertUserAccount,
  type BirdDetails,
  type InsertBirdDetails,
  type UpdateBirdDetailsData,
  type OtpAttempt,
  type InsertOtpAttempt,
  type SiteMetric,
  type MetricsAuditLog,
  type InsertMetricsAuditLog,
  type Appointment,
  type InsertAppointment,
  type CreateAppointmentData,
  type UpdateAppointmentData,
  type BlockedSlot,
  type CreateBlockedSlotData,
  type AppointmentSettings,
  type UpdateAppointmentSettingsData
} from "@shared/schema";
import { db } from "./db";
import { eq, or, like, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Regular user methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllSubscribers(): Promise<User[]>;
  updateUserSubscription(id: string, plan: string, status: string): Promise<User | undefined>;
  
  // Subscription methods
  createSubscriptionRequest(request: InsertSubscriptionRequest): Promise<SubscriptionRequest>;
  getAllSubscriptions(): Promise<SubscriptionRequest[]>;
  getSubscriptionById(id: string): Promise<SubscriptionRequest | undefined>;
  updateSubscription(id: string, data: UpdateSubscriptionData): Promise<SubscriptionRequest | undefined>;
  deleteSubscription(id: string): Promise<void>;
  getSubscriptionByPhone(phone: string): Promise<SubscriptionRequest | undefined>;
  
  // Admin methods
  getAdminByMobile(mobile: string): Promise<AdminUser | undefined>;
  getAdmin(id: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
  
  // Audit log methods
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogsBySubscription(subscriptionId: string): Promise<AuditLog[]>;
  
  // User Account methods
  getUserAccount(phone: string): Promise<UserAccount | undefined>;
  createUserAccount(account: InsertUserAccount): Promise<UserAccount>;
  updateUserAccountOTP(phone: string, otp: string, otpExpiry: Date, messageSid: string): Promise<UserAccount | undefined>;
  verifyUserAccountOTP(phone: string): Promise<UserAccount | undefined>;
  getAllUserAccounts(): Promise<UserAccount[]>;
  deleteUserAccount(phone: string): Promise<void>;
  getUserAccountsWithSubscriptions(): Promise<any[]>;
  
  // OTP Attempts methods
  getOtpAttempt(phone: string): Promise<OtpAttempt | undefined>;
  createOtpAttempt(phone: string): Promise<OtpAttempt>;
  incrementOtpAttempts(phone: string): Promise<OtpAttempt | undefined>;
  resetOtpAttempts(phone: string): Promise<void>;
  
  // Bird Details methods
  createBirdDetails(bird: InsertBirdDetails): Promise<BirdDetails>;
  getBirdDetailsByUser(userPhone: string): Promise<BirdDetails[]>;
  getBirdDetailsById(id: string): Promise<BirdDetails | undefined>;
  updateBirdDetails(id: string, data: UpdateBirdDetailsData): Promise<BirdDetails | undefined>;
  deleteBirdDetails(id: string): Promise<void>;
  
  // Site Metrics methods
  getMetric(key: string): Promise<SiteMetric | undefined>;
  updateMetric(key: string, value: number, updatedBy: string): Promise<SiteMetric | undefined>;
  incrementMetric(key: string, delta: number, updatedBy: string, reason: string, adminId?: string): Promise<SiteMetric | undefined>;
  createMetricsAuditLog(log: InsertMetricsAuditLog): Promise<MetricsAuditLog>;
  getMetricsAuditLogs(limit?: number): Promise<MetricsAuditLog[]>;
  
  // Appointment methods
  createAppointment(appointment: CreateAppointmentData): Promise<Appointment>;
  getAppointmentById(id: string): Promise<Appointment | undefined>;
  getUserAppointments(userPhone: string): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getAppointmentBySlot(date: string, time: string): Promise<Appointment | undefined>;
  getAllAppointments(date?: string, status?: string, plan?: string): Promise<any[]>;
  updateAppointment(id: string, data: UpdateAppointmentData): Promise<Appointment | undefined>;
  cancelAppointment(id: string, canceledBy: string, reason?: string, creditRestored?: boolean): Promise<void>;
  updateSubscriptionConsultations(subscriptionId: string, newCount: number): Promise<void>;
  getUserSubscription(userPhone: string): Promise<SubscriptionRequest | undefined>;
  
  // Blocked slots methods
  createBlockedSlot(slot: CreateBlockedSlotData): Promise<BlockedSlot>;
  getBlockedSlotsByDate(date: string): Promise<BlockedSlot[]>;
  getAllBlockedSlots(): Promise<BlockedSlot[]>;
  deleteBlockedSlot(id: string): Promise<void>;
  isSlotBlocked(date: string, time: string): Promise<boolean>;
  
  // Appointment settings methods
  getAppointmentSettings(): Promise<AppointmentSettings | undefined>;
  updateAppointmentSettings(data: UpdateAppointmentSettingsData, updatedBy: string): Promise<AppointmentSettings | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllSubscribers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.isAdmin, false));
  }

  async updateUserSubscription(id: string, plan: string, status: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ subscriptionPlan: plan, subscriptionStatus: status })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async createSubscriptionRequest(insertRequest: InsertSubscriptionRequest): Promise<SubscriptionRequest> {
    const [request] = await db
      .insert(subscriptionRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async getAllSubscriptions(): Promise<SubscriptionRequest[]> {
    return await db.select().from(subscriptionRequests).orderBy(desc(subscriptionRequests.createdAt));
  }

  async getSubscriptionById(id: string): Promise<SubscriptionRequest | undefined> {
    const [subscription] = await db.select().from(subscriptionRequests).where(eq(subscriptionRequests.id, id));
    return subscription || undefined;
  }

  async updateSubscription(id: string, data: UpdateSubscriptionData): Promise<SubscriptionRequest | undefined> {
    const updateData: any = {};
    
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.mobileNumber !== undefined) updateData.mobileNumber = data.mobileNumber;
    if (data.birdSpecies !== undefined) updateData.birdSpecies = data.birdSpecies;
    if (data.subscriptionPlan !== undefined) updateData.subscriptionPlan = data.subscriptionPlan;
    if (data.subscriptionStartDate !== undefined) updateData.subscriptionStartDate = new Date(data.subscriptionStartDate);
    if (data.subscriptionEndDate !== undefined) updateData.subscriptionEndDate = new Date(data.subscriptionEndDate);
    if (data.amountPaid !== undefined) updateData.amountPaid = data.amountPaid;
    if (data.consultationsRemaining !== undefined) updateData.consultationsRemaining = data.consultationsRemaining;
    if (data.status !== undefined) updateData.status = data.status;

    const [subscription] = await db
      .update(subscriptionRequests)
      .set(updateData)
      .where(eq(subscriptionRequests.id, id))
      .returning();
    return subscription || undefined;
  }

  async deleteSubscription(id: string): Promise<void> {
    await db.delete(subscriptionRequests).where(eq(subscriptionRequests.id, id));
  }

  async getAdminByMobile(mobile: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.mobile, mobile));
    return admin || undefined;
  }

  async getAdmin(id: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdminUser): Promise<AdminUser> {
    const [admin] = await db
      .insert(adminUsers)
      .values(insertAdmin)
      .returning();
    return admin;
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db
      .insert(auditLogs)
      .values(insertLog)
      .returning();
    return log;
  }

  async getAuditLogsBySubscription(subscriptionId: string): Promise<AuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.subscriptionId, subscriptionId))
      .orderBy(desc(auditLogs.timestamp));
  }

  async getSubscriptionByPhone(phone: string): Promise<SubscriptionRequest | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptionRequests)
      .where(eq(subscriptionRequests.mobileNumber, phone))
      .orderBy(desc(subscriptionRequests.createdAt))
      .limit(1);
    return subscription || undefined;
  }

  async getUserAccount(phone: string): Promise<UserAccount | undefined> {
    const [account] = await db
      .select()
      .from(userAccounts)
      .where(eq(userAccounts.phone, phone));
    return account || undefined;
  }

  async createUserAccount(insertAccount: InsertUserAccount): Promise<UserAccount> {
    const [account] = await db
      .insert(userAccounts)
      .values(insertAccount)
      .returning();
    return account;
  }

  async createBirdDetails(insertBird: InsertBirdDetails): Promise<BirdDetails> {
    const [bird] = await db
      .insert(birdDetails)
      .values(insertBird)
      .returning();
    return bird;
  }

  async getBirdDetailsByUser(userPhone: string): Promise<BirdDetails[]> {
    return await db
      .select()
      .from(birdDetails)
      .where(eq(birdDetails.userPhone, userPhone))
      .orderBy(desc(birdDetails.createdAt));
  }

  async getBirdDetailsById(id: string): Promise<BirdDetails | undefined> {
    const [bird] = await db
      .select()
      .from(birdDetails)
      .where(eq(birdDetails.id, id));
    return bird || undefined;
  }

  async updateBirdDetails(id: string, data: UpdateBirdDetailsData): Promise<BirdDetails | undefined> {
    const updateData: any = {};
    
    if (data.birdName !== undefined) updateData.birdName = data.birdName;
    if (data.species !== undefined) updateData.species = data.species;
    if (data.ringId !== undefined) updateData.ringId = data.ringId;
    if (data.weight !== undefined) updateData.weight = data.weight;
    if (data.age !== undefined) updateData.age = data.age;
    if (data.issues !== undefined) updateData.issues = data.issues;
    
    updateData.updatedAt = sql`NOW()`;

    const [bird] = await db
      .update(birdDetails)
      .set(updateData)
      .where(eq(birdDetails.id, id))
      .returning();
    return bird || undefined;
  }

  async deleteBirdDetails(id: string): Promise<void> {
    await db.delete(birdDetails).where(eq(birdDetails.id, id));
  }

  async updateUserAccountOTP(phone: string, otp: string, otpExpiry: Date, messageSid: string): Promise<UserAccount | undefined> {
    const [account] = await db
      .update(userAccounts)
      .set({ 
        otp, 
        otpExpiry, 
        twilioMessageSid: messageSid,
        lastOtpSentAt: sql`NOW()`
      })
      .where(eq(userAccounts.phone, phone))
      .returning();
    return account || undefined;
  }

  async verifyUserAccountOTP(phone: string): Promise<UserAccount | undefined> {
    const [account] = await db
      .update(userAccounts)
      .set({ 
        isMobileVerified: true,
        verifiedAt: sql`NOW()`,
        otp: null,
        otpExpiry: null
      })
      .where(eq(userAccounts.phone, phone))
      .returning();
    return account || undefined;
  }

  async getAllUserAccounts(): Promise<UserAccount[]> {
    return await db
      .select()
      .from(userAccounts)
      .orderBy(desc(userAccounts.createdAt));
  }

  async deleteUserAccount(phone: string): Promise<void> {
    await db
      .delete(userAccounts)
      .where(eq(userAccounts.phone, phone));
  }

  async getUserAccountsWithSubscriptions(): Promise<any[]> {
    const results = await db
      .select({
        phone: userAccounts.phone,
        fullName: userAccounts.fullName,
        isMobileVerified: userAccounts.isMobileVerified,
        verifiedAt: userAccounts.verifiedAt,
        createdAt: userAccounts.createdAt,
        subscriptionId: userAccounts.subscriptionId,
        subscription: {
          id: subscriptionRequests.id,
          subscriptionPlan: subscriptionRequests.subscriptionPlan,
          subscriptionStartDate: subscriptionRequests.subscriptionStartDate,
          subscriptionEndDate: subscriptionRequests.subscriptionEndDate,
          amountPaid: subscriptionRequests.amountPaid,
          consultationsRemaining: subscriptionRequests.consultationsRemaining,
          status: subscriptionRequests.status,
          birdSpecies: subscriptionRequests.birdSpecies,
          discountCoupon: subscriptionRequests.discountCoupon,
          razorpayOrderId: subscriptionRequests.razorpayOrderId,
          razorpayPaymentId: subscriptionRequests.razorpayPaymentId,
          paymentStatus: subscriptionRequests.paymentStatus,
        }
      })
      .from(userAccounts)
      .leftJoin(
        subscriptionRequests,
        eq(userAccounts.subscriptionId, subscriptionRequests.id)
      )
      .orderBy(desc(userAccounts.createdAt));

    return results;
  }

  async getOtpAttempt(phone: string): Promise<OtpAttempt | undefined> {
    const [attempt] = await db
      .select()
      .from(otpAttempts)
      .where(eq(otpAttempts.phone, phone));
    return attempt || undefined;
  }

  async createOtpAttempt(phone: string): Promise<OtpAttempt> {
    const [attempt] = await db
      .insert(otpAttempts)
      .values({ phone, attempts: 1 })
      .returning();
    return attempt;
  }

  async incrementOtpAttempts(phone: string): Promise<OtpAttempt | undefined> {
    const [attempt] = await db
      .update(otpAttempts)
      .set({ 
        attempts: sql`${otpAttempts.attempts} + 1`,
        lastAttemptAt: sql`NOW()`
      })
      .where(eq(otpAttempts.phone, phone))
      .returning();
    return attempt || undefined;
  }

  async resetOtpAttempts(phone: string): Promise<void> {
    await db.delete(otpAttempts).where(eq(otpAttempts.phone, phone));
  }

  // Site Metrics methods
  async getMetric(key: string): Promise<SiteMetric | undefined> {
    const [metric] = await db
      .select()
      .from(siteMetrics)
      .where(eq(siteMetrics.key, key));
    return metric || undefined;
  }

  async updateMetric(key: string, value: number, updatedBy: string): Promise<SiteMetric | undefined> {
    const [metric] = await db
      .update(siteMetrics)
      .set({ 
        value, 
        updatedBy, 
        lastUpdatedAt: sql`NOW()`
      })
      .where(eq(siteMetrics.key, key))
      .returning();
    return metric || undefined;
  }

  async incrementMetric(key: string, delta: number, updatedBy: string, reason: string, adminId?: string): Promise<SiteMetric | undefined> {
    // Get current value
    const current = await this.getMetric(key);
    if (!current) {
      return undefined;
    }

    const oldValue = current.value;
    const newValue = oldValue + delta;

    // Update metric using atomic increment
    const [updated] = await db
      .update(siteMetrics)
      .set({ 
        value: sql`${siteMetrics.value} + ${delta}`,
        updatedBy, 
        lastUpdatedAt: sql`NOW()`
      })
      .where(eq(siteMetrics.key, key))
      .returning();

    // Create audit log
    await this.createMetricsAuditLog({
      metricKey: key,
      oldValue,
      newValue,
      delta,
      updatedBy,
      reason,
      adminId: adminId || null,
    });

    return updated || undefined;
  }

  async createMetricsAuditLog(log: InsertMetricsAuditLog): Promise<MetricsAuditLog> {
    const [auditLog] = await db
      .insert(metricsAuditLog)
      .values(log)
      .returning();
    return auditLog;
  }

  async getMetricsAuditLogs(limit: number = 50): Promise<MetricsAuditLog[]> {
    return await db
      .select()
      .from(metricsAuditLog)
      .orderBy(desc(metricsAuditLog.timestamp))
      .limit(limit);
  }

  // Appointment methods
  async createAppointment(appointment: CreateAppointmentData): Promise<Appointment> {
    const [created] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return created;
  }

  async getAppointmentById(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async getUserAppointments(userPhone: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.userPhone, userPhone))
      .orderBy(desc(appointments.appointmentDate));
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    // Convert date string to timestamp format for comparison
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await db
      .select()
      .from(appointments)
      .where(
        sql`DATE(${appointments.appointmentDate}) = DATE(${date}::timestamp)`
      );
  }

  async getAppointmentBySlot(date: string, time: string): Promise<Appointment | undefined> {
    const results = await db
      .select()
      .from(appointments)
      .where(
        sql`DATE(${appointments.appointmentDate}) = DATE(${date}::timestamp) 
        AND ${appointments.slotStartTime} = ${time}
        AND ${appointments.status} != 'canceled'`
      );
    return results[0] || undefined;
  }

  async getAllAppointments(date?: string, status?: string, plan?: string): Promise<any[]> {
    let whereConditions: string[] = [];
    const params: any[] = [];

    if (date) {
      params.push(date);
      whereConditions.push(`DATE(a.appointment_date) = DATE($${params.length}::timestamp)`);
    }

    if (status) {
      params.push(status);
      whereConditions.push(`a.status = $${params.length}`);
    }

    if (plan) {
      params.push(plan);
      whereConditions.push(`sr.subscription_plan = $${params.length}`);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    const query = `
      SELECT 
        a.id,
        a.user_phone as "userPhone",
        ua.full_name as "fullName",
        a.bird_name as "birdName",
        a.appointment_date as "appointmentDate",
        a.slot_start_time as "slotStartTime",
        a.slot_end_time as "slotEndTime",
        a.symptoms,
        a.status,
        sr.subscription_plan as "subscriptionPlan",
        a.canceled_at as "canceledAt",
        a.canceled_by as "canceledBy",
        a.cancellation_reason as "cancellationReason",
        a.admin_notes as "adminNotes",
        a.created_at as "createdAt"
      FROM appointments a
      LEFT JOIN user_accounts ua ON a.user_phone = ua.phone
      LEFT JOIN subscription_requests sr ON a.subscription_id = sr.id
      ${whereClause}
      ORDER BY a.appointment_date DESC
    `;
    
    const results = await db.execute(sql.raw(query,params));
    return results.rows;
  }
  


  async updateAppointment(id: string, data: UpdateAppointmentData): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set({ ...data, updatedAt: sql`NOW()` })
      .where(eq(appointments.id, id))
      .returning();
    return appointment || undefined;
  }

  async cancelAppointment(id: string, canceledBy: string, reason?: string, creditRestored?: boolean): Promise<void> {
    await db
      .update(appointments)
      .set({
        status: 'canceled',
        canceledAt: sql`NOW()`,
        canceledBy,
        cancellationReason: reason || null,
        creditRestored: creditRestored || false,
        updatedAt: sql`NOW()`,
      })
      .where(eq(appointments.id, id));
  }

  async updateSubscriptionConsultations(subscriptionId: string, newCount: number): Promise<void> {
    await db
      .update(subscriptionRequests)
      .set({ consultationsRemaining: newCount })
      .where(eq(subscriptionRequests.id, subscriptionId));
  }

  async getUserSubscription(userPhone: string): Promise<SubscriptionRequest | undefined> {
    const userAccount = await this.getUserAccount(userPhone);
    if (!userAccount || !userAccount.subscriptionId) {
      return undefined;
    }
    return await this.getSubscriptionById(userAccount.subscriptionId);
  }

  // Blocked slots methods
  async createBlockedSlot(slot: CreateBlockedSlotData): Promise<BlockedSlot> {
    const [created] = await db
      .insert(blockedSlots)
      .values(slot)
      .returning();
    return created;
  }

  async getBlockedSlotsByDate(date: string): Promise<BlockedSlot[]> {
    return await db
      .select()
      .from(blockedSlots)
      .where(
        sql`DATE(${blockedSlots.blockDate}) = DATE(${date}::timestamp)`
      );
  }

  async getAllBlockedSlots(): Promise<BlockedSlot[]> {
    return await db
      .select()
      .from(blockedSlots)
      .orderBy(desc(blockedSlots.blockDate));
  }

  async deleteBlockedSlot(id: string): Promise<void> {
    await db.delete(blockedSlots).where(eq(blockedSlots.id, id));
  }

  async isSlotBlocked(date: string, time: string): Promise<boolean> {
    const results = await db
      .select()
      .from(blockedSlots)
      .where(
        sql`DATE(${blockedSlots.blockDate}) = DATE(${date}::timestamp) 
        AND (${blockedSlots.slotStartTime} IS NULL OR ${blockedSlots.slotStartTime} = ${time})`
      );
    return results.length > 0;
  }

  // Appointment settings methods
  async getAppointmentSettings(): Promise<AppointmentSettings | undefined> {
    const [settings] = await db
      .select()
      .from(appointmentSettings)
      .limit(1);
    return settings || undefined;
  }

  async updateAppointmentSettings(data: UpdateAppointmentSettingsData, updatedBy: string): Promise<AppointmentSettings | undefined> {
    const current = await this.getAppointmentSettings();
    if (!current) {
      return undefined;
    }

    const [settings] = await db
      .update(appointmentSettings)
      .set({ ...data, updatedBy, updatedAt: sql`NOW()` })
      .where(eq(appointmentSettings.id, current.id))
      .returning();
    return settings || undefined;
  }
}

export const storage = new DatabaseStorage();
