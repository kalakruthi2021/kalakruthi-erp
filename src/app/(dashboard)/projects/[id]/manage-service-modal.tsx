"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogCloseButton, DialogBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projectServiceSchema, type ProjectServiceFormValues } from "@/lib/validations/project";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface ManageServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectServiceFormValues) => void;
  services?: any[];
  defaultValues?: Partial<ProjectServiceFormValues>;
}

export function ManageServiceModal({
  open,
  onOpenChange,
  onSubmit,
  services = [],
  defaultValues,
}: ManageServiceModalProps) {
  const isEditing = !!defaultValues;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectServiceFormValues>({
    resolver: zodResolver(projectServiceSchema) as any,
    defaultValues: defaultValues || {
      serviceId: "",
      quantity: 1,
      unitPrice: 0,
      notes: "",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogCloseButton />
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Service" : "Add Service"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update project service details." : "Add a new service to this project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    value={watch("serviceId")}
                    onValueChange={(v) => setValue("serviceId", v, { shouldValidate: true })}
                  >
                    <SelectTrigger label="Service *" error={errors.serviceId?.message}>
                      <SelectValue placeholder="Select Service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  label="Quantity *"
                  type="number"
                  error={errors.quantity?.message}
                  {...register("quantity", { valueAsNumber: true })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Unit Price (₹) *"
                  type="number"
                  error={errors.unitPrice?.message}
                  {...register("unitPrice", { valueAsNumber: true })}
                />
                <Input
                  label="Total Cost (₹)"
                  type="number"
                  disabled
                  value={(watch("quantity") || 0) * (watch("unitPrice") || 0)}
                />
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
              {isEditing ? "Save Changes" : "Add Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
