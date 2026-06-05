"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Wallet,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table";
import { TabFilter } from "@/components/ui/tab-filter";
import { KpiCard } from "@/components/ui/kpi-card";
import { formatCurrency } from "@/lib/utils/currency";
import { AddPaymentModal } from "./add-payment-modal";
import { createPayment, updatePayment, deletePayment } from "@/lib/actions/payments";
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
import { toast } from "sonner";
import type { PaymentFormValues } from "@/lib/validations/payment";

type PaymentTab = "all" | "incoming" | "outgoing";

interface Props {
  initialPayments: any[];
  projects?: any[];
  contacts?: any[];
  isLive?: boolean;
}

export function BillingContent({ initialPayments, projects = [], contacts = [], isLive = false }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PaymentTab>("all");
  const [payments, setPayments] = useState(initialPayments);
  const [isPending, startTransition] = useTransition();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<any | null>(null);

  const filtered = useMemo(() => {
    if (activeTab === "incoming") return payments.filter((p) => p.direction === "INCOMING");
    if (activeTab === "outgoing") return payments.filter((p) => p.direction === "OUTGOING");
    return payments;
  }, [activeTab, payments]);

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

  const handlePaymentSubmit = async (data: PaymentFormValues) => {
    startTransition(async () => {
      try {
        if (editingPayment) {
          await updatePayment(editingPayment.id, data);
          toast.success("Payment updated successfully");
        } else {
          await createPayment(data);
          toast.success("Payment recorded successfully");
        }
        setIsAddModalOpen(false);
        setEditingPayment(null);
        router.refresh();
      } catch (err) {
        toast.error("Failed to save payment");
        console.error(err);
      }
    });
  };

  const handleDeletePayment = async () => {
    if (!deletingPayment) return;
    startTransition(async () => {
      try {
        await deletePayment(deletingPayment.id, deletingPayment.project_id);
        toast.success("Payment deleted successfully");
        setDeletingPayment(null);
        router.refresh();
      } catch (err) {
        toast.error("Failed to delete payment");
        console.error(err);
      }
    });
  };

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
      {
        id: "actions",
        size: 50,
        cell: ({ row }) => {
          const p = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingPayment(p)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-danger-600 focus:text-danger-600"
                  onClick={() => setDeletingPayment(p)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-5 animate-fade-in-up">
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
        <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          Record Payment
        </Button>
      </div>

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

      <TabFilter
        tabs={tabs}
        activeTab={activeTab}
        onChange={(v) => setActiveTab(v as PaymentTab)}
      />

      <DataTable
        columns={columns}
        data={filtered}
        searchKey="contactName"
        searchPlaceholder="Search by contact or project..."
        emptyTitle="No payments found"
        emptyDescription="No payments found for the selected filter."
        emptyAction={
          <Button size="sm" variant="outline" onClick={() => setIsAddModalOpen(true)}>
            Record First Payment
          </Button>
        }
      />

      <AddPaymentModal
        open={isAddModalOpen || !!editingPayment}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) setEditingPayment(null);
        }}
        projects={projects}
        contacts={contacts}
        onSubmit={handlePaymentSubmit}
        defaultValues={
          editingPayment
            ? {
                projectId: editingPayment.projectId || "",
                contactId: editingPayment.contactId || "",
                amount: editingPayment.amount,
                paymentDate: new Date(editingPayment.paymentDate).toISOString().split("T")[0],
                paymentMethod: editingPayment.paymentMethod,
                referenceNo: editingPayment.referenceNo || "",
                paymentType: editingPayment.paymentType,
                direction: editingPayment.direction,
                notes: editingPayment.notes || "",
              }
            : undefined
        }
      />

      <AlertDialog open={!!deletingPayment} onOpenChange={(open) => !open && setDeletingPayment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger-600 text-white hover:bg-danger-700"
              onClick={handleDeletePayment}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
