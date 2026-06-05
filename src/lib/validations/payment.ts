import * as z from "zod";

export const paymentSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  contactId: z.string().min(1, "Contact is required"),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentMethod: z.enum(["UPI", "CASH", "BANK_TRANSFER", "CHEQUE", "ONLINE"]),
  paymentType: z.enum(["ADVANCE", "MILESTONE", "FINAL", "REFUND", "EXPENSE"]),
  direction: z.enum(["INCOMING", "OUTGOING"]),
  referenceNo: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
