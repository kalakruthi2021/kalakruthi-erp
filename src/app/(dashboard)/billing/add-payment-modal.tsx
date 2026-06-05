"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, type PaymentFormValues } from "@/lib/validations/payment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogCloseButton,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface AddPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PaymentFormValues) => void;
  projects: any[];
  contacts: any[];
  defaultValues?: Partial<PaymentFormValues>;
}

export function AddPaymentModal({
  open,
  onOpenChange,
  onSubmit,
  projects,
  contacts,
  defaultValues,
}: AddPaymentModalProps) {
  const isEditing = !!defaultValues;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: defaultValues || {
      amount: 0,
      paymentMethod: "UPI",
      paymentType: "ADVANCE",
      direction: "INCOMING",
      paymentDate: new Date().toISOString().split("T")[0],
    },
  });

  const onFormSubmit = (data: PaymentFormValues) => {
    onSubmit(data);
    reset();
  };

  const selectedProjectId = watch("projectId");

  // Auto-select contact when project changes
  const handleProjectChange = (projectId: string) => {
    setValue("projectId", projectId, { shouldValidate: true });
    const project = projects.find((p) => p.id === projectId);
    if (project && project.customer_id) {
      setValue("contactId", project.customer_id, { shouldValidate: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogCloseButton />
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Payment" : "Record Payment"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update payment details." : "Enter details for an incoming or outgoing payment."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogBody>
            <div className="space-y-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    value={watch("direction")}
                    onValueChange={(v) => setValue("direction", v as any, { shouldValidate: true })}
                  >
                    <SelectTrigger label="Direction *" error={errors.direction?.message}>
                      <SelectValue placeholder="Select Direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INCOMING">Incoming (Received)</SelectItem>
                      <SelectItem value="OUTGOING">Outgoing (Paid)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select
                    value={selectedProjectId}
                    onValueChange={handleProjectChange}
                  >
                    <SelectTrigger label="Project *" error={errors.projectId?.message}>
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.title || p.project_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    value={watch("contactId")}
                    onValueChange={(v) => setValue("contactId", v, { shouldValidate: true })}
                  >
                    <SelectTrigger label="Contact *" error={errors.contactId?.message}>
                      <SelectValue placeholder="Select Contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.displayName || c.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  label="Amount *"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  error={errors.amount?.message}
                  {...register("amount", { valueAsNumber: true })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Date *"
                  type="date"
                  error={errors.paymentDate?.message}
                  {...register("paymentDate")}
                />

                <div>
                  <Select
                    value={watch("paymentMethod")}
                    onValueChange={(v) => setValue("paymentMethod", v as any, { shouldValidate: true })}
                  >
                    <SelectTrigger label="Method *" error={errors.paymentMethod?.message}>
                      <SelectValue placeholder="Select Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                      <SelectItem value="CHEQUE">Cheque</SelectItem>
                      <SelectItem value="ONLINE">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select
                    value={watch("paymentType")}
                    onValueChange={(v) => setValue("paymentType", v as any, { shouldValidate: true })}
                  >
                    <SelectTrigger label="Type *" error={errors.paymentType?.message}>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADVANCE">Advance</SelectItem>
                      <SelectItem value="MILESTONE">Milestone</SelectItem>
                      <SelectItem value="FINAL">Final</SelectItem>
                      <SelectItem value="REFUND">Refund</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Input
                label="Reference Number"
                placeholder="UPI Ref, Cheque No, etc. (Optional)"
                error={errors.referenceNo?.message}
                {...register("referenceNo")}
              />

              <div>
                <label className="text-sm font-medium text-text-primary mb-1.5 block">
                  Notes
                </label>
                <textarea
                  placeholder="Any additional notes..."
                  rows={2}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors resize-none"
                  {...register("notes")}
                />
              </div>

            </div>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? "Save Changes" : "Save Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
