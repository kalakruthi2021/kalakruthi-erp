"use client";

import {
  IndianRupee,
  Users,
  FolderKanban,
  CalendarCheck,
  Plus,
  ArrowRight,
} from "lucide-react";
import { KpiCard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";

// Demo KPI data — will be replaced with real queries in Phase 2
const KPI_DATA = [
  {
    title: "Total Revenue",
    value: "₹24.5L",
    trend: { value: "+12.5%", direction: "up" as const, label: "from last month" },
    icon: <IndianRupee size={18} />,
  },
  {
    title: "Active Projects",
    value: "18",
    trend: { value: "+3", direction: "up" as const, label: "this week" },
    icon: <FolderKanban size={18} />,
  },
  {
    title: "Total Contacts",
    value: "342",
    trend: { value: "+24", direction: "up" as const, label: "this month" },
    icon: <Users size={18} />,
  },
  {
    title: "Upcoming Events",
    value: "7",
    trend: { value: "Next 7 days", direction: "flat" as const },
    icon: <CalendarCheck size={18} />,
  },
];

const RECENT_ACTIVITY = [
  { id: 1, text: "New booking: Sharma Wedding — Haldi + Wedding + Reception", time: "2 hours ago", type: "project" },
  { id: 2, text: "Payment received: ₹50,000 advance from Ravi Kumar", time: "5 hours ago", type: "payment" },
  { id: 3, text: "Contact added: Studio Pixel Perfect (B2B Partner)", time: "1 day ago", type: "contact" },
  { id: 4, text: "Production complete: Mehta Engagement album delivered", time: "2 days ago", type: "delivery" },
  { id: 5, text: "Crew assigned: Ankit → Reddy Reception (Drone Operator)", time: "3 days ago", type: "assignment" },
];

export function DashboardContent() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Welcome back! Here&apos;s your studio overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <CalendarCheck size={16} />
            View Schedule
          </Button>
          <Button size="sm">
            <Plus size={16} />
            New Project
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-text-primary">Recent Activity</h2>
            <button className="flex items-center gap-1 text-sm text-accent-500 hover:text-accent-600 font-medium transition-colors">
              View all
              <ArrowRight size={14} />
            </button>
          </div>
          <ul className="divide-y divide-border-subtle">
            {RECENT_ACTIVITY.map((item) => (
              <li
                key={item.id}
                className="px-5 py-3.5 flex items-start gap-3 hover:bg-surface-raised transition-colors"
              >
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-accent-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-primary leading-snug">
                    {item.text}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-text-primary">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-2">
            {[
              { label: "Add New Contact", href: "/contacts", icon: Users },
              { label: "Create Project", href: "/projects/new", icon: FolderKanban },
              { label: "Record Payment", href: "/billing", icon: IndianRupee },
              { label: "View Schedule", href: "/schedule", icon: CalendarCheck },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-sunken hover:text-text-primary transition-colors group"
              >
                <action.icon
                  size={18}
                  className="text-text-muted group-hover:text-accent-500 transition-colors"
                />
                {action.label}
                <ArrowRight
                  size={14}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-text-muted"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
