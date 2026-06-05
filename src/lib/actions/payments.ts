"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Types ──

export interface PaymentRow {
  id: string;
  project_id: string;
  contact_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  payment_type: string;
  direction: string;
  reference_no: string | null;
  notes: string | null;
  received_by_id: string | null;
  created_at: string;
}

export interface PaymentWithRelations extends PaymentRow {
  projects: { id: string; title: string | null; project_number: string };
  contacts: { id: string; display_name: string };
}

// ── Queries ──

export async function getPayments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select(`
      *,
      projects(id, title, project_number),
      contacts(id, display_name)
    `)
    .order("payment_date", { ascending: false });

  if (error) throw new Error(`Failed to fetch payments: ${error.message}`);
  return (data ?? []) as PaymentWithRelations[];
}

// ── Mutations ──

interface CreatePaymentInput {
  projectId: string;
  contactId: string;
  amount: number;
  paymentDate: string;
  paymentMethod?: string;
  paymentType?: string;
  direction?: string;
  referenceNo?: string;
  notes?: string;
}

export async function createPayment(input: CreatePaymentInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .insert({
      project_id: input.projectId,
      contact_id: input.contactId,
      amount: input.amount,
      payment_date: input.paymentDate,
      payment_method: input.paymentMethod || "CASH",
      payment_type: input.paymentType || "ADVANCE",
      direction: input.direction || "INCOMING",
      reference_no: input.referenceNo || null,
      notes: input.notes || null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create payment: ${error.message}`);

  // Update project paid_amount and balance_amount
  const dir = input.direction || "INCOMING";
  const sign = dir === "INCOMING" ? 1 : -1;
  await supabase.rpc("update_project_payment_totals", {
    p_project_id: input.projectId,
  }).then(({ error: rpcErr }) => {
    // Fallback: if RPC doesn't exist, update manually
    if (rpcErr) {
      // Simple recalculation
      return recalcProjectPayments(input.projectId);
    }
  });

  revalidatePath("/billing");
  revalidatePath(`/projects/${input.projectId}`);
  return data;
}

async function recalcProjectPayments(projectId: string) {
  const supabase = await createClient();

  // Sum incoming
  const { data: incoming } = await supabase
    .from("payments")
    .select("amount")
    .eq("project_id", projectId)
    .eq("direction", "INCOMING");

  const { data: outgoing } = await supabase
    .from("payments")
    .select("amount")
    .eq("project_id", projectId)
    .eq("direction", "OUTGOING");

  const totalIn = (incoming ?? []).reduce((acc, p) => acc + Number(p.amount), 0);
  const totalOut = (outgoing ?? []).reduce((acc, p) => acc + Number(p.amount), 0);
  const paid = totalIn;

  // Get net_amount
  const { data: project } = await supabase
    .from("projects")
    .select("net_amount")
    .eq("id", projectId)
    .single();

  const net = Number(project?.net_amount ?? 0);
  const balance = net - paid;

  await supabase
    .from("projects")
    .update({ paid_amount: paid, balance_amount: balance })
    .eq("id", projectId);
}

export async function deletePayment(id: string, projectId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("payments").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete payment: ${error.message}`);

  await recalcProjectPayments(projectId);
  revalidatePath("/billing");
  revalidatePath(`/projects/${projectId}`);
}
