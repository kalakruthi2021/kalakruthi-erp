"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  Plus,
  Calendar,
  MapPin,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table";
import { TabFilter } from "@/components/ui/tab-filter";
import { type MockProject } from "@/lib/data/mock-projects";
import { formatCurrency } from "@/lib/utils/currency";
import { PROJECT_STATUSES } from "@/lib/utils/constants";

type ProjectTab = "all" | "active" | "completed" | "b2b";

const TABS = [
  { value: "all", label: "All Projects" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "b2b", label: "B2B" },
] as const;

const ACTIVE_STATUSES = ["INQUIRY", "QUOTATION_SENT", "CONFIRMED", "SCHEDULED", "IN_PROGRESS", "POST_PRODUCTION"];
const COMPLETED_STATUSES = ["DELIVERED", "COMPLETED"];

function getStatusVariant(status: string) {
  const found = PROJECT_STATUSES.find(
    (s) => s.value === status.toLowerCase()
  );
  return (found?.color ?? "neutral") as "accent" | "info" | "success" | "warning" | "neutral" | "danger";
}

function getPaymentProgress(paid: number, net: number) {
  if (net === 0) return 100;
  return Math.round((paid / net) * 100);
}

function getNextEventDate(project: MockProject): string | null {
  const today = new Date().toISOString().split("T")[0];
  const upcoming = project.events
    .filter((e) => e.eventDate >= today)
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  return upcoming[0]?.eventDate ?? null;
}

interface Props {
  initialProjects: any[];
  isLive?: boolean;
}

export function ProjectsContent({ initialProjects, isLive = false }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProjectTab>("all");
  const [projects, setProjects] = useState(initialProjects);

  const filteredProjects = useMemo(() => {
    switch (activeTab) {
      case "active":
        return projects.filter((p) => ACTIVE_STATUSES.includes(p.status));
      case "completed":
        return projects.filter((p) => COMPLETED_STATUSES.includes(p.status));
      case "b2b":
        return projects.filter((p) =>
          ["OUTSOURCED_WORK", "EDITING_ONLY", "PARTNER_REFERRAL"].includes(p.type || p.projectType)
        );
      default:
        return projects;
    }
  }, [activeTab]);

  const tabsWithCounts = useMemo(
    () =>
      TABS.map((tab) => ({
        ...tab,
        count:
          tab.value === "all"
            ? projects.length
            : tab.value === "active"
              ? projects.filter((p) => ACTIVE_STATUSES.includes(p.status)).length
              : tab.value === "completed"
                ? projects.filter((p) => COMPLETED_STATUSES.includes(p.status)).length
                : projects.filter((p) =>
                    ["OUTSOURCED_WORK", "EDITING_ONLY", "PARTNER_REFERRAL"].includes(p.type || p.projectType)
                  ).length,
      })),
    [projects]
  );

  const columns: ColumnDef<any, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Project",
        size: 300,
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex items-start gap-3">
              <Avatar name={p.customer?.name || p.customerName} size="md" />
              <div className="min-w-0">
                <button
                  onClick={() => router.push(`/projects/${p.id}`)}
                  className="text-sm font-semibold text-text-primary hover:text-accent-500 transition-colors truncate block text-left"
                >
                  {p.title}
                  {p.isUrgent && (
                    <AlertCircle size={14} className="inline ml-1.5 text-danger-500" />
                  )}
                </button>
                <p className="text-xs text-text-muted mt-0.5">
                  {p.projectNumber} · {p.customer?.name || p.customerName}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 140,
        cell: ({ row }) => (
          <Badge variant={getStatusVariant(row.original.status)}>
            {row.original.status.replace(/_/g, " ")}
          </Badge>
        ),
      },
      {
        accessorKey: "events",
        header: "Events",
        size: 160,
        enableSorting: false,
        cell: ({ row }) => {
          const p = row.original;
          const nextDate = getNextEventDate(p);
          return (
            <div className="text-sm">
              <span className="text-text-secondary">
                {p.events.length} event{p.events.length !== 1 ? "s" : ""}
              </span>
              {nextDate && (
                <div className="flex items-center gap-1 mt-0.5 text-xs text-text-muted">
                  <Calendar size={12} />
                  {new Date(nextDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "location",
        header: "Location",
        size: 160,
        cell: ({ row }) =>
          row.original.location ? (
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <MapPin size={14} className="text-text-muted shrink-0" />
              <span className="truncate">{row.original.location}</span>
            </div>
          ) : (
            <span className="text-text-muted text-sm">—</span>
          ),
      },
      {
        accessorKey: "netAmount",
        header: "Amount",
        size: 130,
        cell: ({ row }) => (
          <span className="text-sm font-mono font-medium text-text-primary">
            {formatCurrency(row.original.netAmount, { compact: true })}
          </span>
        ),
      },
      {
        accessorKey: "paidAmount",
        header: "Payment",
        size: 160,
        cell: ({ row }) => {
          const p = row.original;
          const progress = getPaymentProgress(p.paidAmount, p.netAmount);
          return (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-text-secondary">
                  {formatCurrency(p.paidAmount, { compact: true })}
                </span>
                <span
                  className={`font-semibold ${
                    progress === 100
                      ? "text-success-600"
                      : progress > 50
                        ? "text-warning-600"
                        : "text-danger-600"
                  }`}
                >
                  {progress}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progress === 100
                      ? "bg-success-500"
                      : progress > 50
                        ? "bg-warning-500"
                        : "bg-danger-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "",
        size: 50,
        enableSorting: false,
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/projects/${row.original.id}`)}
            className="p-1.5 rounded-md text-text-muted hover:text-accent-500 hover:bg-surface-sunken transition-colors"
            title="View project"
          >
            <Eye size={16} />
          </button>
        ),
      },
    ],
    [router]
  );

  // Summary stats
  const totalRevenue = projects.reduce((acc, p) => acc + (p.netAmount || p.totalAmount || 0), 0);
  const totalCollected = projects.reduce((acc, p) => acc + (p.paidAmount || 0), 0);
  const totalOutstanding = totalRevenue - totalCollected;
  const activeCount = projects.filter((p) => ACTIVE_STATUSES.includes(p.status)).length;

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Projects
            {isLive && (
              <span className="inline ml-2 text-success-500 text-xs font-normal border border-success-200 bg-success-50 px-2 py-0.5 rounded-full align-middle">Live</span>
            )}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Track all photography &amp; videography projects.
          </p>
        </div>
        <Button size="sm">
          <Plus size={16} />
          New Project
        </Button>
      </div>

      {/* Mini KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Projects", value: projects.length.toString(), accent: false },
          { label: "Active", value: activeCount.toString(), accent: false },
          { label: "Revenue", value: formatCurrency(totalRevenue, { compact: true }), accent: false },
          { label: "Outstanding", value: formatCurrency(totalOutstanding, { compact: true }), accent: totalOutstanding > 0 },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card px-4 py-3 flex flex-col"
          >
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
              {stat.label}
            </span>
            <span
              className={`text-lg font-bold font-mono mt-0.5 ${
                stat.accent ? "text-warning-600" : "text-text-primary"
              }`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Tab Filters */}
      <TabFilter
        tabs={tabsWithCounts}
        activeTab={activeTab}
        onChange={(v) => setActiveTab(v as ProjectTab)}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredProjects}
        searchKey="title"
        searchPlaceholder="Search projects..."
        emptyTitle="No projects found"
        emptyDescription="Create your first project to get started."
        emptyAction={
          <Button size="sm">
            <Plus size={16} />
            New Project
          </Button>
        }
      />
    </div>
  );
}
