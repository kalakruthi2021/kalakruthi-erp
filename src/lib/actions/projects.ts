"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Types ──

export interface ProjectRow {
  id: string;
  project_number: string;
  customer_id: string;
  partner_id: string | null;
  project_type: string;
  title: string | null;
  status: string;
  location: string | null;
  total_amount: number;
  discount_amount: number;
  net_amount: number;
  paid_amount: number;
  balance_amount: number;
  is_urgent: boolean;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithRelations extends ProjectRow {
  customer: { id: string; display_name: string; phone: string };
  partner: { id: string; display_name: string; phone: string } | null;
  project_events: {
    id: string;
    event_date: string;
    start_time: string | null;
    end_time: string | null;
    venue: string | null;
    notes: string | null;
    sort_order: number;
    event_types: { id: string; name: string; icon: string | null };
  }[];
  project_services: {
    id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    notes: string | null;
    services: { id: string; name: string };
  }[];
  project_crew: {
    id: string;
    role: string;
    daily_rate: number | null;
    days: number;
    total_cost: number | null;
    status: string;
    notes: string | null;
    contacts: { id: string; display_name: string };
  }[];
}

// ── Queries ──

export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      customer:contacts!customer_id(id, display_name, phone),
      partner:contacts!partner_id(id, display_name, phone),
      project_events(id, event_date, sort_order, event_types(id, name, icon))
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
  return data ?? [];
}

export async function getProjectById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      customer:contacts!customer_id(id, display_name, phone),
      partner:contacts!partner_id(id, display_name, phone),
      project_events(*, event_types(id, name, icon)),
      project_services(*, services(id, name)),
      project_crew(*, contacts(id, display_name))
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch project: ${error.message}`);
  }
  return data as ProjectWithRelations;
}

// ── Mutations ──

interface CreateProjectInput {
  customerId: string;
  partnerId?: string;
  projectType?: string;
  title?: string;
  status?: string;
  location?: string;
  isUrgent?: boolean;
  notes?: string;
}

export async function createProject(input: CreateProjectInput) {
  const supabase = await createClient();

  // Generate project number
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });
  const seq = String((count ?? 0) + 1).padStart(3, "0");
  const projectNumber = `KAL-${year}-${seq}`;

  const { data, error } = await supabase
    .from("projects")
    .insert({
      project_number: projectNumber,
      customer_id: input.customerId,
      partner_id: input.partnerId || null,
      project_type: input.projectType || "DIRECT_BOOKING",
      title: input.title || null,
      status: input.status || "INQUIRY",
      location: input.location || null,
      is_urgent: input.isUrgent || false,
      notes: input.notes || null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create project: ${error.message}`);

  revalidatePath("/projects");
  return data;
}

export async function updateProject(id: string, input: Partial<CreateProjectInput>) {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};
  if (input.customerId !== undefined) updateData.customer_id = input.customerId;
  if (input.partnerId !== undefined) updateData.partner_id = input.partnerId || null;
  if (input.projectType !== undefined) updateData.project_type = input.projectType;
  if (input.title !== undefined) updateData.title = input.title || null;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.location !== undefined) updateData.location = input.location || null;
  if (input.isUrgent !== undefined) updateData.is_urgent = input.isUrgent;
  if (input.notes !== undefined) updateData.notes = input.notes || null;

  const { error } = await supabase.from("projects").update(updateData).eq("id", id);
  if (error) throw new Error(`Failed to update project: ${error.message}`);

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete project: ${error.message}`);
  revalidatePath("/projects");
}
