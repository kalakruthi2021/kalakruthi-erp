"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectFormValues } from "@/lib/validations/project";
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
import { PROJECT_STATUSES, PROJECT_TYPES } from "@/lib/utils/constants";

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectFormValues) => void;
  contacts: any[];
  defaultValues?: Partial<ProjectFormValues>;
}

export function AddProjectModal({
  open,
  onOpenChange,
  onSubmit,
  contacts,
  defaultValues,
}: AddProjectModalProps) {
  const isEditing = !!defaultValues;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: defaultValues || {
      title: "",
      projectType: "DIRECT_BOOKING",
      status: "INQUIRY",
      isUrgent: false,
    },
  });

  const onFormSubmit = (data: ProjectFormValues) => {
    onSubmit(data);
    reset();
  };

  const customers = contacts.filter((c) => 
    c.roles?.some((r: any) => r.role === "CUSTOMER") || 
    c.contact_roles?.some((r: any) => r.role === "CUSTOMER")
  );

  const partners = contacts.filter((c) => 
    c.roles?.some((r: any) => r.role === "PARTNER" || r.role === "B2B_PARTNER") || 
    c.contact_roles?.some((r: any) => r.role === "PARTNER" || r.role === "B2B_PARTNER")
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogCloseButton />
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update project details." : "Fill in the details to create a new project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogBody>
            <div className="space-y-5">
              
              <Input
                label="Project Title"
                placeholder="e.g. Wedding of Priya & Rahul"
                error={errors.title?.message}
                {...register("title")}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    value={watch("customerId")}
                    onValueChange={(v) => setValue("customerId", v, { shouldValidate: true })}
                  >
                    <SelectTrigger label="Customer *" error={errors.customerId?.message}>
                      <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.displayName || c.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select
                    value={watch("partnerId") || "none"}
                    onValueChange={(v) => setValue("partnerId", v === "none" ? undefined : v, { shouldValidate: true })}
                  >
                    <SelectTrigger label="B2B Partner (Optional)" error={errors.partnerId?.message}>
                      <SelectValue placeholder="Select Partner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {partners.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.displayName || p.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    value={watch("projectType")}
                    onValueChange={(v) => setValue("projectType", v, { shouldValidate: true })}
                  >
                    <SelectTrigger label="Project Type *" error={errors.projectType?.message}>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value.toUpperCase()}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select
                    value={watch("status")}
                    onValueChange={(v) => setValue("status", v, { shouldValidate: true })}
                  >
                    <SelectTrigger label="Status *" error={errors.status?.message}>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value.toUpperCase()}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Input
                label="Location"
                placeholder="e.g. ITC Kohenur, Hyderabad"
                error={errors.location?.message}
                {...register("location")}
              />

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isUrgent"
                  className="h-4 w-4 rounded border-border text-accent-600 focus:ring-accent-500"
                  {...register("isUrgent")}
                />
                <label htmlFor="isUrgent" className="text-sm text-text-primary">
                  Mark as Urgent Project
                </label>
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

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
