import bcrypt from 'bcryptjs';

export function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function encryptOTP(otp: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
}

export async function validateOTP(inputOTP: string, encryptedOTP: string): Promise<boolean> {
  return bcrypt.compare(inputOTP, encryptedOTP);
}

export function getOTPExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 5);
  return expiry;
}

export function isOTPExpired(expiryDate: Date | null): boolean {
  if (!expiryDate) return true;
  return new Date() > new Date(expiryDate);
}

export function canResendOTP(lastSentAt: Date | null): boolean {
  if (!lastSentAt) return true;
  const cooldownSeconds = 30;
  const timeSinceLastSent = (new Date().getTime() - new Date(lastSentAt).getTime()) / 1000;
  return timeSinceLastSent >= cooldownSeconds;
}

export function getRemainingCooldown(lastSentAt: Date | null): number {
  if (!lastSentAt) return 0;
  const cooldownSeconds = 30;
  const timeSinceLastSent = (new Date().getTime() - new Date(lastSentAt).getTime()) / 1000;
  const remaining = Math.ceil(cooldownSeconds - timeSinceLastSent);
  return remaining > 0 ? remaining : 0;
}
