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
import { MOCK_PROJECTS } from "@/lib/data/mock-projects";
import { formatCurrency } from "@/lib/utils/currency";
import { PROJECT_STATUSES } from "@/lib/utils/constants";

interface Props {
  projectId: string;
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

export function ProjectDetailContent({ projectId }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  const project = useMemo(
    () => MOCK_PROJECTS.find((p) => p.id === projectId),
    [projectId]
  );

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
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left: Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-text-muted">{project.projectNumber}</span>
                  {project.isUrgent && (
                    <Badge variant="danger" size="xs">
                      <AlertCircle size={10} /> URGENT
                    </Badge>
                  )}
                </div>
                <h1 className="text-xl font-bold text-text-primary">{project.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
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
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Avatar name={project.customerName} size="sm" />
                {project.customerName}
              </span>
              {project.partnerName && (
                <span className="flex items-center gap-1.5 text-info-600">
                  <Users size={14} /> {project.partnerName}
                </span>
              )}
              {project.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-text-muted" /> {project.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-text-muted" />
                {project.events.length} event{project.events.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Right: Financial Summary */}
          <div className="lg:w-72 w-full bg-surface-sunken rounded-xl p-4 space-y-3">
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
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Balance</span>
              <span className={`text-base font-bold font-mono ${project.balanceAmount > 0 ? "text-danger-600" : "text-success-600"}`}>
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
        {activeTab === "events" && <EventsTab project={project} />}
        {activeTab === "services" && <ServicesTab project={project} />}
        {activeTab === "crew" && <CrewTab project={project} />}
        {activeTab === "payments" && <PaymentsTab project={project} />}
      </div>
    </div>
  );
}

// ── Overview Tab ──
function OverviewTab({ project }: { project: (typeof MOCK_PROJECTS)[number] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Project Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Events Timeline */}
        {project.events.length > 0 && (
          <div className="card">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Calendar size={16} className="text-text-muted" /> Event Schedule
              </h3>
            </div>
            <div className="p-5">
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
                <div className="space-y-4">
                  {project.events.map((event) => {
                    const isPast = new Date(event.eventDate) < new Date();
                    return (
                      <div key={event.id} className="flex gap-4 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border ${
                          isPast ? "bg-success-50 border-success-200" : "bg-surface border-border"
                        }`}>
                          {isPast ? (
                            <CheckCircle2 size={14} className="text-success-500" />
                          ) : (
                            <Calendar size={14} className="text-text-muted" />
                          )}
                        </div>
                        <div className="flex-1 p-3 rounded-lg bg-surface-sunken">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-text-primary">{event.eventType}</span>
                            <span className="text-xs font-mono text-text-muted">
                              {new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-1 text-xs text-text-secondary">
                            {event.startTime && event.endTime && (
                              <span className="flex items-center gap-1">
                                <Clock size={12} /> {event.startTime} – {event.endTime}
                              </span>
                            )}
                            {event.venue && (
                              <span className="flex items-center gap-1">
                                <MapPin size={12} /> {event.venue}
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
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Package size={16} className="text-text-muted" /> Services ({project.services.length})
            </h3>
          </div>
          <div className="divide-y divide-border-subtle">
            {project.services.map((s) => (
              <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">{s.serviceName}</p>
                  <p className="text-xs text-text-muted">
                    {s.quantity} × {formatCurrency(s.unitPrice)}
                  </p>
                </div>
                <span className="text-sm font-mono font-medium text-text-primary">
                  {formatCurrency(s.totalPrice)}
                </span>
              </div>
            ))}
            <div className="px-5 py-3 flex items-center justify-between bg-surface-sunken">
              <span className="text-sm font-semibold text-text-primary">Total</span>
              <span className="text-sm font-bold font-mono text-text-primary">
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
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <FileText size={16} className="text-text-muted" /> Notes
              </h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-text-secondary leading-relaxed">{project.notes}</p>
            </div>
          </div>
        )}

        {/* Crew */}
        {project.crew.length > 0 && (
          <div className="card">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Users size={16} className="text-text-muted" /> Assigned Crew
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {project.crew.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-sunken">
                  <Avatar name={c.contactName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{c.contactName}</p>
                    <p className="text-xs text-text-muted">{c.role}</p>
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
function EventsTab({ project }: { project: (typeof MOCK_PROJECTS)[number] }) {
  if (project.events.length === 0) {
    return <EmptyState title="No events scheduled" description="Add events to this project." />;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {project.events.map((event) => {
        const isPast = new Date(event.eventDate) < new Date();
        return (
          <div key={event.id} className={`card p-5 ${isPast ? "opacity-70" : ""}`}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-semibold text-text-primary">{event.eventType}</h3>
              {isPast ? (
                <Badge variant="success" size="xs">Done</Badge>
              ) : (
                <Badge variant="info" size="xs">Upcoming</Badge>
              )}
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
  );
}

// ── Services Tab ──
function ServicesTab({ project }: { project: (typeof MOCK_PROJECTS)[number] }) {
  if (project.services.length === 0) {
    return <EmptyState title="No services added" description="Add services to this project." />;
  }
  return (
    <div className="card overflow-hidden">
      <table className="data-table">
        <thead>
          <tr>
            <th>Service</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Unit Price</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {project.services.map((s) => (
            <tr key={s.id}>
              <td className="font-medium">{s.serviceName}</td>
              <td className="text-right">{s.quantity}</td>
              <td className="text-right font-mono">{formatCurrency(s.unitPrice)}</td>
              <td className="text-right font-mono font-medium">{formatCurrency(s.totalPrice)}</td>
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
  );
}

// ── Crew Tab ──
function CrewTab({ project }: { project: (typeof MOCK_PROJECTS)[number] }) {
  if (project.crew.length === 0) {
    return (
      <EmptyState
        title="No crew assigned"
        description="Assign photographers, videographers, and editors to this project."
        action={<Button size="sm"><Users size={16} /> Assign Crew</Button>}
      />
    );
  }
  return (
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
          </tr>
        </thead>
        <tbody>
          {project.crew.map((c) => (
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
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-surface-sunken">
            <td colSpan={4} className="font-semibold px-4 py-3">Total Crew Cost</td>
            <td className="text-right font-mono font-bold px-4 py-3">
              {formatCurrency(project.crew.reduce((acc, c) => acc + c.totalCost, 0))}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ── Payments Tab ──
function PaymentsTab({ project }: { project: (typeof MOCK_PROJECTS)[number] }) {
  return (
    <EmptyState
      title="No payments recorded"
      description="Record incoming payments for this project."
      action={<Button size="sm"><IndianRupee size={16} /> Record Payment</Button>}
    />
  );
}
