import type { Metadata } from "next";
import { ContactsContent } from "./contacts-content";
import { getContacts, type ContactWithRoles } from "@/lib/actions/contacts";
import { MOCK_CONTACTS } from "@/lib/data/mock-contacts";

export const metadata: Metadata = {
  title: "Contacts",
};

/**
 * Adapter: converts Supabase rows to the shape the UI expects.
 * Falls back to mock data if Supabase isn't configured or fetch fails.
 */
function toUIContact(row: ContactWithRoles) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name ?? "",
    displayName: row.display_name,
    phone: row.phone,
    altPhone: row.alt_phone ?? undefined,
    email: row.email ?? undefined,
    companyName: row.company_name ?? undefined,
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    state: row.state ?? undefined,
    pincode: row.pincode ?? undefined,
    source: row.source,
    notes: row.notes ?? undefined,
    isActive: row.is_active,
    roles: row.contact_roles.map((r) => ({
      role: r.role,
      designation: r.designation ?? undefined,
      dailyRate: r.daily_rate ?? undefined,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default async function ContactsPage() {
  let contacts;
  let isLive = false;

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const rows = await getContacts();
      contacts = rows.map(toUIContact);
      isLive = true;
    } else {
      contacts = MOCK_CONTACTS;
    }
  } catch {
    // Fallback to mock data on error
    contacts = MOCK_CONTACTS;
  }

  return <ContactsContent initialContacts={contacts} isLive={isLive} />;
}
