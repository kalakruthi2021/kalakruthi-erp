import type { Metadata } from "next";
import { BillingContent } from "./billing-content";
import { getPayments } from "@/lib/actions/payments";
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
  let payments;
  let isLive = false;

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const rows = await getPayments();
      payments = rows.map(toUIPayment);
      isLive = true;
    } else {
      payments = MOCK_PAYMENTS;
    }
  } catch (err) {
    console.error("Failed to fetch payments, using mocks", err);
    payments = MOCK_PAYMENTS;
  }

  return <BillingContent initialPayments={payments} isLive={isLive} />;
}
