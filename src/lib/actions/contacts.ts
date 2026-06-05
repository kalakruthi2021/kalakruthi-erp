"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Types ──

export interface ContactRow {
  id: string;
  first_name: string;
  last_name: string | null;
  display_name: string;
  phone: string;
  alt_phone: string | null;
  email: string | null;
  company_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  source: string;
  referred_by_id: string | null;
  notes: string | null;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ContactWithRoles extends ContactRow {
  contact_roles: {
    id: string;
    role: string;
    designation: string | null;
    daily_rate: number | null;
    is_active: boolean;
  }[];
}

// ── Queries ──

export async function getContacts(): Promise<ContactWithRoles[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*, contact_roles(*)")
    .order("display_name");

  if (error) throw new Error(`Failed to fetch contacts: ${error.message}`);
  return (data ?? []) as ContactWithRoles[];
}

export async function getContactById(id: string): Promise<ContactWithRoles | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*, contact_roles(*)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(`Failed to fetch contact: ${error.message}`);
  }
  return data as ContactWithRoles;
}

// ── Mutations ──

interface CreateContactInput {
  firstName: string;
  lastName?: string;
  phone: string;
  altPhone?: string;
  email?: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  source?: string;
  notes?: string;
  roles?: { role: string; designation?: string; dailyRate?: number }[];
}

export async function createContact(input: CreateContactInput) {
  const supabase = await createClient();
  const displayName = [input.firstName, input.lastName].filter(Boolean).join(" ");

  const { data: contact, error } = await supabase
    .from("contacts")
    .insert({
      first_name: input.firstName,
      last_name: input.lastName || null,
      display_name: displayName,
      phone: input.phone,
      alt_phone: input.altPhone || null,
      email: input.email || null,
      company_name: input.companyName || null,
      address: input.address || null,
      city: input.city || null,
      state: input.state || null,
      pincode: input.pincode || null,
      source: input.source || "OTHER",
      notes: input.notes || null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create contact: ${error.message}`);

  // Insert roles
  if (input.roles && input.roles.length > 0) {
    const roleRows = input.roles.map((r) => ({
      contact_id: contact.id,
      role: r.role,
      designation: r.designation || null,
      daily_rate: r.dailyRate || null,
    }));

    const { error: roleError } = await supabase
      .from("contact_roles")
      .insert(roleRows);

    if (roleError) throw new Error(`Failed to create roles: ${roleError.message}`);
  }

  revalidatePath("/contacts");
  return contact;
}

export async function updateContact(id: string, input: Partial<CreateContactInput>) {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};
  if (input.firstName !== undefined) updateData.first_name = input.firstName;
  if (input.lastName !== undefined) updateData.last_name = input.lastName || null;
  if (input.firstName || input.lastName) {
    updateData.display_name = [input.firstName, input.lastName].filter(Boolean).join(" ");
  }
  if (input.phone !== undefined) updateData.phone = input.phone;
  if (input.altPhone !== undefined) updateData.alt_phone = input.altPhone || null;
  if (input.email !== undefined) updateData.email = input.email || null;
  if (input.companyName !== undefined) updateData.company_name = input.companyName || null;
  if (input.address !== undefined) updateData.address = input.address || null;
  if (input.city !== undefined) updateData.city = input.city || null;
  if (input.state !== undefined) updateData.state = input.state || null;
  if (input.pincode !== undefined) updateData.pincode = input.pincode || null;
  if (input.source !== undefined) updateData.source = input.source;
  if (input.notes !== undefined) updateData.notes = input.notes || null;

  const { error } = await supabase
    .from("contacts")
    .update(updateData)
    .eq("id", id);

  if (error) throw new Error(`Failed to update contact: ${error.message}`);

  // Update roles if provided
  if (input.roles) {
    // Delete existing roles and re-insert
    await supabase.from("contact_roles").delete().eq("contact_id", id);
    if (input.roles.length > 0) {
      const roleRows = input.roles.map((r) => ({
        contact_id: id,
        role: r.role,
        designation: r.designation || null,
        daily_rate: r.dailyRate || null,
      }));
      await supabase.from("contact_roles").insert(roleRows);
    }
  }

  revalidatePath("/contacts");
  revalidatePath(`/contacts/${id}`);
}

export async function deleteContact(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete contact: ${error.message}`);
  revalidatePath("/contacts");
}

export async function toggleContactActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contacts")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) throw new Error(`Failed to toggle contact: ${error.message}`);
  revalidatePath("/contacts");
  revalidatePath(`/contacts/${id}`);
}
