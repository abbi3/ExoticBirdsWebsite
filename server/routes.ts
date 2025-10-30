import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { userAccounts } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import Razorpay from "razorpay";
import crypto from "crypto";
import { 
  registerSchema, 
  loginSchema, 
  subscriptionRequestSchema, 
  adminLoginSchema,
  updateSubscriptionSchema,
  userAccountRegistrationSchema,
  userAccountLoginSchema,
  userAccountSignupSchema,
  birdDetailsSchema,
  updateBirdDetailsSchema,
  sendOtpSchema,
  verifyOtpSchema,
  createAppointmentSchema,
  updateAppointmentSchema,
  createBlockedSlotSchema,
  updateAppointmentSettingsSchema,
  type User 
} from "@shared/schema";
import { sendSMS } from "./twilio";
import { generateOTP, encryptOTP, validateOTP, getOTPExpiry, isOTPExpired, canResendOTP, getRemainingCooldown } from "./otp";
import { fromError } from "zod-validation-error";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

// Validate Razorpay credentials on startup
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('⚠️  WARNING: Razorpay credentials not configured. Payment features will not work.');
  console.error('Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment secrets.');
} else {
  console.log('✓ Razorpay initialized with key:', process.env.RAZORPAY_KEY_ID.substring(0, 15) + '...');
}

declare module "express-session" {
  interface SessionData {
    userId: string;
    adminId: string;
    userPhone: string; // User account phone number
  }
}

// Helper to calculate subscription end date
function calculateEndDate(plan: string, startDate: Date): Date {
  const endDate = new Date(startDate);
  if (plan === "monthly") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (plan === "six-month") {
    endDate.setMonth(endDate.getMonth() + 6);
  } else if (plan === "annual") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  return endDate;
}

// Helper to get consultation count
function getConsultationCount(plan: string): number {
  if (plan === "monthly") return 2;
  if (plan === "six-month") return 18;
  if (plan === "annual") return 48;
  return 2; // default
}

