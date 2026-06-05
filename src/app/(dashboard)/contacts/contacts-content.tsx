"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table";
import { TabFilter } from "@/components/ui/tab-filter";
import { MOCK_CONTACTS, type MockContact } from "@/lib/data/mock-contacts";
import { CONTACT_ROLES } from "@/lib/utils/constants";
import { AddContactModal } from "./add-contact-modal";
import { DeleteContactDialog } from "./delete-contact-dialog";

type ContactTab = "all" | "b2c" | "b2b";

const TABS = [
  { value: "all", label: "All Contacts" },
  { value: "b2c", label: "B-C (Customers)" },
  { value: "b2b", label: "B-B (Partners)" },
] as const;

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

export function ContactsContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContactTab>("all");
  const [contacts, setContacts] = useState<MockContact[]>(MOCK_CONTACTS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editContact, setEditContact] = useState<MockContact | null>(null);
  const [deleteContact, setDeleteContact] = useState<MockContact | null>(null);

  // Filter contacts by tab
  const filteredContacts = useMemo(() => {
    switch (activeTab) {
      case "b2c":
        return contacts.filter((c) =>
          c.roles.some((r) => r.role === "CUSTOMER")
        );
      case "b2b":
        return contacts.filter((c) =>
          c.roles.some((r) =>
            ["PARTNER_STUDIO", "VENDOR"].includes(r.role)
          )
        );
      default:
        return contacts;
    }
  }, [contacts, activeTab]);

  // Tab counts
  const tabsWithCounts = useMemo(
    () =>
      TABS.map((tab) => ({
        ...tab,
        count:
          tab.value === "all"
            ? contacts.length
            : tab.value === "b2c"
              ? contacts.filter((c) => c.roles.some((r) => r.role === "CUSTOMER")).length
              : contacts.filter((c) =>
                  c.roles.some((r) => ["PARTNER_STUDIO", "VENDOR"].includes(r.role))
                ).length,
      })),
    [contacts]
  );

  // Handle add contact
  const handleAddContact = (data: MockContact) => {
    setContacts((prev) => [data, ...prev]);
    setIsAddOpen(false);
  };

  // Handle edit contact
  const handleEditContact = (data: MockContact) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === data.id ? data : c))
    );
    setEditContact(null);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setDeleteContact(null);
  };

  // Table columns
  const columns: ColumnDef<MockContact, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "displayName",
        header: "Contact",
        size: 280,
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar name={c.displayName} size="md" />
              <div className="min-w-0">
                <button
                  onClick={() => router.push(`/contacts/${c.id}`)}
                  className="text-sm font-semibold text-text-primary hover:text-accent-500 transition-colors truncate block text-left"
                >
                  {c.displayName}
                </button>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {c.roles.map((r) => (
                    <Badge
                      key={r.role}
                      variant={getRoleBadgeVariant(r.role)}
                      size="xs"
                    >
                      {r.role.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "phone",
        header: "Phone",
        size: 150,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            <Phone size={14} className="text-text-muted shrink-0" />
            {row.original.phone}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 220,
        cell: ({ row }) =>
          row.original.email ? (
            <div className="flex items-center gap-1.5 text-sm text-text-secondary truncate">
              <Mail size={14} className="text-text-muted shrink-0" />
              <span className="truncate">{row.original.email}</span>
            </div>
          ) : (
            <span className="text-text-muted text-sm">—</span>
          ),
      },
      {
        accessorKey: "city",
        header: "Location",
        size: 180,
        cell: ({ row }) => {
          const c = row.original;
          return c.city ? (
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <MapPin size={14} className="text-text-muted shrink-0" />
              {c.city}
              {c.state && <span className="text-text-muted">, {c.state.slice(0, 3)}</span>}
            </div>
          ) : (
            <span className="text-text-muted text-sm">—</span>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        size: 100,
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? "success" : "neutral"}>
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        size: 60,
        enableSorting: false,
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div className="relative group">
              <button className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-sunken transition-colors">
                <MoreVertical size={16} />
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-8 z-20 hidden group-hover:block bg-surface border border-border rounded-lg shadow-lg py-1 min-w-[140px] animate-scale-in">
                <button
                  onClick={() => router.push(`/contacts/${c.id}`)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-surface-sunken hover:text-text-primary transition-colors"
                >
                  <Eye size={14} /> View
                </button>
                <button
                  onClick={() => setEditContact(c)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-surface-sunken hover:text-text-primary transition-colors"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => setDeleteContact(c)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger-500 hover:bg-danger-50 transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          );
        },
      },
    ],
    [router]
  );

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Contacts</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Manage all your customers, partners, and team members in one place.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsAddOpen(true)}>
          <Plus size={16} />
          Add Contact
        </Button>
      </div>

      {/* Tab Filters */}
      <TabFilter
        tabs={tabsWithCounts}
        activeTab={activeTab}
        onChange={(v) => setActiveTab(v as ContactTab)}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredContacts}
        searchKey="displayName"
        searchPlaceholder="Search by name, phone, email..."
        emptyTitle="No contacts found"
        emptyDescription="Get started by adding your first contact."
        emptyAction={
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus size={16} />
            Add Contact
          </Button>
        }
      />

      {/* Add Contact Modal */}
      <AddContactModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAddContact}
      />

      {/* Edit Contact Modal */}
      {editContact && (
        <AddContactModal
          open={!!editContact}
          onOpenChange={(open) => !open && setEditContact(null)}
          onSubmit={handleEditContact}
          defaultValues={editContact}
        />
      )}

      {/* Delete Confirmation */}
      {deleteContact && (
        <DeleteContactDialog
          open={!!deleteContact}
          onOpenChange={(open) => !open && setDeleteContact(null)}
          contactName={deleteContact.displayName}
          onConfirm={() => handleDelete(deleteContact.id)}
        />
      )}
    </div>
  );
}
