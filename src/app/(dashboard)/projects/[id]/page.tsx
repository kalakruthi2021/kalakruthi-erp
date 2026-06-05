import type { Metadata } from "next";
import { ProjectDetailContent } from "./project-detail-content";
import { getProjectById, getEventTypes, getServiceTypes } from "@/lib/actions/projects";
import { getContacts } from "@/lib/actions/contacts";
import { MOCK_PROJECTS } from "@/lib/data/mock-projects";

export const metadata: Metadata = {
  title: "Project Detail",
};

function toUIProject(row: any) {
  return {
    id: row.id,
    projectNumber: row.project_number,
    title: row.title || "Untitled Project",
    customerName: row.customer?.display_name || "Unknown",
    partnerName: row.partner?.display_name,
    projectType: row.project_type,
    status: row.status,
    location: row.location,
    notes: row.notes,
    totalAmount: row.total_amount,
    discountAmount: row.discount_amount,
    netAmount: row.net_amount,
    paidAmount: row.paid_amount,
    balanceAmount: row.balance_amount,
    isUrgent: row.is_urgent,
    events: row.project_events?.map((e: any) => ({
      id: e.id,
      eventDate: e.event_date,
      eventType: e.event_types?.name || "Event",
      startTime: e.start_time,
      endTime: e.end_time,
      venue: e.venue,
    })) || [],
    services: row.project_services?.map((s: any) => ({
      id: s.id,
      serviceName: s.service_types?.name || "Service",
      quantity: s.quantity,
      unitPrice: s.unit_price,
      totalPrice: s.total_price,
    })) || [],
    crew: row.project_crew?.map((c: any) => ({
      id: c.id,
      contactName: c.contacts?.display_name || "Unknown",
      role: c.role,
      dailyRate: c.daily_rate,
      days: c.days,
      totalCost: c.total_cost,
      status: c.status,
    })) || [],
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let project;
  let eventTypes: any[] = [];
  let serviceTypes: any[] = [];
  let contacts: any[] = [];
  let isLive = false;

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const [row, etRows, stRows, cRows] = await Promise.all([
        getProjectById(id),
        getEventTypes(),
        getServiceTypes(),
        getContacts()
      ]);
      if (row) {
        project = toUIProject(row);
        eventTypes = etRows;
        serviceTypes = stRows;
        contacts = cRows;
        isLive = true;
      }
    }
  } catch (err) {
    console.error("Failed to fetch project detail, checking mocks", err);
  }

  // Fallback to mock data if not live or not found
  if (!project) {
    project = MOCK_PROJECTS.find((p) => p.id === id);
    eventTypes = [{id: "1", name: "Pre-Wedding"}, {id: "2", name: "Wedding"}, {id: "3", name: "Reception"}];
    serviceTypes = [{id: "1", name: "Photography"}, {id: "2", name: "Videography"}];
    contacts = [{id: "1", display_name: "John Doe"}, {id: "2", display_name: "Jane Smith"}];
  }

  return <ProjectDetailContent 
    project={project} 
    isLive={isLive} 
    eventTypes={eventTypes}
    services={serviceTypes}
    contacts={contacts}
  />;
}
