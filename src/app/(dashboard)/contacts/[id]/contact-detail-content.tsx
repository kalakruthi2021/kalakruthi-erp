"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Edit2,
  User,
  Briefcase,
  CreditCard,
  Clock,
  FileText,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_CONTACTS } from "@/lib/data/mock-contacts";
import { CONTACT_ROLES } from "@/lib/utils/constants";

interface ContactDetailContentProps {
  contactId: string;
}

function getRoleBadgeVariant(role: string) {
  const found = CONTACT_ROLES.find(
    (r) => r.value === role.toLowerCase()
  );
  return (found?.color ?? "neutral") as
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "neutral"
    | "danger";
}

type DetailTab = "overview" | "projects" | "payments" | "timeline";

const DETAIL_TABS: { value: DetailTab; label: string; icon: React.ElementType }[] = [
  { value: "overview", label: "Overview", icon: User },
  { value: "projects", label: "Projects", icon: Briefcase },
  { value: "payments", label: "Payments", icon: CreditCard },
  { value: "timeline", label: "Timeline", icon: Clock },
];

export function ContactDetailContent({ contactId }: ContactDetailContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  const contact = useMemo(
    () => MOCK_CONTACTS.find((c) => c.id === contactId),
    [contactId]
  );

  if (!contact) {
    return (
      <div className="animate-fade-in">
        <Button variant="ghost" onClick={() => router.push("/contacts")}>
          <ArrowLeft size={16} />
          Back to Contacts
        </Button>
        <EmptyState
          variant="error"
          title="Contact not found"
          description="The contact you're looking for doesn't exist or has been removed."
          action={
            <Button variant="outline" onClick={() => router.push("/contacts")}>
              Go to Contacts
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/contacts")}
      >
        <ArrowLeft size={16} />
        Back to Contacts
      </Button>

      {/* ── Contact Header Card ── */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar */}
          <Avatar name={contact.displayName} size="xl" />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  {contact.displayName}
                </h1>
                {contact.companyName && (
                  <p className="text-sm text-text-secondary flex items-center gap-1.5 mt-0.5">
                    <Building2 size={14} className="text-text-muted" />
                    {contact.companyName}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {contact.roles.map((r) => (
                    <Badge key={r.role} variant={getRoleBadgeVariant(r.role)}>
                      {r.role.replace("_", " ")}
                      {r.designation && ` · ${r.designation}`}
                    </Badge>
                  ))}
                  <Badge variant={contact.isActive ? "success" : "neutral"}>
                    {contact.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit2 size={14} />
                Edit
              </Button>
            </div>

            {/* Contact Details Row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Phone size={14} className="text-text-muted" />
                {contact.phone}
              </span>
              {contact.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-text-muted" />
                  {contact.email}
                </span>
              )}
              {contact.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-text-muted" />
                  {contact.city}
                  {contact.state && `, ${contact.state}`}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-text-muted" />
                Added{" "}
                {new Date(contact.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="border-b border-border">
        <nav className="flex gap-1 -mb-px" aria-label="Contact detail tabs">
          {DETAIL_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                  border-b-2 transition-colors duration-200
                  ${
                    isActive
                      ? "border-accent-500 text-accent-500"
                      : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong"
                  }
                `}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Tab Content ── */}
      <div className="animate-fade-in">
        {activeTab === "overview" && <OverviewTab contact={contact} />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "payments" && <PaymentsTab />}
        {activeTab === "timeline" && <TimelineTab contact={contact} />}
      </div>
    </div>
  );
}

// ── Overview Tab ──
function OverviewTab({ contact }: { contact: (typeof MOCK_CONTACTS)[number] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Info */}
      <div className="lg:col-span-2 card">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <User size={16} className="text-text-muted" />
            Personal Information
          </h3>
        </div>
        <div className="p-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <InfoItem label="First Name" value={contact.firstName} />
            <InfoItem label="Last Name" value={contact.lastName || "—"} />
            <InfoItem label="Phone" value={contact.phone} />
            <InfoItem label="Alt. Phone" value={contact.altPhone || "—"} />
            <InfoItem label="Email" value={contact.email || "—"} />
            <InfoItem label="Company" value={contact.companyName || "—"} />
            <InfoItem
              label="Location"
              value={
                [contact.address, contact.city, contact.state, contact.pincode]
                  .filter(Boolean)
                  .join(", ") || "—"
              }
            />
            <InfoItem
              label="Source"
              value={contact.source.replace("_", " ")}
            />
          </dl>
        </div>
      </div>

      {/* Roles & Notes */}
      <div className="space-y-6">
        {/* Roles */}
        <div className="card">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Tag size={16} className="text-text-muted" />
              Roles
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {contact.roles.map((r) => (
              <div
                key={r.role}
                className="flex items-center justify-between p-3 rounded-lg bg-surface-sunken"
              >
                <div>
                  <Badge variant={getRoleBadgeVariant(r.role)} size="xs">
                    {r.role.replace("_", " ")}
                  </Badge>
                  {r.designation && (
                    <p className="text-xs text-text-secondary mt-1">
                      {r.designation}
                    </p>
                  )}
                </div>
                {r.dailyRate && (
                  <span className="text-sm font-mono font-medium text-text-primary">
                    ₹{r.dailyRate.toLocaleString("en-IN")}/day
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {contact.notes && (
          <div className="card">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <FileText size={16} className="text-text-muted" />
                Notes
              </h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-text-secondary leading-relaxed">
                {contact.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-text-muted uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-sm text-text-primary mt-0.5">{value}</dd>
    </div>
  );
}

// ── Projects Tab (Placeholder) ──
function ProjectsTab() {
  return (
    <EmptyState
      title="No projects yet"
      description="Projects linked to this contact will appear here once created."
      action={
        <Button size="sm">
          <Briefcase size={16} />
          Create Project
        </Button>
      }
    />
  );
}

// ── Payments Tab (Placeholder) ──
function PaymentsTab() {
  return (
    <EmptyState
      title="No payments recorded"
      description="Payment history for this contact will appear here."
      action={
        <Button size="sm">
          <CreditCard size={16} />
          Record Payment
        </Button>
      }
    />
  );
}

// ── Timeline Tab ──
function TimelineTab({ contact }: { contact: (typeof MOCK_CONTACTS)[number] }) {
  const events = [
    {
      id: 1,
      action: "Contact created",
      date: contact.createdAt,
      icon: User,
    },
    ...(contact.updatedAt !== contact.createdAt
      ? [
          {
            id: 2,
            action: "Contact updated",
            date: contact.updatedAt,
            icon: Edit2,
          },
        ]
      : []),
  ].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="card p-5">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

        <div className="space-y-6">
          {events.map((event) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-surface-sunken border border-border flex items-center justify-center shrink-0 z-10">
                  <Icon size={14} className="text-text-muted" />
                </div>
                <div className="pt-1">
                  <p className="text-sm font-medium text-text-primary">
                    {event.action}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
