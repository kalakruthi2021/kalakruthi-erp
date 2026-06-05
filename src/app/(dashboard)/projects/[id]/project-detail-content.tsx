"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  CreditCard,
  Package,
  Edit2,
  AlertCircle,
  CheckCircle2,
  IndianRupee,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils/currency";
import { PROJECT_STATUSES } from "@/lib/utils/constants";
import { Wifi, WifiOff, Plus, Trash2, MoreHorizontal } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { ManageEventModal } from "./manage-event-modal";
import { ManageServiceModal } from "./manage-service-modal";
import { ManageCrewModal } from "./manage-crew-modal";
import {
  addProjectEvent, updateProjectEvent, deleteProjectEvent,
  addProjectService, updateProjectService, deleteProjectService,
  addProjectCrew, updateProjectCrew, deleteProjectCrew
} from "@/lib/actions/projects";

interface Props {
  project: any;
  isLive?: boolean;
  eventTypes?: any[];
  services?: any[];
  contacts?: any[];
}

function getStatusVariant(status: string) {
  const found = PROJECT_STATUSES.find((s) => s.value === status.toLowerCase());
  return (found?.color ?? "neutral") as "accent" | "info" | "success" | "warning" | "neutral" | "danger";
}

type DetailTab = "overview" | "events" | "services" | "crew" | "payments";

const TABS: { value: DetailTab; label: string; icon: React.ElementType }[] = [
  { value: "overview", label: "Overview", icon: FileText },
  { value: "events", label: "Events", icon: Calendar },
  { value: "services", label: "Services", icon: Package },
  { value: "crew", label: "Crew", icon: Users },
  { value: "payments", label: "Payments", icon: CreditCard },
];

