import * as z from "zod";
import { PROJECT_STATUSES, PROJECT_TYPES } from "../utils/constants";

export const projectSchema = z.object({
  title: z.string().min(2, "Title is too short").max(100, "Title is too long").optional(),
  customerId: z.string().min(1, "Customer is required"),
  partnerId: z.string().optional(),
  projectType: z.enum(
    PROJECT_TYPES.map((t) => t.value.toUpperCase()) as [string, ...string[]]
  ),
  status: z.enum(
    PROJECT_STATUSES.map((s) => s.value.toUpperCase()) as [string, ...string[]]
  ),
  location: z.string().max(200).optional(),
  isUrgent: z.boolean().default(false),
  notes: z.string().max(1000).optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const projectEventSchema = z.object({
  eventTypeId: z.string().min(1, "Event type is required"),
  eventDate: z.string().min(1, "Event date is required"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venue: z.string().optional(),
  notes: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export type ProjectEventFormValues = z.infer<typeof projectEventSchema>;

export const projectServiceSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price cannot be negative"),
  notes: z.string().optional(),
});

export type ProjectServiceFormValues = z.infer<typeof projectServiceSchema>;

export const projectCrewSchema = z.object({
  contactId: z.string().min(1, "Crew member is required"),
  role: z.string().min(1, "Role is required"),
  dailyRate: z.number().min(0, "Daily rate cannot be negative").optional(),
  days: z.number().min(0, "Days must be non-negative").default(1),
  status: z.enum(["ASSIGNED", "CONFIRMED", "COMPLETED", "CANCELLED"]).default("ASSIGNED"),
  notes: z.string().optional(),
});

export type ProjectCrewFormValues = z.infer<typeof projectCrewSchema>;
