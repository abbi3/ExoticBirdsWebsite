# Exotic Birds Info

## Overview
Exotic Birds Info is a web application for cataloging exotic pet birds available in India, providing detailed species profiles, care guides, pricing, and legal compliance. It features advanced search, user authentication, a "Bird Care" subscription service with tiered plans, a recommender, an admin panel for subscriber management, a complete **Appointment Booking Module** for scheduling consultations with a credit-based system, and **personalized home page experience** that adapts to user subscription status.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework:** React 18 with TypeScript, using Vite.
- **Routing:** Wouter for client-side routing.
- **UI & Styling:** Tailwind CSS, Shadcn UI (New York variant), Lucide React for iconography, custom CSS variables for theme support.
- **State Management:** TanStack Query for server state, React hooks for local state.
- **Component Structure:** Reusable UI, feature-specific, and page components.
- **Personalized Home Page:** Dynamically adapts based on user authentication and subscription status:
  - **Non-subscribed users:** See "Comprehensive Bird Care Subscription" section with "View All Plans" CTA
  - **Subscribed users:** See "Schedule a Consultation" section with "Book Appointment" and "View My Dashboard" buttons

### Backend
- **Server:** Express.js with custom middleware.
- **Data Storage:** PostgreSQL with Drizzle ORM for user and subscriber data. Static bird data in `client/src/lib/birdsData.ts`. Bcrypt for password hashing.
- **Development:** Vite integration for HMR.
- **Data Validation:** Zod schemas integrated with Drizzle ORM.

### System Design
- **UI/UX:** Material Design influence, consistent typography (Inter font), comprehensive spacing, light/dark modes.
- **Responsive Design:** Mobile-first approach with breakpoints for mobile, tablet, and desktop. Responsive navigation, filtering, hero carousel, grid layouts, and typography.
- **Authentication:**
    - **Unified Login:** Main login page at `/login` serves both regular users and admin. Enter mobile + password, system automatically detects user type and redirects to appropriate dashboard.
    - **User Signup:** Multi-step signup process with OTP verification:
        1. **Step 1:** Enter mobile number → SMS OTP sent via Twilio
        2. **Step 2:** Enter 4-digit OTP to verify mobile number
        3. **Step 3:** Enter username and password to complete account creation
        - Creates standalone user accounts without requiring a subscription first
        - Mobile verification required before account can be finalized
    - **OTP Verification Security:**
        - 4-digit OTP sent via Twilio SMS integration
        - 5-minute expiry window for OTPs
        - OTPs encrypted with bcrypt before database storage
        - Rate limiting: Maximum 3 failed verification attempts per 10 minutes per phone number
        - Resend cooldown: 30-second wait between OTP resend requests
        - Twilio message SID tracked for audit trail
        - Temporary accounts created during OTP flow, finalized only after mobile verification
    - **User Dashboard:** Protected at `/user-dashboard` with subscription overview and bird details management.
    - **Admin Dashboard:** Protected at `/admin/dashboard` with subscription management, user details, and audit logs. Includes user accounts tab showing mobile verification status.
    - **Alternative Pages:** Separate admin login page at `/admin/login` (automatically prepends +91 to mobile numbers) and user login at `/user-account/login` also available.
    - **Password Requirements:** Min 8 chars, 1 uppercase, 1 number, 1 special char (for signup).
    - **Session Management:** Session-based authentication with secure cookies and Bcrypt hashing (10 salt rounds).
    - **Admin Credentials:** Mobile: 7032645053 (stored as +917032645053 in database), Password: Huzi@123.
    - **Enhanced Login Error Messages:** Login endpoint now provides specific error messages distinguishing between "No account found" vs "Password incorrect" vs "Complete account setup" for better user experience.
