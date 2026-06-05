import { z } from "zod/v4";

// ── Contact validation ──

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().max(100).optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15)
    .regex(/^[+]?[\d\s-]+$/, "Invalid phone number format"),
  altPhone: z.string().max(15).optional(),
  email: z.email("Invalid email address").optional().or(z.literal("")),
  companyName: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(10).optional(),
  source: z.enum([
    "WALK_IN",
    "REFERRAL",
    "ONLINE",
    "PARTNER",
    "SOCIAL_MEDIA",
    "REPEAT",
    "OTHER",
  ]),
  notes: z.string().max(2000).optional(),
  roles: z
    .array(
      z.enum([
        "CUSTOMER",
        "VENDOR",
        "EMPLOYEE",
        "FREELANCER",
        "PARTNER_STUDIO",
        "REFERRER",
      ])
    )
    .min(1, "At least one role is required"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

// ── Contact Role ──

export const contactRoleSchema = z.object({
  role: z.enum([
    "CUSTOMER",
    "VENDOR",
    "EMPLOYEE",
    "FREELANCER",
    "PARTNER_STUDIO",
    "REFERRER",
  ]),
  designation: z.string().max(100).optional(),
  dailyRate: z.coerce.number().min(0).optional(),
  notes: z.string().max(500).optional(),
});

export type ContactRoleFormValues = z.infer<typeof contactRoleSchema>;
