"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact";
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
import { CONTACT_ROLES, CONTACT_SOURCES, INDIAN_STATES } from "@/lib/utils/constants";
import type { MockContact } from "@/lib/data/mock-contacts";

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MockContact) => void;
  defaultValues?: MockContact;
}

export function AddContactModal({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: AddContactModalProps) {
  const isEditing = !!defaultValues;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaultValues
      ? {
          firstName: defaultValues.firstName,
          lastName: defaultValues.lastName ?? "",
          phone: defaultValues.phone,
          altPhone: defaultValues.altPhone ?? "",
          email: defaultValues.email ?? "",
          companyName: defaultValues.companyName ?? "",
          address: defaultValues.address ?? "",
          city: defaultValues.city ?? "",
          state: defaultValues.state ?? "",
          pincode: defaultValues.pincode ?? "",
          source: defaultValues.source as ContactFormValues["source"],
          notes: defaultValues.notes ?? "",
          roles: defaultValues.roles.map((r) => r.role) as ContactFormValues["roles"],
        }
      : {
          firstName: "",
          lastName: "",
          phone: "",
          source: "OTHER",
          roles: ["CUSTOMER"],
        },
  });

  const selectedRoles = watch("roles") ?? [];

  const toggleRole = (role: ContactFormValues["roles"][number]) => {
    const current = selectedRoles;
    if (current.includes(role)) {
      if (current.length > 1) {
        setValue(
          "roles",
          current.filter((r) => r !== role),
          { shouldValidate: true }
        );
      }
    } else {
      setValue("roles", [...current, role], { shouldValidate: true });
    }
  };

  const onFormSubmit = (data: ContactFormValues) => {
    const contact: MockContact = {
      id: defaultValues?.id ?? `c${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName ?? "",
      displayName: `${data.firstName} ${data.lastName ?? ""}`.trim(),
      phone: data.phone,
      altPhone: data.altPhone,
      email: data.email || undefined,
      companyName: data.companyName,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      source: data.source,
      notes: data.notes,
      isActive: true,
      roles: data.roles.map((r) => ({ role: r })),
      createdAt: defaultValues?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(contact);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogCloseButton />
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Contact" : "Add New Contact"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the contact information below."
              : "Fill in the details to add a new contact to your system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogBody>
            <div className="space-y-5">
              {/* ── Roles ── */}
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">
                  Roles <span className="text-danger-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONTACT_ROLES.map((role) => {
                    const isSelected = selectedRoles.includes(
                      role.value.toUpperCase() as ContactFormValues["roles"][number]
                    );
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() =>
                          toggleRole(
                            role.value.toUpperCase() as ContactFormValues["roles"][number]
                          )
                        }
                        className={`
                          px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                          ${
                            isSelected
                              ? "bg-accent-500 text-white border-accent-500 shadow-sm"
                              : "bg-surface text-text-secondary border-border hover:border-accent-300 hover:text-accent-500"
                          }
                        `}
                      >
                        {role.label}
                      </button>
                    );
                  })}
                </div>
                {errors.roles && (
                  <p className="text-xs text-danger-500 mt-1">
                    {errors.roles.message}
                  </p>
                )}
              </div>

              {/* ── Name ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="e.g. Ravi"
                  required
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
                <Input
                  label="Last Name"
                  placeholder="e.g. Sharma"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
              </div>

              {/* ── Phone ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  placeholder="9876543210"
                  required
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <Input
                  label="Alt. Phone"
                  placeholder="Optional"
                  error={errors.altPhone?.message}
                  {...register("altPhone")}
                />
              </div>

              {/* ── Email & Company ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  label="Company Name"
                  placeholder="Studio / Business name"
                  error={errors.companyName?.message}
                  {...register("companyName")}
                />
              </div>

              {/* ── Source ── */}
              <div>
                <Select
                  value={watch("source")}
                  onValueChange={(v) =>
                    setValue("source", v as ContactFormValues["source"], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger label="Source">
                    <SelectValue placeholder="How did they find you?" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_SOURCES.map((s) => (
                      <SelectItem key={s.value} value={s.value.toUpperCase()}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ── Address ── */}
              <Input
                label="Address"
                placeholder="Street address"
                error={errors.address?.message}
                {...register("address")}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  placeholder="e.g. Hyderabad"
                  error={errors.city?.message}
                  {...register("city")}
                />
                <div>
                  <Select
                    value={watch("state") ?? ""}
                    onValueChange={(v) =>
                      setValue("state", v, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger label="State">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  label="Pincode"
                  placeholder="500001"
                  error={errors.pincode?.message}
                  {...register("pincode")}
                />
              </div>

              {/* ── Notes ── */}
              <div>
                <label className="text-sm font-medium text-text-primary mb-1.5 block">
                  Notes
                </label>
                <textarea
                  placeholder="Any additional notes about this contact..."
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
              {isEditing ? "Save Changes" : "Add Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