- **Payment Integration:**
    - **Razorpay Gateway:** Integrated for secure online payments supporting credit/debit cards, UPI, netbanking, and wallets
    - **Server-Side Security:** All payment amounts calculated server-side (never trusts client input to prevent underpayment attacks)
    - **Payment Flow:** User fills subscription form → Razorpay checkout opens → Payment processed → Signature verification → Subscription auto-created
    - **Amount Verification:** Server validates payment amount matches expected subscription price before activating subscription
    - **API Keys:** Stored securely in Replit secrets (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
    - **Payment Tracking:** Razorpay order ID, payment ID, and signature stored in database for audit trail
    - **Performance Optimization:**
        - DNS prefetch and preconnect hints for Razorpay domains (checkout.razorpay.com, api.razorpay.com, lumberjack.razorpay.com) to reduce initial connection latency
        - Loading toast displayed before payment modal opens for better user feedback
        - Enhanced modal configuration: backdrop dismissible (click outside or press ESC to close), smooth animations, transparent backdrop (60% opacity)
        - Prefill user name and phone number to reduce data entry
        - Modal optimization improves perceived performance and allows users to cancel easily
- **Database Schema:**
    - `admin_users`: Stores admin credentials.
    - `subscription_requests`: Includes `subscriptionPlan`, `subscriptionStartDate`, `subscriptionEndDate`, `amountPaid`, `consultationsRemaining`, `discountCoupon`, `status`, `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`, `paymentStatus`.
    - `audit_logs`: Tracks consultation updates.
    - `user_accounts`: Stores user login details (phone, password, full name, optional subscription ID, OTP verification fields: `otp`, `otp_expiry`, `is_mobile_verified`, `verified_at`, `twilio_message_sid`, `last_otp_sent_at`).
    - `otp_attempts`: Tracks failed OTP verification attempts for rate limiting (phone, attempt_count, window_start).
    - `bird_details`: Stores individual bird information (name, species, ring ID, weight, age, issues) linked to user accounts.
    - `appointments`: Stores consultation bookings (id, userPhone, fullName, subscriptionId, birdName, appointmentDate, slotStartTime, slotEndTime, symptoms, status: scheduled/completed/canceled, adminNotes, cancellation details, creditRestored flag).
    - `blocked_slots`: Admin-managed blocked time slots (id, blockDate, slotStartTime optional for blocking entire day, reason, createdBy).
    - `appointment_settings`: System-wide appointment configuration (slotDuration default 30min, maxDaysAdvanceBooking, cancellationWindowHours default 12, workingHoursStart, workingHoursEnd, weekendBookingEnabled).
- **Admin Panel Features:** 
    - **Unified User Management:** Single consolidated view merging user accounts and subscriptions into one table at `/admin/dashboard`
    - **Unified Table Displays:** All users with columns: User (name, phone, verification badge), Subscription Status (Active/Expired/Exhausted/No Subscription), Plan, Consultations Remaining, Valid Until, Actions
    - **Subscription Status Computation:** Backend automatically calculates status based on subscription dates and current status (Active if valid and unexpired, Expired if past end date, Exhausted if consultations depleted, No Subscription if none exists)
    - **Stats Dashboard:** Quick overview cards showing Total Users, Active Subscriptions (green), Expired (orange), and No Subscription (gray) counts
    - **Search & Filters:** 
        - Search by user name or phone number
        - Filter by subscription status (All/Active/Expired/Exhausted/No Subscription)
        - Filter by subscription plan (All/Monthly/6-Month/Annual)
    - **User Actions (All Users):**
        - View Details: Opens modal showing user info and subscription details
        - Delete User Account: Permanently deletes user account with confirmation dialog (cascades to remove bird_details)
    - **Subscription Actions (Users with Subscriptions Only):**
        - Edit Subscription: Modify subscription details (plan, dates, amount, bird species, status)
        - **Update Consultations:** Set consultation counts using preset values (2/Monthly, 18/6-Month, 48/Annual) OR enter any custom number (0-1000) via input field
        - Delete Subscription: Remove subscription while keeping user account intact
        - Audit logging for all consultation changes
    - **Backend Architecture:** Uses `/api/admin/user-subscriptions` endpoint with LEFT JOIN between user_accounts and subscription_requests tables for efficient data retrieval
    - Security measures like session regeneration and protected routes
    - **Phone Number Format:** All phone numbers stored with country codes (e.g., +917032645053, +918989898989)
- **User Account Features:** Personal dashboard showing subscription details, add/edit/delete multiple bird records, track remaining consultations, and secure password management with specific requirements (min 8 chars, 1 uppercase, 1 number, 1 special char).
- **Subscription Prompt:** When users log in without a subscription, they see an attractive subscription prompt instead of "No subscription found". Features gradient background, three plan cards (Monthly, 6-Month, Annual) with pricing and benefits, "Best Value" badge on annual plan, comprehensive benefits list with checkmarks, and prominent CTAs ("Subscribe Now" and "Learn More" buttons).
- **Subscription & Discount System:** Tiered monthly, 6-month, and annual plans with dynamic pricing and discounts. Optional discount coupon code field with real-time validation. Server-side calculation of start/end dates, consultation counts, and discount application.
    - **Subscription Pricing (Updated October 2025):**
        - Monthly Plan: ₹2,200 (was ₹2,750), 20% OFF, 2 consultations/month
        - 6-Month Plan: ₹12,375 (was ₹16,500), 25% OFF, 18 consultations total
        - Annual Plan: ₹23,100 (was ₹33,000), 30% OFF, 48 consultations total
    - **Discount Coupons:**
        - FFF796-FFF886: 10%-100% percentage discounts (increments of 10%)
        - FFFTEST: Special test coupon that sets subscription amount to ₹1 for any plan (for testing payment gateway)
        - Coupon logic is consistent across all endpoints: `/api/subscription-requests`, `/api/razorpay/create-order`, and `/api/razorpay/verify-payment`
    - **Instagram Promotional Section:** Featured prominently on subscription page after pricing plans
        - Gradient background card with pink/purple/orange theme
        - "Contact Admin on Instagram" button linking to @fancy_feathers_india
        - Encourages followers to request exclusive discount coupons from the admin
        - Instagram URL: https://www.instagram.com/fancy_feathers_india/
- **Subscription Success Flow:** Replaced toast notification with a full success dialog featuring a green checkmark, a "Contact on WhatsApp" button with pre-filled message including user details and transaction ID, and a "Close" button.
- **Policy Pages:** Five publicly accessible policy pages with consistent layout, SEO meta tags, and footer navigation:
    - **Terms and Conditions** (`/terms-and-conditions`): Nature of service, subscriptions, payments, user responsibilities, disclaimer, and terms updates
    - **Cancellation & Refund Policy** (`/cancellation-refund`): Consultation subscriptions policy, cancellation before activation, refund approval process, and support contact
    - **Shipping Policy** (`/shipping-policy`): Clarifies digital-only services with no physical shipping
    - **Privacy Policy** (`/privacy-policy`): Information collection, usage, data protection, third-party integrations, and user rights
    - **Contact Us** (`/contact-us`): Email (ali@fancyfeathers.co.in), WhatsApp (+91 9014284059), website, location (Hyderabad, India), and business hours (Monday – Saturday, 10:00 AM – 7:00 PM)
    - All pages include footer with links to all policy pages and Home button for easy navigation

## External Dependencies

- **Database:** Drizzle ORM for PostgreSQL, `@neondatabase/serverless` driver.
- **UI Component Libraries:** Radix UI, `class-variance-authority`, `cmdk`, `embla-carousel-react`, `react-day-picker`, `vaul`, `input-otp`.
- **Form Handling:** `react-hook-form` with `@hookform/resolvers` for Zod validation.
- **Authentication:** `bcryptjs`, `express-session`, `connect-pg-simple`.
- **SMS Integration:** `twilio` for sending OTP verification SMS messages.
- **Payment Gateway:** `razorpay` for secure online subscription payments with signature verification.
- **Utilities:** `date-fns`, `clsx`, `tailwind-merge`, `nanoid`.
- **Image Assets:** Static bird images in `attached_assets/`.