// Helper to get plan amount
function getPlanAmount(plan: string): number {
  if (plan === "monthly") return 2200;
  if (plan === "six-month") return 12375;
  if (plan === "annual") return 23100;
  return 2200; // default
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const result = registerSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const { username, password, email, fullName, phone, subscriptionPlan } = result.data;

      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        fullName,
        phone: phone || null,
        subscriptionPlan: subscriptionPlan || null,
        subscriptionStatus: "active",
        isAdmin: false,
      });

      // Regenerate session for new user to prevent session fixation
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ message: "Session error" });
        }

        // Set user ID in the new session
        req.session.userId = user.id;
        // Ensure no admin ID is present
        delete req.session.adminId;

        // Save session
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ message: "Session error" });
          }

          const { password: _, ...userWithoutPassword } = user;
          res.json({ user: userWithoutPassword });
        });
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const result = loginSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const { username, password } = result.data;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Regenerate session to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ message: "Session error" });
        }

        // Set user ID in the new session
        req.session.userId = user.id;
        // Ensure no admin ID is present
        delete req.session.adminId;

        // Save session
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ message: "Session error" });
          }

          const { password: _, ...userWithoutPassword } = user;
          res.json({ user: userWithoutPassword });
        });
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/session", async (req, res, next) => {
    try {
      if (!req.session.userId) {
        return res.json({ user: null });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.json({ user: null });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      next(error);
    }
  });

  // Subscription request routes
  app.post("/api/subscription-requests", async (req, res, next) => {
    try {
      const result = subscriptionRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const { subscriptionPlan, discountCoupon, ...otherData } = result.data;
      
      // Calculate subscription details
      const startDate = new Date();
      const endDate = calculateEndDate(subscriptionPlan, startDate);
      const consultationsRemaining = getConsultationCount(subscriptionPlan);
      const baseAmount = getPlanAmount(subscriptionPlan);
      
      // Apply discount if coupon exists
      let amountPaid = baseAmount;
      if (discountCoupon) {
        const couponUpper = discountCoupon.toUpperCase();
        
        // Special test coupon: Sets amount to Rs. 1 for any plan
        if (couponUpper === 'FFFTEST') {
          amountPaid = 1;
        } else {
          // Percentage-based discount coupons
          const validCoupons: { [key: string]: number } = {
            'FFF796': 10, 'FFF806': 20, 'FFF816': 30, 'FFF826': 40, 'FFF836': 50,
            'FFF846': 60, 'FFF856': 70, 'FFF866': 80, 'FFF876': 90, 'FFF886': 100
          };
          const discountPercent = validCoupons[couponUpper] || 0;
          amountPaid = baseAmount - (baseAmount * discountPercent / 100);
        }
      }

      const subscriptionRequest = await storage.createSubscriptionRequest({
        ...otherData,
        subscriptionPlan,
        discountCoupon: discountCoupon || null,
      } as any);
      
      // Update with calculated fields (using separate update since they're not in insert schema)
      const updatedSubscription = await storage.updateSubscription(subscriptionRequest.id, {
        subscriptionStartDate: startDate.toISOString(),
        subscriptionEndDate: endDate.toISOString(),
        amountPaid: Math.round(amountPaid),
        consultationsRemaining,
      });
      
      res.json({ subscriptionRequest: updatedSubscription || subscriptionRequest });
    } catch (error) {
      next(error);
    }
  });

  // Razorpay routes
  app.post("/api/razorpay/create-order", async (req, res, next) => {
    try {
      // Check if Razorpay is configured
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error('Razorpay credentials not configured');
        return res.status(500).json({ 
          success: false, 
          message: "Payment gateway not configured. Please contact support." 
        });
      }

      const { subscriptionPlan, discountCoupon } = req.body;

      if (!subscriptionPlan) {
        return res.status(400).json({ message: "Subscription plan is required" });
      }

      // Validate subscription plan
      const validPlans = ['monthly', 'six-month', 'annual'];
      if (!validPlans.includes(subscriptionPlan)) {
        return res.status(400).json({ message: "Invalid subscription plan" });
      }

      // SERVER-SIDE PRICE CALCULATION (never trust client)
      const baseAmount = getPlanAmount(subscriptionPlan);
      
      // Apply discount if coupon exists (validate server-side)
      let finalAmount = baseAmount;
      if (discountCoupon) {
        const couponUpper = discountCoupon.toUpperCase();
        
        // Special test coupon: Sets amount to Rs. 1 for any plan
        if (couponUpper === 'FFFTEST') {
          finalAmount = 1;
        } else {
          // Percentage-based discount coupons
          const validCoupons: { [key: string]: number } = {
            'FFF796': 10, 'FFF806': 20, 'FFF816': 30, 'FFF826': 40, 'FFF836': 50,
            'FFF846': 60, 'FFF856': 70, 'FFF866': 80, 'FFF876': 90, 'FFF886': 100
          };
          const discountPercent = validCoupons[couponUpper] || 0;
          finalAmount = baseAmount - (baseAmount * discountPercent / 100);
        }
      }

      // Create Razorpay order with SERVER-CALCULATED amount
      const options = {
        amount: Math.round(finalAmount * 100), // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          subscriptionPlan,
          discountCoupon: discountCoupon || '',
          calculatedAmount: Math.round(finalAmount) // Store for verification
        }
      };

      console.log('Creating Razorpay order:', {
        plan: subscriptionPlan,
        amount: options.amount,
        currency: options.currency
      });

      const order = await razorpay.orders.create(options);
      
      console.log('Razorpay order created successfully:', order.id);
      
      res.json({ 
        success: true, 
        order,
        key_id: process.env.RAZORPAY_KEY_ID 
      });
    } catch (error: any) {
      console.error('Razorpay order creation error:', error);
      
      // Provide more helpful error messages
      let errorMessage = "Failed to create payment order";
      if (error.statusCode === 401) {
        errorMessage = "Payment gateway authentication failed. Please contact support.";
        console.error('⚠️  Razorpay authentication failed. Please verify your API credentials.');
      } else if (error.error?.description) {
        errorMessage = error.error.description;
      }
      
      res.status(500).json({ 
        success: false, 
        message: errorMessage
      });
    }
  });

  app.post("/api/razorpay/verify-payment", async (req, res, next) => {
    try {
      const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        fullName,
        mobileNumber,
        birdSpecies,
        subscriptionPlan,
        discountCoupon
      } = req.body;

      // Validate required fields
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing payment verification details' 
        });
      }

      if (!fullName || !mobileNumber || !birdSpecies || !subscriptionPlan) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing subscription details' 
        });
      }

      // Verify payment signature
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid payment signature' 
        });
      }

      // Fetch order from Razorpay to verify amount paid
      const order = await razorpay.orders.fetch(razorpay_order_id);
      
      // SERVER-SIDE AMOUNT VERIFICATION
      const baseAmount = getPlanAmount(subscriptionPlan);
      let expectedAmount = baseAmount;
      if (discountCoupon) {
        const couponUpper = discountCoupon.toUpperCase();
        
        // Special test coupon: Sets amount to Rs. 1 for any plan
        if (couponUpper === 'FFFTEST') {
          expectedAmount = 1;
        } else {
          // Percentage-based discount coupons
          const validCoupons: { [key: string]: number } = {
            'FFF796': 10, 'FFF806': 20, 'FFF816': 30, 'FFF826': 40, 'FFF836': 50,
            'FFF846': 60, 'FFF856': 70, 'FFF866': 80, 'FFF876': 90, 'FFF886': 100
          };
          const discountPercent = validCoupons[couponUpper] || 0;
          expectedAmount = baseAmount - (baseAmount * discountPercent / 100);
        }
      }

      // Verify the amount paid matches expected amount (in paise)
      const expectedAmountInPaise = Math.round(expectedAmount * 100);
      if (order.amount !== expectedAmountInPaise) {
        console.error(`Payment amount mismatch: Expected ${expectedAmountInPaise}, Got ${order.amount}`);
        return res.status(400).json({ 
          success: false, 
          message: 'Payment amount verification failed' 
        });
      }

      // Payment verified successfully - Create subscription
      const startDate = new Date();
      const endDate = calculateEndDate(subscriptionPlan, startDate);
      const consultationsRemaining = getConsultationCount(subscriptionPlan);

      const subscriptionRequest = await storage.createSubscriptionRequest({
        fullName,
        mobileNumber,
        birdSpecies,
        subscriptionPlan,
        discountCoupon: discountCoupon || null,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: 'success',
        transactionId: razorpay_payment_id, // Use payment ID as transaction ID
      } as any);
      
      // Update with calculated fields
      const updatedSubscription = await storage.updateSubscription(subscriptionRequest.id, {
        subscriptionStartDate: startDate.toISOString(),
        subscriptionEndDate: endDate.toISOString(),
        amountPaid: Math.round(expectedAmount),
        consultationsRemaining,
      });
      
      // Increment active subscriptions metric
      await storage.incrementMetric(
        "active_subscriptions",
        1,
        "payment",
        `Successful payment for ${subscriptionPlan} plan`
      );
      
      res.json({ 
        success: true, 
        message: 'Payment verified successfully',
        subscriptionRequest: updatedSubscription || subscriptionRequest 
      });
    } catch (error: any) {
      console.error('Payment verification error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || "Payment verification failed" 
      });
    }
  });

  // User Account routes
  // Unified login endpoint (checks both admin and user)
  app.post("/api/login", async (req, res, next) => {
    try {
      const { mobile, password } = req.body;

      if (!mobile || !password) {
        return res.status(400).json({ message: "Please enter your mobile number and password to continue." });
      }

      // Validate mobile number format (international format with country code)
      // Accept numbers starting with + followed by 1-4 digit country code and 7-15 digit phone number
      const internationalMobileRegex = /^\+\d{1,4}\d{7,15}$/;
      // Also accept old format (10 digits starting with 6-9) for backward compatibility
      const indianMobileRegex = /^[6-9]\d{9}$/;
      
      if (!internationalMobileRegex.test(mobile) && !indianMobileRegex.test(mobile)) {
        return res.status(400).json({ message: "Please check your mobile number and try again." });
      }

      // First, try admin login
      const admin = await storage.getAdminByMobile(mobile);
      if (admin) {
        const validPassword = await bcrypt.compare(password, admin.password);
        if (validPassword) {
          // Admin login successful
          return new Promise<void>((resolve, reject) => {
            req.session.regenerate((err) => {
              if (err) {
                return res.status(500).json({ message: "We're having trouble logging you in. Please try again." });
              }

              req.session.adminId = admin.id;
              delete req.session.userId;
              delete req.session.userPhone;

              req.session.save((err) => {
                if (err) {
                  return res.status(500).json({ message: "We're having trouble logging you in. Please try again." });
                }

                const { password: _, ...adminWithoutPassword } = admin;
                const response = { 
                  userType: "admin",
                  user: adminWithoutPassword,
                  redirectTo: "/admin/dashboard"
                };
                console.log('[SERVER] Admin login successful, sending response:', JSON.stringify(response, null, 2));
                res.json(response);
                resolve();
              });
            });
          });
        } else {
          // Admin exists but password is wrong
          return res.status(401).json({ message: "The password you entered is incorrect. Please try again." });
        }
      }

      // If not admin, try user account login
      const userAccount = await storage.getUserAccount(mobile);
      if (userAccount) {
        // Check if account has completed signup (has password set)
        if (!userAccount.password || userAccount.password.length === 0) {
          return res.status(400).json({ 
            message: "Please complete your account setup by verifying your mobile number first." 
          });
        }

        const validPassword = await bcrypt.compare(password, userAccount.password);
        if (validPassword) {
          // User login successful
          return new Promise<void>((resolve, reject) => {
            req.session.regenerate((err) => {
              if (err) {
                return res.status(500).json({ message: "We're having trouble logging you in. Please try again." });
              }

              req.session.userPhone = userAccount.phone;
              delete req.session.userId;
              delete req.session.adminId;

              req.session.save((err) => {
                if (err) {
                  return res.status(500).json({ message: "We're having trouble logging you in. Please try again." });
                }

                const { password: _, ...accountWithoutPassword } = userAccount;
                res.json({ 
                  userType: "user",
                  user: accountWithoutPassword,
                  redirectTo: "/user-dashboard"
                });
                resolve();
              });
            });
          });
        } else {
          // User account exists but password is wrong
          return res.status(401).json({ message: "The password you entered is incorrect. Please try again." });
        }
      }

      // No account found with this mobile number
      return res.status(404).json({ message: "No account found with this mobile number. Please sign up first." });
    } catch (error) {
      next(error);
    }
  });

  // OTP Routes
  app.post("/api/otp/send", async (req, res, next) => {
    try {
      const result = sendOtpSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const { phone } = result.data;

      // Check if account already exists
      const existingAccount = await storage.getUserAccount(phone);
      
      // If account exists and is already verified, don't allow OTP send
      if (existingAccount && existingAccount.isMobileVerified) {
        return res.status(400).json({ 
          message: "This mobile number is already verified. Please log in instead." 
        });
      }

      // Check resend cooldown
      if (existingAccount && existingAccount.lastOtpSentAt) {
        if (!canResendOTP(existingAccount.lastOtpSentAt)) {
          const remaining = getRemainingCooldown(existingAccount.lastOtpSentAt);
          return res.status(429).json({ 
            message: `Please wait ${remaining} seconds before requesting a new OTP.`,
            remainingSeconds: remaining
          });
        }
      }

      // Generate and encrypt OTP
      const otp = generateOTP();
      const encryptedOTP = await encryptOTP(otp);
      const otpExpiry = getOTPExpiry();

      // Send SMS via Twilio
      const smsMessage = `Fancy Feathers: Your verification code is ${otp}. It will expire in 5 minutes.`;
      const smsResult = await sendSMS(phone, smsMessage);

      if (!smsResult.success) {
        // Check if it's a Twilio trial account unverified number error
        const isTwilioUnverifiedError = smsResult.error?.includes('unverified') || smsResult.error?.includes('21608');
        
        if (isTwilioUnverifiedError) {
          return res.status(400).json({ 
            message: "Phone number not verified. Please verify this number in Twilio Console at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified",
          });
        }
        
        return res.status(500).json({ 
          message: "Failed to send OTP. Please try again.",
          error: smsResult.error
        });
      }

      // Create or update account with OTP info (but not password yet)
      if (existingAccount) {
        // Update existing account with new OTP
        await storage.updateUserAccountOTP(phone, encryptedOTP, otpExpiry, smsResult.messageSid!);
      } else {
        // Create temporary account record with just phone and OTP (password will be set after verification)
        await storage.createUserAccount({
          phone,
          password: "", // Temporary empty password - will be set after OTP verification
          fullName: "", // Temporary empty name - will be set after OTP verification
          subscriptionId: null,
        });
        await storage.updateUserAccountOTP(phone, encryptedOTP, otpExpiry, smsResult.messageSid!);
      }

      res.json({ 
        message: "An OTP has been sent to your mobile number. Please enter it below to verify.",
        messageSid: smsResult.messageSid
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/otp/verify", async (req, res, next) => {
    try {
      const result = verifyOtpSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const { phone, otp } = result.data;

      // Get user account
      const account = await storage.getUserAccount(phone);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      // Check if already verified
      if (account.isMobileVerified) {
        return res.status(400).json({ message: "Mobile number is already verified" });
      }

      // Check OTP attempts rate limiting
      const otpAttempt = await storage.getOtpAttempt(phone);
      if (otpAttempt) {
        const windowDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
        const timeSinceWindowStart = new Date().getTime() - new Date(otpAttempt.windowStartAt).getTime();
        
        if (timeSinceWindowStart < windowDuration && otpAttempt.attempts >= 3) {
          const remainingTime = Math.ceil((windowDuration - timeSinceWindowStart) / 60000);
          return res.status(429).json({ 
            message: `Maximum OTP attempts reached. Please try again in ${remainingTime} minutes.`
          });
        }
        
        // Reset window if it's been more than 10 minutes
        if (timeSinceWindowStart >= windowDuration) {
          await storage.resetOtpAttempts(phone);
        }
      }

      // Check if OTP exists
      if (!account.otp) {
        return res.status(400).json({ message: "No OTP found. Please request a new one." });
      }

      // Check if OTP is expired
      if (isOTPExpired(account.otpExpiry)) {
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
      }

      // Validate OTP
      const isValid = await validateOTP(otp, account.otp);
      if (!isValid) {
        // Increment failed attempts
        if (otpAttempt) {
          await storage.incrementOtpAttempts(phone);
        } else {
          await storage.createOtpAttempt(phone);
        }
        
        return res.status(400).json({ message: "Invalid OTP. Please try again." });
      }

      // OTP is valid - mark account as verified
      await storage.verifyUserAccountOTP(phone);
      
      // Clear OTP attempts
      await storage.resetOtpAttempts(phone);

      res.json({ 
        message: "OTP verified successfully! You can now create your password.",
        verified: true
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/otp/resend", async (req, res, next) => {
    try {
      const result = sendOtpSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const { phone } = result.data;

      // Get account
      const account = await storage.getUserAccount(phone);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      // Check if already verified
      if (account.isMobileVerified) {
        return res.status(400).json({ message: "Mobile number is already verified" });
      }

      // Check resend cooldown
      if (!canResendOTP(account.lastOtpSentAt)) {
        const remaining = getRemainingCooldown(account.lastOtpSentAt);
        return res.status(429).json({ 
          message: `Please wait ${remaining} seconds before requesting a new OTP.`,
          remainingSeconds: remaining
        });
      }

      // Generate new OTP
      const otp = generateOTP();
      const encryptedOTP = await encryptOTP(otp);
      const otpExpiry = getOTPExpiry();

      // Send SMS via Twilio
      const smsMessage = `Fancy Feathers: Your verification code is ${otp}. It will expire in 5 minutes.`;
      const smsResult = await sendSMS(phone, smsMessage);

      if (!smsResult.success) {
        // Check if it's a Twilio trial account unverified number error
        const isTwilioUnverifiedError = smsResult.error?.includes('unverified') || smsResult.error?.includes('21608');
        
        if (isTwilioUnverifiedError) {
          return res.status(400).json({ 
            message: "Phone number not verified. Please verify this number in Twilio Console at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified",
          });
        }
        
        return res.status(500).json({ 
          message: "Failed to send OTP. Please try again.",
          error: smsResult.error
        });
      }

      // Update account with new OTP
      await storage.updateUserAccountOTP(phone, encryptedOTP, otpExpiry, smsResult.messageSid!);

      res.json({ 
        message: "A new OTP has been sent to your mobile number.",
        messageSid: smsResult.messageSid
      });
    } catch (error) {
      next(error);
    }
  });

  // Standalone signup (without subscription)
  app.post("/api/user-account/signup", async (req, res, next) => {
    try {
      const result = userAccountSignupSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const { phone, username, password } = result.data;

      // Check if account already exists
      const existingAccount = await storage.getUserAccount(phone);
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      let userAccount;

      if (existingAccount) {
        // If account exists but mobile is not verified, reject
        if (!existingAccount.isMobileVerified) {
          return res.status(400).json({ 
            message: "Please verify your mobile number first" 
          });
        }

        // If account exists and already has a password set (not empty), it's already registered
        if (existingAccount.password && existingAccount.password.length > 0) {
          return res.status(400).json({ 
            message: "Account already exists for this phone number. Please log in instead." 
          });
        }

        // Account exists with verified mobile but empty password - update it (OTP flow)
        const [updatedAccount] = await db
          .update(userAccounts)
          .set({ 
            password: hashedPassword,
            fullName: username
          })
          .where(eq(userAccounts.phone, phone))
          .returning();
        
        userAccount = updatedAccount;
      } else {
        // No existing account - create new one (shouldn't happen in OTP flow, but handle it)
        userAccount = await storage.createUserAccount({
          phone,
          password: hashedPassword,
          fullName: username,
          subscriptionId: null,
        });
      }

      // Auto-login the user after signup
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ message: "Session error" });
        }

        req.session.userPhone = userAccount.phone;
        delete req.session.userId;
        delete req.session.adminId;

        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ message: "Session error" });
          }

          const { password: _, ...accountWithoutPassword } = userAccount;
          res.json({ 
            message: "Your account has been created successfully!",
            account: accountWithoutPassword 
          });
        });
      });
    } catch (error) {
      next(error);
    }
  });

  // Registration with subscription
  app.post("/api/user-account/register", async (req, res, next) => {
    try {
      const result = userAccountRegistrationSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const { phone, password, subscriptionId } = result.data;

      // Check if account already exists
      const existingAccount = await storage.getUserAccount(phone);
      if (existingAccount) {
        return res.status(400).json({ message: "Account already exists for this phone number" });
      }

      // Verify subscription exists and matches phone number
      const subscription = await storage.getSubscriptionById(subscriptionId);
      if (!subscription) {
        return res.status(400).json({ message: "Invalid subscription" });
      }
      
      if (subscription.mobileNumber !== phone) {
        return res.status(400).json({ message: "Phone number does not match subscription" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user account with fullName from subscription
      const userAccount = await storage.createUserAccount({
        phone,
        password: hashedPassword,
        fullName: subscription.fullName,
        subscriptionId,
      });

      // Auto-login the user after registration
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ message: "Session error" });
        }

        req.session.userPhone = userAccount.phone;
        delete req.session.userId;
        delete req.session.adminId;

        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ message: "Session error" });
          }

          const { password: _, ...accountWithoutPassword } = userAccount;
          res.json({ 
            message: "Your account has been created successfully. You can now log in using your phone number and password.",
            account: accountWithoutPassword 
          });
        });
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/user-account/login", async (req, res, next) => {
    try {
      const result = userAccountLoginSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const { phone, password } = result.data;

      const userAccount = await storage.getUserAccount(phone);
      if (!userAccount) {
        return res.status(401).json({ message: "Invalid user ID or password." });
      }

      const validPassword = await bcrypt.compare(password, userAccount.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid user ID or password." });
      }

      // Regenerate session to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ message: "Session error" });
        }

        req.session.userPhone = userAccount.phone;
        delete req.session.userId;
        delete req.session.adminId;

        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ message: "Session error" });
          }

          const { password: _, ...accountWithoutPassword } = userAccount;
          res.json({ account: accountWithoutPassword });
        });
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/user-account/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user-account/session", async (req, res, next) => {
    try {
      if (!req.session.userPhone) {
        return res.json({ account: null });
      }

      const account = await storage.getUserAccount(req.session.userPhone);
      if (!account) {
        return res.json({ account: null });
      }

      const { password: _, ...accountWithoutPassword } = account;
      res.json({ account: accountWithoutPassword });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/user-account/subscription", async (req, res, next) => {
    try {
      if (!req.session.userPhone) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const account = await storage.getUserAccount(req.session.userPhone);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      // Check if user has a subscription
      if (!account.subscriptionId) {
        return res.json({ subscription: null });
      }

      const subscription = await storage.getSubscriptionById(account.subscriptionId);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      // Verify subscription belongs to this user's phone number
      if (subscription.mobileNumber !== req.session.userPhone) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json({ subscription });
    } catch (error) {
      next(error);
    }
  });

  // Bird Details routes
  app.post("/api/bird-details", async (req, res, next) => {
    try {
      if (!req.session.userPhone) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = birdDetailsSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const bird = await storage.createBirdDetails({
        ...result.data,
        userPhone: req.session.userPhone,
      });

      res.json({ message: "Your bird's details have been saved successfully.", bird });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/bird-details", async (req, res, next) => {
    try {
      if (!req.session.userPhone) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const birds = await storage.getBirdDetailsByUser(req.session.userPhone);
      res.json({ birds });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/bird-details/:id", async (req, res, next) => {
    try {
      if (!req.session.userPhone) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const bird = await storage.getBirdDetailsById(req.params.id);
      if (!bird) {
        return res.status(404).json({ message: "Bird not found" });
      }

      // Verify the bird belongs to the logged-in user
      if (bird.userPhone !== req.session.userPhone) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json({ bird });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/bird-details/:id", async (req, res, next) => {
    try {
      if (!req.session.userPhone) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const existingBird = await storage.getBirdDetailsById(req.params.id);
      if (!existingBird) {
        return res.status(404).json({ message: "Bird not found" });
      }

      // Verify the bird belongs to the logged-in user
      if (existingBird.userPhone !== req.session.userPhone) {
        return res.status(403).json({ message: "Access denied" });
      }

      const result = updateBirdDetailsSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const bird = await storage.updateBirdDetails(req.params.id, result.data);
      res.json({ message: "Bird details updated successfully.", bird });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/bird-details/:id", async (req, res, next) => {
    try {
      if (!req.session.userPhone) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const bird = await storage.getBirdDetailsById(req.params.id);
      if (!bird) {
        return res.status(404).json({ message: "Bird not found" });
      }

      // Verify the bird belongs to the logged-in user
      if (bird.userPhone !== req.session.userPhone) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteBirdDetails(req.params.id);
      res.json({ message: "Bird deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Admin authentication routes
  app.post("/api/admin/login", async (req, res, next) => {
    try {
      const result = adminLoginSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const { mobile, password } = result.data;

      const admin = await storage.getAdminByMobile(mobile);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Regenerate session to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ message: "Session error" });
        }

        // Set admin ID in the new session
        req.session.adminId = admin.id;
        // Ensure no user ID is present
        delete req.session.userId;

        // Save session
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ message: "Session error" });
          }

          const { password: _, ...adminWithoutPassword } = admin;
          res.json({ admin: adminWithoutPassword });
        });
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/admin/session", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.json({ admin: null });
      }

      const admin = await storage.getAdmin(req.session.adminId);
      if (!admin) {
        return res.json({ admin: null });
      }

      // Remove password from response
      const { password: _, ...adminWithoutPassword } = admin;
      res.json({ admin: adminWithoutPassword });
    } catch (error) {
      next(error);
    }
  });

  // Admin subscription management routes
  app.get("/api/admin/subscriptions", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const subscriptions = await storage.getAllSubscriptions();
      res.json({ subscriptions });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/subscriptions/:id", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const subscription = await storage.getSubscriptionById(req.params.id);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      res.json({ subscription });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/admin/subscriptions/:id", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = updateSubscriptionSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const subscription = await storage.updateSubscription(req.params.id, result.data);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      res.json({ subscription });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/subscriptions/:id/consultations", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { consultations } = req.body;
      const subscriptionId = req.params.id;

      // Validate consultations value
      if (typeof consultations !== 'number' || !Number.isInteger(consultations) || consultations < 0 || consultations > 1000) {
        return res.status(400).json({ message: "Consultations must be a positive integer between 0 and 1000" });
      }

      // Get current subscription
      const currentSubscription = await storage.getSubscriptionById(subscriptionId);
      if (!currentSubscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      // Update consultations
      const newStatus = consultations === 0 ? "exhausted" : (currentSubscription.status as "active" | "expired" | "exhausted");
      const subscription = await storage.updateSubscription(subscriptionId, {
        consultationsRemaining: consultations,
        status: newStatus
      });

      // Create audit log
      await storage.createAuditLog({
        adminId: req.session.adminId,
        subscriptionId,
        action: "updated_consultations",
        previousValue: String(currentSubscription.consultationsRemaining),
        newValue: String(consultations),
      });

      res.json({ subscription });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/subscriptions/:id", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check if subscription exists
      const subscription = await storage.getSubscriptionById(req.params.id);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      await storage.deleteSubscription(req.params.id);
      res.json({ message: "Subscription deleted successfully" });
    } catch (error: any) {
      // Handle foreign key constraint errors gracefully
      if (error.message && error.message.includes('foreign key constraint')) {
        return res.status(400).json({ 
          message: "Cannot delete subscription due to related records. Please contact support." 
        });
      }
      next(error);
    }
  });

  app.get("/api/admin/subscriptions/:id/audit-logs", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const logs = await storage.getAuditLogsBySubscription(req.params.id);
      res.json({ logs });
    } catch (error) {
      next(error);
    }
  });

  // Admin unified user-subscriptions route
  app.get("/api/admin/user-subscriptions", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userSubscriptions = await storage.getUserAccountsWithSubscriptions();
      
      // Compute subscription status for each user
      const now = new Date();
      const enrichedData = userSubscriptions.map((record) => {
        let subscriptionStatus = "No Subscription";
        
        if (record.subscriptionId && record.subscription && record.subscription.id) {
          const endDate = new Date(record.subscription.subscriptionEndDate);
          
          if (record.subscription.status === "exhausted") {
            subscriptionStatus = "Exhausted";
          } else if (endDate < now || record.subscription.status === "expired") {
            subscriptionStatus = "Expired";
          } else if (record.subscription.status === "active") {
            subscriptionStatus = "Active";
          }
        }
        
        return {
          phone: record.phone,
          fullName: record.fullName,
          isMobileVerified: record.isMobileVerified,
          verifiedAt: record.verifiedAt,
          createdAt: record.createdAt,
          subscriptionStatus,
          subscription: (record.subscription && record.subscription.id) ? {
            id: record.subscription.id,
            subscriptionPlan: record.subscription.subscriptionPlan,
            subscriptionStartDate: record.subscription.subscriptionStartDate,
            subscriptionEndDate: record.subscription.subscriptionEndDate,
            amountPaid: record.subscription.amountPaid,
            consultationsRemaining: record.subscription.consultationsRemaining,
            status: record.subscription.status,
            birdSpecies: record.subscription.birdSpecies,
            discountCoupon: record.subscription.discountCoupon,
            razorpayOrderId: record.subscription.razorpayOrderId,
            razorpayPaymentId: record.subscription.razorpayPaymentId,
            paymentStatus: record.subscription.paymentStatus,
          } : null,
        };
      });
      
      res.json({ userSubscriptions: enrichedData });
    } catch (error) {
      next(error);
    }
  });

  // Admin user accounts routes
  app.get("/api/admin/user-accounts", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accounts = await storage.getAllUserAccounts();
      
      // Remove password from response
      const accountsWithoutPassword = accounts.map(({ password, otp, ...account }) => account);
      
      res.json({ accounts: accountsWithoutPassword });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/user-accounts/:phone", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { phone } = req.params;

      if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      // Check if user exists
      const user = await storage.getUserAccount(phone);
      if (!user) {
        return res.status(404).json({ message: "User account not found" });
      }

      // Delete the user account (bird_details will cascade delete)
      await storage.deleteUserAccount(phone);
      
      res.json({ 
        message: "User account deleted successfully",
        deletedPhone: phone 
      });
    } catch (error) {
      next(error);
    }
  });

  // Admin bird details routes
  app.get("/api/admin/bird-details/by-phone/:phone", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const birds = await storage.getBirdDetailsByUser(req.params.phone);
      res.json({ birds });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/admin/bird-details/:id", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = updateBirdDetailsSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const bird = await storage.updateBirdDetails(req.params.id, result.data);
      if (!bird) {
        return res.status(404).json({ message: "Bird not found" });
      }

      res.json({ message: "Bird details updated successfully", bird });
    } catch (error) {
      next(error);
    }
  });

  // Admin routes
  app.get("/api/subscribers", async (req, res, next) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const subscribers = await storage.getAllSubscribers();
      
      // Remove passwords from response
      const subscribersWithoutPasswords = subscribers.map(({ password: _, ...user }) => user);
      
      res.json({ subscribers: subscribersWithoutPasswords });
    } catch (error) {
      next(error);
    }
  });

  // Metrics routes
  app.get("/api/metrics/active-users", async (req, res, next) => {
    try {
      const { metricsCache, generateActiveUsers } = await import("./cache");
      
      // Try to get cached value
      const cached = metricsCache.getWithExpiry("active_users");
      
      if (cached) {
        return res.json({
          value: cached.value,
          expires_in_seconds: cached.expiresInSeconds
        });
      }
      
      // Generate new value and cache it for 60 seconds (configurable)
      const newValue = generateActiveUsers(5, 19);
      metricsCache.set("active_users", newValue, 60);
      
      res.json({
        value: newValue,
        expires_in_seconds: 60
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/metrics/active-subscriptions", async (req, res, next) => {
    try {
      const metric = await storage.getMetric("active_subscriptions");
      
      if (!metric) {
        return res.status(404).json({ message: "Metric not found" });
      }
      
      res.json({
        value: metric.value,
        last_updated: metric.lastUpdatedAt
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/metrics/active-subscriptions/increment", async (req, res, next) => {
    try {
      const updated = await storage.incrementMetric(
        "active_subscriptions",
        1,
        "payment",
        "Successful subscription payment"
      );
      
      if (!updated) {
        return res.status(404).json({ message: "Metric not found" });
      }
      
      res.json({
        value: updated.value,
        last_updated: updated.lastUpdatedAt
      });
    } catch (error) {
      next(error);
    }
  });

  // Admin metrics routes
  app.post("/api/admin/metrics/active-subscriptions", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { value } = req.body;
      
      if (typeof value !== "number" || value < 0) {
        return res.status(400).json({ message: "Invalid value" });
      }

      const current = await storage.getMetric("active_subscriptions");
      if (!current) {
        return res.status(404).json({ message: "Metric not found" });
      }

      const updated = await storage.updateMetric("active_subscriptions", value, "admin");
      
      // Create audit log
      await storage.createMetricsAuditLog({
        metricKey: "active_subscriptions",
        oldValue: current.value,
        newValue: value,
        delta: value - current.value,
        updatedBy: "admin",
        reason: "Admin override",
        adminId: req.session.adminId,
      });
      
      res.json({
        message: "Metric updated successfully",
        value: updated?.value,
        last_updated: updated?.lastUpdatedAt
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/metrics/audit-log", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getMetricsAuditLogs(limit);
      
      res.json({ logs });
    } catch (error) {
      next(error);
    }
  });

  // ==================== APPOINTMENT BOOKING ROUTES ====================
  
  // Helper function to generate time slots
  function generateTimeSlots(startTime: string, endTime: string, duration: number, bufferTime: number): string[] {
    const slots: string[] = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const slotStart = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      
      // Calculate end time for this slot
      let slotEndMin = currentMin + duration;
      let slotEndHour = currentHour;
      if (slotEndMin >= 60) {
        slotEndHour += Math.floor(slotEndMin / 60);
        slotEndMin = slotEndMin % 60;
      }
      
      // Check if slot end time is within working hours
      if (slotEndHour < endHour || (slotEndHour === endHour && slotEndMin <= endMin)) {
        slots.push(slotStart);
      }
      
      // Move to next slot (duration + buffer)
      currentMin += duration + bufferTime;
      while (currentMin >= 60) {
        currentHour += 1;
        currentMin -= 60;
      }
    }
    
    return slots;
  }

  // Get appointment settings
  app.get("/api/appointment-settings", async (req, res, next) => {
    try {
      const settings = await storage.getAppointmentSettings();
      res.json({ settings });
    } catch (error) {
      next(error);
    }
  });

  // Get available slots for a specific date
  app.get("/api/appointments/available-slots", async (req, res, next) => {
    try {
      const { date } = req.query;
      
      if (!date || typeof date !== 'string') {
        return res.status(400).json({ message: "Date parameter is required" });
      }

      // Get appointment settings
      const settings = await storage.getAppointmentSettings();
      if (!settings) {
        return res.status(500).json({ message: "Appointment settings not configured" });
      }

      // Generate all possible slots for the day
      const allSlots = generateTimeSlots(
        settings.workingHoursStart,
        settings.workingHoursEnd,
        settings.slotDuration,
        settings.bufferTime
      );

      // Get booked appointments for this date
      const bookedAppointments = await storage.getAppointmentsByDate(date);
      
      // Get blocked slots for this date
      const blockedSlots = await storage.getBlockedSlotsByDate(date);

      // Filter out booked and blocked slots
      const bookedTimes = new Set(bookedAppointments.map(apt => apt.slotStartTime));
      const blockedTimes = new Set();
      
      blockedSlots.forEach(block => {
        if (!block.slotStartTime) {
          // Full day block - block all slots
          allSlots.forEach(slot => blockedTimes.add(slot));
        } else {
          blockedTimes.add(block.slotStartTime);
        }
      });

      const availableSlots = allSlots.map(slot => ({
        time: slot,
        available: !bookedTimes.has(slot) && !blockedTimes.has(slot),
        status: bookedTimes.has(slot) ? 'booked' : (blockedTimes.has(slot) ? 'blocked' : 'available')
      }));

      res.json({ 
        date,
        slots: availableSlots,
        settings: {
          slotDuration: settings.slotDuration,
          workingHours: {
            start: settings.workingHoursStart,
            end: settings.workingHoursEnd
          }
        }
      });
    } catch (error) {
      next(error);
    }
  });

  // Get user's appointments
  app.get("/api/appointments", async (req, res, next) => {
    try {
      if (!req.session.userPhone) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const appointments = await storage.getUserAppointments(req.session.userPhone);
      res.json({ appointments });
    } catch (error) {
      next(error);
    }
  });

  // Create new appointment
  app.post("/api/appointments", async (req, res, next) => {
    try {
      if (!req.session.userPhone) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = createAppointmentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const appointmentData = result.data;

      // Verify user has consultation credits
      const subscription = await storage.getUserSubscription(req.session.userPhone);
      if (!subscription || subscription.status !== 'active') {
        return res.status(400).json({ 
          message: "You don't have an active subscription. Please subscribe first." 
        });
      }

      if (!subscription.consultationsRemaining || subscription.consultationsRemaining <= 0) {
        return res.status(400).json({ 
          message: "You have no consultations left. Please purchase a top-up to continue." 
        });
      }

      // Check if slot is still available
      const existingAppointment = await storage.getAppointmentBySlot(
        appointmentData.appointmentDate,
        appointmentData.slotStartTime
      );

      if (existingAppointment) {
        return res.status(400).json({ 
          message: "This slot has already been booked. Please select another time." 
        });
      }

      // Check if slot is blocked
      const isBlocked = await storage.isSlotBlocked(
        appointmentData.appointmentDate,
        appointmentData.slotStartTime
      );

      if (isBlocked) {
        return res.status(400).json({ 
          message: "This slot is not available. Please select another time." 
        });
      }

      // Create appointment
      const appointment = await storage.createAppointment({
        ...appointmentData,
        userPhone: req.session.userPhone,
        subscriptionId: subscription.id
      });

      // Deduct consultation credit
      await storage.updateSubscriptionConsultations(
        subscription.id,
        subscription.consultationsRemaining - 1
      );

      // Send confirmation SMS
      try {
        const appointmentDateTime = new Date(appointmentData.appointmentDate);
        const formattedDate = appointmentDateTime.toLocaleDateString('en-IN', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        await sendSMS(
          req.session.userPhone,
          `✅ Appointment Confirmed!\n\nDate: ${formattedDate}\nTime: ${appointmentData.slotStartTime}\nBird: ${appointmentData.birdName}\n\nFancy Feathers India`
        );
      } catch (smsError) {
        console.error('Failed to send confirmation SMS:', smsError);
        // Don't fail the appointment creation if SMS fails
      }

      res.status(201).json({ 
        message: "Appointment booked successfully!",
        appointment,
        remainingConsultations: subscription.consultationsRemaining - 1
      });
    } catch (error) {
      next(error);
    }
  });

  // Cancel appointment
  app.patch("/api/appointments/:id/cancel", async (req, res, next) => {
    try {
      if (!req.session.userPhone) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const { reason } = req.body;

      const appointment = await storage.getAppointmentById(id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      // Verify appointment belongs to user
      if (appointment.userPhone !== req.session.userPhone) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (appointment.status === 'canceled') {
        return res.status(400).json({ message: "Appointment is already canceled" });
      }

      // Check cancellation window (12 hours)
      const appointmentDateTime = new Date(appointment.appointmentDate);
      const now = new Date();
      const hoursUntilAppointment = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      let creditRestored = false;
      if (hoursUntilAppointment > 12) {
        // Restore credit
        const subscription = await storage.getSubscriptionById(appointment.subscriptionId);
        if (subscription) {
          await storage.updateSubscriptionConsultations(
            subscription.id,
            (subscription.consultationsRemaining || 0) + 1
          );
          creditRestored = true;
        }
      }

      // Cancel appointment
      await storage.cancelAppointment(id, 'user', reason, creditRestored);

      res.json({ 
        message: creditRestored 
          ? "Appointment canceled successfully. Your consultation credit has been restored." 
          : "Appointment canceled. Note: Cancellations within 12 hours of appointment do not restore credits.",
        creditRestored
      });
    } catch (error) {
      next(error);
    }
  });

  // ==================== ADMIN APPOINTMENT ROUTES ====================

  // Get all appointments (admin)
  app.get("/api/admin/appointments", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { date, status, plan } = req.query;
      
      const appointments = await storage.getAllAppointments(
        date as string | undefined,
        status as string | undefined,
        plan as string | undefined
      );

      res.json({ appointments });
    } catch (error) {
      next(error);
    }
  });

  // Update appointment (admin)
  app.patch("/api/admin/appointments/:id", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const result = updateAppointmentSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const appointment = await storage.getAppointmentById(id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      await storage.updateAppointment(id, result.data);

      res.json({ message: "Appointment updated successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Block slots (admin)
  app.post("/api/admin/blocked-slots", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = createBlockedSlotSchema.safeParse({
        ...req.body,
        blockedBy: req.session.adminId
      });
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const blockedSlot = await storage.createBlockedSlot(result.data);

      res.status(201).json({ 
        message: "Slot blocked successfully",
        blockedSlot
      });
    } catch (error) {
      next(error);
    }
  });

  // Get blocked slots (admin)
  app.get("/api/admin/blocked-slots", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { date } = req.query;
      
      const blockedSlots = date 
        ? await storage.getBlockedSlotsByDate(date as string)
        : await storage.getAllBlockedSlots();

      res.json({ blockedSlots });
    } catch (error) {
      next(error);
    }
  });

  // Delete blocked slot (admin)
  app.delete("/api/admin/blocked-slots/:id", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      await storage.deleteBlockedSlot(id);

      res.json({ message: "Blocked slot removed successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Update appointment settings (admin)
  app.patch("/api/admin/appointment-settings", async (req, res, next) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = updateAppointmentSettingsSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromError(result.error).toString() 
        });
      }

      const settings = await storage.updateAppointmentSettings(result.data, req.session.adminId);

      res.json({ 
        message: "Settings updated successfully",
        settings
      });
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
