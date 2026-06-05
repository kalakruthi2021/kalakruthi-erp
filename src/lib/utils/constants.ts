/* ─────────────────────────────────────────────────────
   Shared constants and enums
   ───────────────────────────────────────────────────── */

// ── Contact Roles ──
export const CONTACT_ROLES = [
  { value: "customer", label: "Customer", color: "accent" },
  { value: "vendor", label: "Vendor", color: "info" },
  { value: "employee", label: "Employee", color: "success" },
  { value: "freelancer", label: "Freelancer", color: "warning" },
  { value: "partner_studio", label: "Partner Studio", color: "neutral" },
  { value: "referrer", label: "Referrer", color: "neutral" },
] as const;

export type ContactRole = (typeof CONTACT_ROLES)[number]["value"];

// ── Contact Sources ──
export const CONTACT_SOURCES = [
  { value: "walk_in", label: "Walk-in" },
  { value: "referral", label: "Referral" },
  { value: "online", label: "Online" },
  { value: "partner", label: "Partner" },
  { value: "social_media", label: "Social Media" },
  { value: "repeat", label: "Repeat" },
  { value: "other", label: "Other" },
] as const;

// ── Project Types ──
export const PROJECT_TYPES = [
  { value: "direct_booking", label: "Direct Booking", channel: "b2c" },
  { value: "partner_referral", label: "Partner Referral", channel: "b2b" },
  { value: "outsourced_work", label: "Outsourced Work", channel: "b2b" },
  { value: "editing_only", label: "Editing Only", channel: "b2b" },
  { value: "save_the_date", label: "Save the Date", channel: "both" },
] as const;

// ── Project Statuses ──
export const PROJECT_STATUSES = [
  { value: "inquiry", label: "Inquiry", color: "neutral" },
  { value: "quotation_sent", label: "Quotation Sent", color: "info" },
  { value: "confirmed", label: "Confirmed", color: "success" },
  { value: "scheduled", label: "Scheduled", color: "info" },
  { value: "in_progress", label: "In Progress", color: "warning" },
  { value: "post_production", label: "Post Production", color: "accent" },
  { value: "delivered", label: "Delivered", color: "success" },
  { value: "completed", label: "Completed", color: "success" },
  { value: "cancelled", label: "Cancelled", color: "danger" },
  { value: "archived", label: "Archived", color: "neutral" },
] as const;

// ── Event Types (Default set) ──
export const DEFAULT_EVENT_TYPES = [
  { name: "Barasala", category: "celebration", icon: "🍼" },
  { name: "Annaprasana", category: "celebration", icon: "🍚" },
  { name: "Birthday", category: "celebration", icon: "🎂" },
  { name: "Dhoti Ceremony", category: "celebration", icon: "👘" },
  { name: "Onilu", category: "cultural", icon: "🎵" },
  { name: "Mature Function", category: "cultural", icon: "🌸" },
  { name: "Laggalu", category: "wedding", icon: "💐" },
  { name: "Engagement", category: "wedding", icon: "💍" },
  { name: "Haldi", category: "wedding", icon: "💛" },
  { name: "Wedding", category: "wedding", icon: "💒" },
  { name: "Reception", category: "wedding", icon: "🥂" },
  { name: "Vratham", category: "cultural", icon: "🙏" },
  { name: "Gruhapravesam", category: "property", icon: "🏠" },
] as const;

// ── B2C Services ──
export const B2C_SERVICES = [
  "Traditional Photography",
  "Traditional Videography",
  "Candid Photography",
  "Candid Videography",
  "Live Streaming",
  "Drone Services",
  "LED Wall",
  "Save the Date Shoots",
] as const;

// ── B2B Services ──
export const B2B_SERVICES = [
  "Traditional Photography",
  "Traditional Videography",
  "Candid Photography",
  "Candid Videography",
  "Editing Services",
  "Save the Date Shoots",
] as const;

// ── Payment Methods ──
export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "upi", label: "UPI", icon: "📱" },
  { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "cheque", label: "Cheque", icon: "📄" },
  { value: "online", label: "Online", icon: "💳" },
  { value: "other", label: "Other", icon: "📋" },
] as const;

// ── Payment Types ──
export const PAYMENT_TYPES = [
  { value: "advance", label: "Advance" },
  { value: "installment", label: "Installment" },
  { value: "final_settlement", label: "Final Settlement" },
  { value: "refund", label: "Refund" },
  { value: "partial", label: "Partial" },
  { value: "full", label: "Full" },
] as const;

// ── User Roles ──
export const USER_ROLES = [
  { value: "owner", label: "Owner", level: 0 },
  { value: "admin", label: "Admin", level: 1 },
  { value: "manager", label: "Manager", level: 2 },
  { value: "staff", label: "Staff", level: 3 },
  { value: "viewer", label: "Viewer", level: 4 },
] as const;

// ── Indian States ──
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
] as const;
