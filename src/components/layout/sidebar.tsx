"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CreditCard,
  Calendar,
  Camera,
  Workflow,
  Package,
  ClipboardList,
  BookOpen,
  FileText,
  BarChart3,
  UserCog,
  Image,
  Settings,
  ChevronLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/stores/sidebar-store";

const NAV_SECTIONS = [
  {
    title: "DO WORK",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Contacts", href: "/contacts", icon: Users },
      { label: "Projects", href: "/projects", icon: FolderKanban },
      { label: "Bookings & Calendar", href: "/schedule", icon: Calendar },
    ],
  },
  {
    title: "MANAGE MONEY",
    items: [
      { label: "Payments", href: "/billing", icon: CreditCard },
      { label: "Vendors & Staff Costing", href: "/costing", icon: UserCog },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { label: "Services", href: "/services", icon: Camera },
      { label: "Production", href: "/production", icon: Workflow },
      { label: "Equipment", href: "/equipment", icon: Package },
      { label: "Work Log", href: "/work-log", icon: ClipboardList },
    ],
  },
  {
    title: "FINANCE",
    items: [
      { label: "Ledger", href: "/ledger", icon: BookOpen },
      { label: "Invoices", href: "/invoices", icon: FileText },
      { label: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    title: "CONTROL",
    items: [
      { label: "Team", href: "/team", icon: UserCog },
      { label: "Media Library", href: "/media", icon: Image },
      { label: "System Configuration", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggle, closeMobile } = useSidebarStore();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // Base
          "fixed top-0 left-0 z-50 h-full flex flex-col",
          "bg-sidebar-bg border-r border-sidebar-border",
          "transition-all duration-300 ease-in-out",
          // Desktop
          "lg:relative lg:z-auto",
          isCollapsed ? "lg:w-16" : "lg:w-60",
          // Mobile
          isMobileOpen
            ? "w-72 translate-x-0 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* ── Brand Header ── */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
          {/* Logo */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
            K
          </div>
          {!isCollapsed && (
            <div className="min-w-0 animate-fade-in">
              <h1 className="font-display text-base font-bold text-text-primary leading-tight truncate">
                Kalakruthi
              </h1>
              <p className="text-[10px] text-text-muted tracking-wider uppercase">
                Studio Manager v2.0
              </p>
            </div>
          )}

          {/* Collapse toggle (desktop) */}
          <button
            onClick={toggle}
            className="ml-auto hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-sidebar-item-active text-text-muted hover:text-text-secondary transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              size={16}
              className={cn(
                "transition-transform duration-300",
                isCollapsed && "rotate-180"
              )}
            />
          </button>

          {/* Close button (mobile) */}
          <button
            onClick={closeMobile}
            className="ml-auto lg:hidden flex items-center justify-center w-7 h-7 rounded-md hover:bg-sidebar-item-active text-text-muted"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-5">
              {/* Section Title */}
              {!isCollapsed && (
                <h2 className="px-3 mb-1.5 text-[10px] font-bold tracking-[0.1em] text-sidebar-section uppercase">
                  {section.title}
                </h2>
              )}

              {/* Nav Items */}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMobile}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
                          "transition-all duration-200",
                          isActive
                            ? "bg-sidebar-item-active text-sidebar-text-active"
                            : "text-sidebar-text hover:bg-sidebar-item-active/50 hover:text-text-primary",
                          isCollapsed && "justify-center px-0"
                        )}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <Icon
                          size={18}
                          className={cn(
                            "shrink-0",
                            isActive
                              ? "text-sidebar-text-active"
                              : "text-text-muted"
                          )}
                        />
                        {!isCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ── Footer ── */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-t border-sidebar-border text-[10px] text-text-muted">
            v2.0.0 • Built for Kalakruthi
          </div>
        )}
      </aside>
    </>
  );
}
