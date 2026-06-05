"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogCloseButton, DialogBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { projectCrewSchema, type ProjectCrewFormValues } from "@/lib/validations/project";

interface ManageCrewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectCrewFormValues) => void;
  contacts?: any[];
  defaultValues?: Partial<ProjectCrewFormValues>;
}

export function ManageCrewModal({
  open,
  onOpenChange,
  onSubmit,
  contacts = [],
  defaultValues,
}: ManageCrewModalProps) {
  const isEditing = !!defaultValues;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectCrewFormValues>({
    resolver: zodResolver(projectCrewSchema) as any,
    defaultValues: defaultValues || {
      contactId: "",
      role: "",
      dailyRate: 0,
      days: 1,
      status: "ASSIGNED",
      notes: "",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogCloseButton />
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Crew Assignment" : "Assign Crew"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update crew details." : "Assign a team member or freelancer to this project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    value={watch("contactId")}
                    onValueChange={(v) => setValue("contactId", v, { shouldValidate: true })}
                  >
                    <SelectTrigger label="Crew Member *" error={errors.contactId?.message}>
                      <SelectValue placeholder="Select Member" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.display_name || c.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  label="Role *"
                  placeholder="e.g. Lead Photographer"
                  error={errors.role?.message}
                  {...register("role")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Daily Rate (₹) *"
                  type="number"
                  error={errors.dailyRate?.message}
                  {...register("dailyRate", { valueAsNumber: true })}
                />
                <Input
                  label="Days *"
                  type="number"
                  error={errors.days?.message}
                  {...register("days", { valueAsNumber: true })}
                />
                <div>
                  <Select
                    value={watch("status")}
                    onValueChange={(v: any) => setValue("status", v, { shouldValidate: true })}
                  >
                    <SelectTrigger label="Status *" error={errors.status?.message}>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASSIGNED">Assigned</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-text-primary mb-1.5 block">
                  Notes
                </label>
                <textarea
                  placeholder="Any additional details..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors resize-none"
                  {...register("notes")}
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? "Save Changes" : "Assign Crew"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