export function ProjectDetailContent({ project, isLive = false, eventTypes = [], services = [], contacts = [] }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [isPending, startTransition] = useTransition();

  // Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [deletingService, setDeletingService] = useState<string | null>(null);

  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
  const [editingCrew, setEditingCrew] = useState<any | null>(null);
  const [deletingCrew, setDeletingCrew] = useState<string | null>(null);

  const handleEventSubmit = (data: any) => {
    startTransition(async () => {
      try {
        if (editingEvent) await updateProjectEvent(editingEvent.id, project.id, data);
        else await addProjectEvent(project.id, data);
        toast.success("Event saved successfully");
        setIsEventModalOpen(false);
        setEditingEvent(null);
      } catch (err) { toast.error("Failed to save event"); }
    });
  };

  const handleServiceSubmit = (data: any) => {
    startTransition(async () => {
      try {
        if (editingService) await updateProjectService(editingService.id, project.id, data);
        else await addProjectService(project.id, data);
        toast.success("Service saved successfully");
        setIsServiceModalOpen(false);
        setEditingService(null);
      } catch (err) { toast.error("Failed to save service"); }
    });
  };

  const handleCrewSubmit = (data: any) => {
    startTransition(async () => {
      try {
        if (editingCrew) await updateProjectCrew(editingCrew.id, project.id, data);
        else await addProjectCrew(project.id, data);
        toast.success("Crew saved successfully");
        setIsCrewModalOpen(false);
        setEditingCrew(null);
      } catch (err) { toast.error("Failed to save crew"); }
    });
  };

  if (!project) {
    return (
      <div className="animate-fade-in">
        <Button variant="ghost" onClick={() => router.push("/projects")}>
          <ArrowLeft size={16} /> Back to Projects
        </Button>
        <EmptyState
          variant="error"
          title="Project not found"
          description="The project you're looking for doesn't exist."
          action={<Button variant="outline" onClick={() => router.push("/projects")}>Go to Projects</Button>}
        />
      </div>
    );
  }

  const paymentProgress = project.netAmount > 0 ? Math.round((project.paidAmount / project.netAmount) * 100) : 100;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={() => router.push("/projects")}>
        <ArrowLeft size={16} /> Back to Projects
      </Button>

      {/* ── Project Header Card ── */}
      <div className="card p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left: Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono text-text-muted">{project.projectNumber}</span>
                  {project.isUrgent && (
                    <Badge variant="danger" size="sm">
                      <AlertCircle size={12} /> URGENT
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3 mt-1">
                  {project.title}
                  {isLive ? (
                    <span className="inline-flex text-success-500 text-sm font-medium border border-success-200 bg-success-50 px-3 py-1 rounded-full items-center"><Wifi size={14} className="mr-1.5"/> Live</span>
                  ) : (
                    <span className="inline-flex text-warning-500 text-sm font-medium border border-warning-200 bg-warning-50 px-3 py-1 rounded-full items-center"><WifiOff size={14} className="mr-1.5"/> Mock Data</span>
                  )}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <Badge variant={getStatusVariant(project.status)}>
                    {project.status.replace(/_/g, " ")}
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    {project.projectType.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit2 size={14} /> Edit
              </Button>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 mt-6 text-[15px] text-text-secondary">
              <span className="flex items-center gap-2">
                <Avatar name={project.customerName} size="sm" />
                <span className="font-medium text-text-primary">{project.customerName}</span>
              </span>
              {project.partnerName && (
                <span className="flex items-center gap-2 text-info-600 font-medium bg-info-50 px-3 py-1 rounded-full">
                  <Users size={16} /> {project.partnerName}
                </span>
              )}
              {project.location && (
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-text-muted" /> {project.location}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-text-muted" />
                {project.events.length} event{project.events.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Right: Financial Summary */}
          <div className="lg:w-80 w-full bg-surface-sunken rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Net Amount</span>
              <span className="text-lg font-bold font-mono text-text-primary">
                {formatCurrency(project.netAmount)}
              </span>
            </div>
            {project.discountAmount > 0 && (
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Discount</span>
                <span className="font-mono text-success-600">−{formatCurrency(project.discountAmount)}</span>
              </div>
            )}
            {/* Payment progress */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-text-muted">
                  Paid: <span className="font-mono text-text-secondary">{formatCurrency(project.paidAmount)}</span>
                </span>
                <span className={`font-semibold ${paymentProgress === 100 ? "text-success-600" : "text-warning-600"}`}>
                  {paymentProgress}%
                </span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    paymentProgress === 100 ? "bg-success-500" : paymentProgress > 50 ? "bg-warning-500" : "bg-danger-500"
                  }`}
                  style={{ width: `${paymentProgress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
              <span className="text-sm font-semibold text-text-muted uppercase tracking-wide">Balance</span>
              <span className={`text-xl font-bold font-mono ${project.balanceAmount > 0 ? "text-danger-600" : "text-success-600"}`}>
                {project.balanceAmount > 0 ? formatCurrency(project.balanceAmount) : "Fully Paid"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="border-b border-border">
        <nav className="flex gap-1 -mb-px" aria-label="Project detail tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            const count =
              tab.value === "events" ? project.events.length
              : tab.value === "services" ? project.services.length
              : tab.value === "crew" ? project.crew.length
              : undefined;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                  border-b-2 transition-colors duration-200
                  ${isActive
                    ? "border-accent-500 text-accent-500"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong"
                  }
                `}
              >
                <Icon size={16} />
                {tab.label}
                {count !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-accent-50 text-accent-600" : "bg-surface-sunken text-text-muted"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Tab Content ── */}
      <div className="animate-fade-in">
        {activeTab === "overview" && <OverviewTab project={project} />}
        {activeTab === "events" && <EventsTab project={project} onAdd={() => setIsEventModalOpen(true)} onEdit={setEditingEvent} onDelete={setDeletingEvent} />}
        {activeTab === "services" && <ServicesTab project={project} onAdd={() => setIsServiceModalOpen(true)} onEdit={setEditingService} onDelete={setDeletingService} />}
        {activeTab === "crew" && <CrewTab project={project} onAdd={() => setIsCrewModalOpen(true)} onEdit={setEditingCrew} onDelete={setDeletingCrew} />}
        {activeTab === "payments" && <PaymentsTab project={project} />}
      </div>

      {/* Modals */}
      <ManageEventModal
        open={isEventModalOpen || !!editingEvent}
        onOpenChange={(o) => { setIsEventModalOpen(o); if(!o) setEditingEvent(null); }}
        onSubmit={handleEventSubmit}
        eventTypes={eventTypes}
        defaultValues={editingEvent ? {
          eventTypeId: editingEvent.eventTypeId || editingEvent.event_type_id || "",
          eventDate: new Date(editingEvent.eventDate || editingEvent.event_date).toISOString().split("T")[0],
          startTime: editingEvent.startTime || editingEvent.start_time || "",
          endTime: editingEvent.endTime || editingEvent.end_time || "",
          venue: editingEvent.venue || "",
          notes: editingEvent.notes || "",
          sortOrder: editingEvent.sortOrder || editingEvent.sort_order || 0,
        } : undefined}
      />

      <ManageServiceModal
        open={isServiceModalOpen || !!editingService}
        onOpenChange={(o) => { setIsServiceModalOpen(o); if(!o) setEditingService(null); }}
        onSubmit={handleServiceSubmit}
        services={services}
        defaultValues={editingService ? {
          serviceId: editingService.serviceId || editingService.service_id || "",
          quantity: editingService.quantity,
          unitPrice: editingService.unitPrice || editingService.unit_price,
          notes: editingService.notes || "",
        } : undefined}
      />

      <ManageCrewModal
        open={isCrewModalOpen || !!editingCrew}
        onOpenChange={(o) => { setIsCrewModalOpen(o); if(!o) setEditingCrew(null); }}
        onSubmit={handleCrewSubmit}
        contacts={contacts}
        defaultValues={editingCrew ? {
          contactId: editingCrew.contactId || editingCrew.contact_id || "",
          role: editingCrew.role || "",
          dailyRate: editingCrew.dailyRate || editingCrew.daily_rate || 0,
          days: editingCrew.days || 1,
          status: editingCrew.status as any,
          notes: editingCrew.notes || "",
        } : undefined}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingEvent || !!deletingService || !!deletingCrew} onOpenChange={(o) => {
        if(!o) { setDeletingEvent(null); setDeletingService(null); setDeletingCrew(null); }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone and will permanently delete this record.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  try {
                    if (deletingEvent) await deleteProjectEvent(deletingEvent, project.id);
                    if (deletingService) await deleteProjectService(deletingService, project.id);
                    if (deletingCrew) await deleteProjectCrew(deletingCrew, project.id);
                    toast.success("Deleted successfully");
                  } catch (e) { toast.error("Failed to delete"); }
                  setDeletingEvent(null); setDeletingService(null); setDeletingCrew(null);
                });
              }}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Overview Tab ──
function OverviewTab({ project }: { project: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Project Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Events Timeline */}
        {project.events.length > 0 && (
          <div className="card">
            <div className="px-6 py-5 border-b border-border">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Calendar size={18} className="text-text-muted" /> Event Schedule
              </h3>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-border" />
                <div className="space-y-6">
                  {project.events.map((event: any) => {
                    const isPast = new Date(event.eventDate) < new Date();
                    return (
                      <div key={event.id} className="flex gap-4 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                          isPast ? "bg-success-50 border-success-300" : "bg-surface border-border-strong"
                        }`}>
                          {isPast ? (
                            <CheckCircle2 size={18} className="text-success-600" />
                          ) : (
                            <Calendar size={16} className="text-text-muted" />
                          )}
                        </div>
                        <div className="flex-1 p-4 rounded-xl bg-surface-sunken">
                          <div className="flex items-center justify-between">
                            <span className="text-[15px] font-bold text-text-primary">{event.eventType}</span>
                            <span className="text-sm font-mono font-medium text-text-muted bg-surface px-2 py-1 rounded-md border border-border">
                              {new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-text-secondary">
                            {event.startTime && event.endTime && (
                              <span className="flex items-center gap-1.5">
                                <Clock size={16} className="text-text-muted" /> {event.startTime} – {event.endTime}
                              </span>
                            )}
                            {event.venue && (
                              <span className="flex items-center gap-1.5">
                                <MapPin size={16} className="text-text-muted" /> {event.venue}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Summary */}
        <div className="card">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Package size={18} className="text-text-muted" /> Services ({project.services.length})
            </h3>
          </div>
          <div className="divide-y divide-border-subtle">
            {project.services.map((s: any) => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-medium text-text-primary">{s.serviceName}</p>
                  <p className="text-sm text-text-muted mt-1">
                    {s.quantity} × {formatCurrency(s.unitPrice)}
                  </p>
                </div>
                <span className="text-base font-mono font-semibold text-text-primary bg-surface-sunken px-3 py-1 rounded-lg">
                  {formatCurrency(s.totalPrice)}
                </span>
              </div>
            ))}
            <div className="px-6 py-4 flex items-center justify-between bg-surface-sunken">
              <span className="text-base font-bold text-text-primary">Total</span>
              <span className="text-lg font-bold font-mono text-text-primary">
                {formatCurrency(project.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Notes */}
        {project.notes && (
          <div className="card">
            <div className="px-6 py-5 border-b border-border">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <FileText size={18} className="text-text-muted" /> Notes
              </h3>
            </div>
            <div className="p-6">
              <p className="text-[15px] text-text-secondary leading-relaxed bg-surface-sunken p-4 rounded-xl border border-border-subtle">{project.notes}</p>
            </div>
          </div>
        )}

        {/* Crew */}
        {project.crew.length > 0 && (
          <div className="card">
            <div className="px-6 py-5 border-b border-border">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Users size={18} className="text-text-muted" /> Assigned Crew
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {project.crew.map((c: any) => (
                <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface-sunken border border-border-subtle">
                  <Avatar name={c.contactName} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-text-primary truncate">{c.contactName}</p>
                    <p className="text-sm text-text-secondary mt-0.5">{c.role}</p>
                  </div>
                  <Badge
                    variant={c.status === "CONFIRMED" ? "success" : c.status === "COMPLETED" ? "info" : "neutral"}
                    size="xs"
                  >
                    {c.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="card">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">Quick Actions</h3>
          </div>
          <div className="p-3 space-y-1">
            {[
              { label: "Record Payment", icon: IndianRupee },
              { label: "Add Crew Member", icon: Users },
              { label: "Add Event", icon: Calendar },
            ].map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-sunken hover:text-text-primary transition-colors"
              >
                <action.icon size={16} className="text-text-muted" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Events Tab ──
function EventsTab({ project, onAdd, onEdit, onDelete }: { project: any; onAdd: () => void; onEdit: (e: any) => void; onDelete: (id: string) => void }) {
  if (project.events.length === 0) {
    return <EmptyState title="No events scheduled" description="Add events to this project." action={<Button size="sm" onClick={onAdd}><Plus size={16} /> Add Event</Button>} />;
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={onAdd}><Plus size={16} /> Add Event</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {project.events.map((event: any) => {
          const isPast = new Date(event.eventDate) < new Date();
          return (
            <div key={event.id} className={`card p-5 ${isPast ? "opacity-70" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-semibold text-text-primary">{event.eventType}</h3>
                <div className="flex items-center gap-2">
                  {isPast ? <Badge variant="success" size="xs">Done</Badge> : <Badge variant="info" size="xs">Upcoming</Badge>}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(event)}><Edit2 className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(event.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-text-muted" />
                {new Date(event.eventDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
              </div>
              {event.startTime && event.endTime && (
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-text-muted" />
                  {event.startTime} – {event.endTime}
                </div>
              )}
              {event.venue && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-text-muted" />
                  {event.venue}
                </div>
              )}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

// ── Services Tab ──
function ServicesTab({ project, onAdd, onEdit, onDelete }: { project: any; onAdd: () => void; onEdit: (s: any) => void; onDelete: (id: string) => void }) {
  if (project.services.length === 0) {
    return <EmptyState title="No services added" description="Add services to this project." action={<Button size="sm" onClick={onAdd}><Plus size={16} /> Add Service</Button>} />;
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={onAdd}><Plus size={16} /> Add Service</Button>
      </div>
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Service</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Unit Price</th>
              <th className="text-right">Total</th>
              <th className="w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            {project.services.map((s: any) => (
              <tr key={s.id}>
                <td className="font-medium">{s.serviceName}</td>
                <td className="text-right">{s.quantity}</td>
                <td className="text-right font-mono">{formatCurrency(s.unitPrice)}</td>
                <td className="text-right font-mono font-medium">{formatCurrency(s.totalPrice)}</td>
                <td className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(s)}><Edit2 className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(s.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        <tfoot>
          <tr className="bg-surface-sunken">
            <td colSpan={3} className="font-semibold px-4 py-3">Subtotal</td>
            <td className="text-right font-mono font-bold px-4 py-3">{formatCurrency(project.totalAmount)}</td>
          </tr>
          {project.discountAmount > 0 && (
            <tr className="bg-surface-sunken">
              <td colSpan={3} className="text-success-600 px-4 py-2">Discount</td>
              <td className="text-right font-mono text-success-600 px-4 py-2">−{formatCurrency(project.discountAmount)}</td>
            </tr>
          )}
          <tr className="bg-surface-sunken border-t border-border">
            <td colSpan={3} className="font-bold px-4 py-3">Net Amount</td>
            <td className="text-right font-mono font-bold text-base px-4 py-3">{formatCurrency(project.netAmount)}</td>
          </tr>
        </tfoot>
      </table>
      </div>
    </div>
  );
}

// ── Crew Tab ──
function CrewTab({ project, onAdd, onEdit, onDelete }: { project: any; onAdd: () => void; onEdit: (c: any) => void; onDelete: (id: string) => void }) {
  if (project.crew.length === 0) {
    return (
      <EmptyState
        title="No crew assigned"
        description="Assign photographers, videographers, and editors to this project."
        action={<Button size="sm" onClick={onAdd}><Users size={16} /> Assign Crew</Button>}
      />
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={onAdd}><Users size={16} /> Assign Crew</Button>
      </div>
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th className="text-right">Daily Rate</th>
              <th className="text-right">Days</th>
              <th className="text-right">Total Cost</th>
              <th>Status</th>
              <th className="w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            {project.crew.map((c: any) => (
              <tr key={c.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <Avatar name={c.contactName} size="sm" />
                    <span className="font-medium">{c.contactName}</span>
                  </div>
                </td>
                <td className="text-text-secondary">{c.role}</td>
                <td className="text-right font-mono">{formatCurrency(c.dailyRate)}</td>
                <td className="text-right">{c.days}</td>
                <td className="text-right font-mono font-medium">{formatCurrency(c.totalCost)}</td>
                <td>
                  <Badge
                    variant={c.status === "CONFIRMED" ? "success" : c.status === "COMPLETED" ? "info" : c.status === "CANCELLED" ? "danger" : "neutral"}
                    size="sm"
                  >
                    {c.status}
                  </Badge>
                </td>
                <td className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(c)}><Edit2 className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(c.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        <tfoot>
          <tr className="bg-surface-sunken">
            <td colSpan={4} className="font-semibold px-4 py-3">Total Crew Cost</td>
            <td className="text-right font-mono font-bold px-4 py-3">
              {formatCurrency(project.crew.reduce((acc: number, c: any) => acc + c.totalCost, 0))}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
      </div>
    </div>
  );
}

// ── Payments Tab ──
function PaymentsTab({ project }: { project: any }) {
  return (
    <EmptyState
      title="No payments recorded"
      description="Record incoming payments for this project."
      action={<Button size="sm"><IndianRupee size={16} /> Record Payment</Button>}
    />
  );
}
