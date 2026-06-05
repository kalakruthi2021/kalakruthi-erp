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
