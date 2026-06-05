import type { Metadata } from "next";
import { ProjectsContent } from "./projects-content";
import { getProjects, type ProjectWithRelations } from "@/lib/actions/projects";
import { getContacts } from "@/lib/actions/contacts";
import { MOCK_PROJECTS } from "@/lib/data/mock-projects";
import { MOCK_CONTACTS } from "@/lib/data/mock-contacts";

export const metadata: Metadata = {
  title: "Projects",
};

/**
 * Adapter: converts Supabase rows to the shape the UI expects.
 * Falls back to mock data if Supabase isn't configured or fetch fails.
 */
function toUIProject(row: any) {
  return {
    id: row.id,
    projectNumber: row.project_number,
    customer: {
      name: row.customer?.display_name || "Unknown",
      phone: row.customer?.phone || "Unknown",
    },
    partner: row.partner ? {
      name: row.partner.display_name,
      phone: row.partner.phone,
    } : undefined,
    type: row.project_type,
    status: row.status,
    events: row.project_events?.map((e: any) => ({
      id: e.id,
      date: e.event_date,
      type: e.event_types?.name || "Event",
    })) || [],
    totalAmount: row.total_amount,
    paidAmount: row.paid_amount,
    balanceAmount: row.balance_amount,
    isUrgent: row.is_urgent,
  };
}

export default async function ProjectsPage() {
  let projects: any[] = [];
  let contacts: any[] = [];
  let isLive = false;

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const [pRows, cRows] = await Promise.all([
        getProjects(),
        getContacts(),
      ]);
      projects = pRows.map(toUIProject);
      contacts = cRows;
      isLive = true;
    } else {
      projects = MOCK_PROJECTS;
      contacts = MOCK_CONTACTS;
    }
  } catch (err) {
    console.error("Failed to fetch projects, using mocks", err);
    projects = MOCK_PROJECTS;
    contacts = MOCK_CONTACTS;
  }

  return <ProjectsContent initialProjects={projects} contacts={contacts} isLive={isLive} />;
}
