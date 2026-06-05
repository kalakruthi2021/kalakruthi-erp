import type { Metadata } from "next";
import { BillingContent } from "./billing-content";
import { getPayments } from "@/lib/actions/payments";
import { getProjects } from "@/lib/actions/projects";
import { getContacts } from "@/lib/actions/contacts";
import { MOCK_PAYMENTS } from "@/lib/data/mock-payments";

export const metadata: Metadata = {
  title: "Payments",
};

/**
 * Adapter: converts Supabase rows to the shape the UI expects.
 */
function toUIPayment(row: any) {
  return {
    id: row.id,
    projectId: row.project_id,
    projectTitle: row.projects?.title || row.projects?.project_number || "Unknown Project",
    contactId: row.contact_id,
    contactName: row.contacts?.display_name || "Unknown",
    amount: row.amount,
    paymentDate: row.payment_date,
    paymentMethod: row.payment_method,
    paymentType: row.payment_type,
    direction: row.direction,
    referenceNo: row.reference_no,
    notes: row.notes,
  };
}

export default async function BillingPage() {
  let payments: any[] = [];
  let projects: any[] = [];
  let contacts: any[] = [];
  let isLive = false;

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const [payRows, projRows, contactRows] = await Promise.all([
        getPayments(),
        getProjects(),
        getContacts()
      ]);
      payments = payRows.map(toUIPayment);
      projects = projRows;
      contacts = contactRows;
      isLive = true;
    } else {
      payments = MOCK_PAYMENTS;
      projects = [];
      contacts = [];
    }
  } catch (err) {
    console.error("Failed to fetch payments data, using mocks", err);
    payments = MOCK_PAYMENTS;
    projects = [];
    contacts = [];
  }

  return <BillingContent initialPayments={payments} projects={projects} contacts={contacts} isLive={isLive} />;
}
