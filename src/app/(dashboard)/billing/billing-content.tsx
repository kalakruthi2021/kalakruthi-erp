"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table";
import { TabFilter } from "@/components/ui/tab-filter";
import { KpiCard } from "@/components/ui/kpi-card";
import { type MockPayment } from "@/lib/data/mock-payments";
import { formatCurrency } from "@/lib/utils/currency";

type PaymentTab = "all" | "incoming" | "outgoing";

interface Props {
  initialPayments: any[];
  isLive?: boolean;
}

export function BillingContent({ initialPayments, isLive = false }: Props) {
  const [activeTab, setActiveTab] = useState<PaymentTab>("all");
  const [payments, setPayments] = useState(initialPayments);

  const filtered = useMemo(() => {
    if (activeTab === "incoming") return payments.filter((p) => p.direction === "INCOMING");
    if (activeTab === "outgoing") return payments.filter((p) => p.direction === "OUTGOING");
    return payments;
  }, [activeTab, payments]);

  // Stats
  const totalIncoming = payments
    .filter((p) => p.direction === "INCOMING")
    .reduce((acc, p) => acc + p.amount, 0);
  const totalOutgoing = payments
    .filter((p) => p.direction === "OUTGOING")
    .reduce((acc, p) => acc + p.amount, 0);
  const netCash = totalIncoming - totalOutgoing;

  const tabs = [
    { value: "all", label: "All Transactions", count: payments.length },
    { value: "incoming", label: "Incoming", count: payments.filter((p) => p.direction === "INCOMING").length },
    { value: "outgoing", label: "Outgoing", count: payments.filter((p) => p.direction === "OUTGOING").length },
  ];

  const columns: ColumnDef<any, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "paymentDate",
        header: "Date",
        size: 120,
        cell: ({ row }) => (
          <span className="text-sm font-mono text-text-secondary">
            {new Date(row.original.paymentDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        accessorKey: "contactName",
        header: "Contact",
        size: 200,
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex items-center gap-2.5">
              <Avatar name={p.contactName} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{p.contactName}</p>
                <p className="text-xs text-text-muted truncate">{p.projectTitle}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "paymentType",
        header: "Type",
        size: 140,
        cell: ({ row }) => (
          <Badge variant="neutral" size="sm">
            {row.original.paymentType.replace(/_/g, " ")}
          </Badge>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Method",
        size: 130,
        cell: ({ row }) => {
          const methodColors: Record<string, string> = {
            UPI: "text-info-600 bg-info-50",
            CASH: "text-success-600 bg-success-50",
            BANK_TRANSFER: "text-primary-600 bg-primary-50",
            CHEQUE: "text-warning-600 bg-warning-50",
            ONLINE: "text-accent-600 bg-accent-50",
          };
          const method = row.original.paymentMethod;
          const cls = methodColors[method] ?? "text-text-secondary bg-surface-sunken";
          return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${cls}`}>
              {method.replace(/_/g, " ")}
            </span>
          );
        },
      },
      {
        accessorKey: "referenceNo",
        header: "Reference",
        size: 150,
        cell: ({ row }) =>
          row.original.referenceNo ? (
            <span className="text-xs font-mono text-text-muted">
              {row.original.referenceNo}
            </span>
          ) : (
            <span className="text-text-muted text-sm">—</span>
          ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        size: 140,
        cell: ({ row }) => {
          const p = row.original;
          const isIncoming = p.direction === "INCOMING";
          return (
            <div className="flex items-center gap-1.5">
              {isIncoming ? (
                <ArrowDownLeft size={14} className="text-success-500" />
              ) : (
                <ArrowUpRight size={14} className="text-danger-500" />
              )}
              <span
                className={`text-sm font-mono font-semibold ${
                  isIncoming ? "text-success-600" : "text-danger-600"
                }`}
              >
                {isIncoming ? "+" : "−"}
                {formatCurrency(p.amount)}
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Payments
            {isLive && (
              <span className="inline ml-2 text-success-500 text-xs font-normal border border-success-200 bg-success-50 px-2 py-0.5 rounded-full align-middle">Live</span>
            )}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Track all incoming and outgoing payments.
          </p>
        </div>
        <Button size="sm">
          <Plus size={16} />
          Record Payment
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Received"
          value={formatCurrency(totalIncoming, { compact: true })}
          icon={<TrendingUp size={18} />}
          trend={{ value: `${payments.filter((p) => p.direction === "INCOMING").length} txns`, direction: "up" }}
        />
        <KpiCard
          title="Total Paid Out"
          value={formatCurrency(totalOutgoing, { compact: true })}
          icon={<TrendingDown size={18} />}
          trend={{ value: `${payments.filter((p) => p.direction === "OUTGOING").length} txns`, direction: "down" }}
        />
        <KpiCard
          title="Net Cash Flow"
          value={formatCurrency(netCash, { compact: true })}
          icon={<Wallet size={18} />}
          trend={{ value: netCash > 0 ? "Positive" : "Negative", direction: netCash > 0 ? "up" : "down" }}
        />
      </div>

      {/* Tabs */}
      <TabFilter
        tabs={tabs}
        activeTab={activeTab}
        onChange={(v) => setActiveTab(v as PaymentTab)}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        searchKey="contactName"
        searchPlaceholder="Search by contact or project..."
        emptyTitle="No payments found"
        emptyDescription="Record your first payment to get started."
        emptyAction={
          <Button size="sm">
            <Plus size={16} />
            Record Payment
          </Button>
        }
      />
    </div>
  );
}
