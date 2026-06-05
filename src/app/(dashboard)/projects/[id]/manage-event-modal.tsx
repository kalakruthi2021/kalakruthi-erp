"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCloseButton,
  DialogBody,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { projectEventSchema, type ProjectEventFormValues } from "@/lib/validations/project";

interface ManageEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectEventFormValues) => void;
  eventTypes?: any[];
  defaultValues?: Partial<ProjectEventFormValues>;
}

export function ManageEventModal({
  open,
  onOpenChange,
  onSubmit,
  eventTypes = [],
  defaultValues,
}: ManageEventModalProps) {
  const isEditing = !!defaultValues;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectEventFormValues>({
    resolver: zodResolver(projectEventSchema) as any,
    defaultValues: defaultValues || {
      eventTypeId: "",
      eventDate: new Date().toISOString().split("T")[0],
      startTime: "",
      endTime: "",
      venue: "",
      notes: "",
      sortOrder: 0,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogCloseButton />
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Add Event"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update project event details." : "Add a new event to this project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    value={watch("eventTypeId")}
                    onValueChange={(v) => setValue("eventTypeId", v, { shouldValidate: true })}
                  >
                    <SelectTrigger label="Event Type *" error={errors.eventTypeId?.message}>
                      <SelectValue placeholder="Select Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((et) => (
                        <SelectItem key={et.id} value={et.id}>
                          {et.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  label="Event Date *"
                  type="date"
                  error={errors.eventDate?.message}
                  {...register("eventDate")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Start Time"
                  type="time"
                  error={errors.startTime?.message}
                  {...register("startTime")}
                />
                <Input
                  label="End Time"
                  type="time"
                  error={errors.endTime?.message}
                  {...register("endTime")}
                />
              </div>

              <Input
                label="Venue"
                placeholder="e.g. Grand Palace Hotel"
                error={errors.venue?.message}
                {...register("venue")}
              />

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
              {isEditing ? "Save Changes" : "Add Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
