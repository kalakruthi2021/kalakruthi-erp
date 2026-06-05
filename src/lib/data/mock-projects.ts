/**
 * Mock project data for development.
 * Will be replaced with Prisma queries once Supabase is connected.
 */

export interface MockProjectEvent {
  id: string;
  eventType: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
}

export interface MockProjectService {
  id: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface MockProjectCrew {
  id: string;
  contactId: string;
  contactName: string;
  role: string;
  dailyRate: number;
  days: number;
  totalCost: number;
  status: "ASSIGNED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}

export interface MockProject {
  id: string;
  projectNumber: string;
  customerId: string;
  customerName: string;
  partnerId?: string;
  partnerName?: string;
  projectType: string;
  title: string;
  status: string;
  location?: string;
  totalAmount: number;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
  isUrgent: boolean;
  notes?: string;
  events: MockProjectEvent[];
  services: MockProjectService[];
  crew: MockProjectCrew[];
  createdAt: string;
  updatedAt: string;
}

export const MOCK_PROJECTS: MockProject[] = [
  {
    id: "p1",
    projectNumber: "KAL-2026-001",
    customerId: "c1",
    customerName: "Ravi Sharma",
    projectType: "DIRECT_BOOKING",
    title: "Sharma Family Wedding",
    status: "CONFIRMED",
    location: "Sri Lakshmi Gardens, Hyderabad",
    totalAmount: 185000,
    discountAmount: 5000,
    netAmount: 180000,
    paidAmount: 90000,
    balanceAmount: 90000,
    isUrgent: false,
    notes: "3-day event. Client prefers candid style. Haldi needs drone coverage.",
    events: [
      { id: "e1", eventType: "Haldi", eventDate: "2026-07-10", startTime: "09:00", endTime: "14:00", venue: "Residence" },
      { id: "e2", eventType: "Wedding", eventDate: "2026-07-11", startTime: "07:00", endTime: "22:00", venue: "Sri Lakshmi Gardens" },
      { id: "e3", eventType: "Reception", eventDate: "2026-07-12", startTime: "18:00", endTime: "23:00", venue: "Grand Palace Hall" },
    ],
    services: [
      { id: "s1", serviceName: "Candid Photography", quantity: 3, unitPrice: 20000, totalPrice: 60000 },
      { id: "s2", serviceName: "Traditional Videography", quantity: 3, unitPrice: 15000, totalPrice: 45000 },
      { id: "s3", serviceName: "Drone Services", quantity: 1, unitPrice: 25000, totalPrice: 25000 },
      { id: "s4", serviceName: "LED Wall", quantity: 2, unitPrice: 15000, totalPrice: 30000 },
      { id: "s5", serviceName: "Live Streaming", quantity: 1, unitPrice: 25000, totalPrice: 25000 },
    ],
    crew: [
      { id: "cr1", contactId: "c3", contactName: "Ankit Verma", role: "Lead Photographer", dailyRate: 5000, days: 3, totalCost: 15000, status: "CONFIRMED" },
      { id: "cr2", contactId: "c7", contactName: "Deepak Singh", role: "Video Editor", dailyRate: 3000, days: 5, totalCost: 15000, status: "ASSIGNED" },
    ],
    createdAt: "2026-05-20T10:00:00Z",
    updatedAt: "2026-06-01T14:00:00Z",
  },
  {
    id: "p2",
    projectNumber: "KAL-2026-002",
    customerId: "c4",
    customerName: "Sunita Reddy",
    projectType: "DIRECT_BOOKING",
    title: "Reddy Reception",
    status: "IN_PROGRESS",
    location: "Hotel Daspalla, Guntur",
    totalAmount: 75000,
    discountAmount: 0,
    netAmount: 75000,
    paidAmount: 50000,
    balanceAmount: 25000,
    isUrgent: false,
    events: [
      { id: "e4", eventType: "Reception", eventDate: "2026-06-08", startTime: "18:00", endTime: "23:00", venue: "Hotel Daspalla" },
    ],
    services: [
      { id: "s6", serviceName: "Traditional Photography", quantity: 1, unitPrice: 15000, totalPrice: 15000 },
      { id: "s7", serviceName: "Candid Photography", quantity: 1, unitPrice: 20000, totalPrice: 20000 },
      { id: "s8", serviceName: "Traditional Videography", quantity: 1, unitPrice: 15000, totalPrice: 15000 },
      { id: "s9", serviceName: "Candid Videography", quantity: 1, unitPrice: 25000, totalPrice: 25000 },
    ],
    crew: [
      { id: "cr3", contactId: "c3", contactName: "Ankit Verma", role: "Photographer", dailyRate: 5000, days: 1, totalCost: 5000, status: "CONFIRMED" },
    ],
    createdAt: "2026-05-28T11:00:00Z",
    updatedAt: "2026-06-04T09:00:00Z",
  },
  {
    id: "p3",
    projectNumber: "KAL-2026-003",
    customerId: "c8",
    customerName: "Anjali Mehta",
    projectType: "DIRECT_BOOKING",
    title: "Mehta Engagement",
    status: "DELIVERED",
    location: "Rajahmundry",
    totalAmount: 45000,
    discountAmount: 5000,
    netAmount: 40000,
    paidAmount: 40000,
    balanceAmount: 0,
    isUrgent: false,
    notes: "Album delivered. Client very happy.",
    events: [
      { id: "e5", eventType: "Engagement", eventDate: "2026-05-15", startTime: "10:00", endTime: "18:00", venue: "Sri Sai Convention" },
    ],
    services: [
      { id: "s10", serviceName: "Candid Photography", quantity: 1, unitPrice: 20000, totalPrice: 20000 },
      { id: "s11", serviceName: "Candid Videography", quantity: 1, unitPrice: 25000, totalPrice: 25000 },
    ],
    crew: [],
    createdAt: "2026-04-20T09:00:00Z",
    updatedAt: "2026-05-25T16:00:00Z",
  },
  {
    id: "p4",
    projectNumber: "KAL-2026-004",
    customerId: "c6",
    customerName: "Meena Kumari",
    partnerId: "c2",
    partnerName: "Priya Patel (Pixel Perfect Studio)",
    projectType: "PARTNER_REFERRAL",
    title: "Kumari Birthday Celebration",
    status: "SCHEDULED",
    location: "Home, Hyderabad",
    totalAmount: 35000,
    discountAmount: 0,
    netAmount: 35000,
    paidAmount: 15000,
    balanceAmount: 20000,
    isUrgent: false,
    events: [
      { id: "e6", eventType: "Birthday", eventDate: "2026-06-20", startTime: "16:00", endTime: "22:00", venue: "Residence" },
    ],
    services: [
      { id: "s12", serviceName: "Traditional Photography", quantity: 1, unitPrice: 15000, totalPrice: 15000 },
      { id: "s13", serviceName: "Traditional Videography", quantity: 1, unitPrice: 15000, totalPrice: 15000 },
      { id: "s14", serviceName: "Save the Date Shoots", quantity: 1, unitPrice: 5000, totalPrice: 5000 },
    ],
    crew: [],
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-02T11:00:00Z",
  },
  {
    id: "p5",
    projectNumber: "KAL-2026-005",
    customerId: "c10",
    customerName: "Lakshmi Devi",
    projectType: "DIRECT_BOOKING",
    title: "Devi Gruhapravesam",
    status: "INQUIRY",
    location: "Nellore",
    totalAmount: 55000,
    discountAmount: 0,
    netAmount: 55000,
    paidAmount: 0,
    balanceAmount: 55000,
    isUrgent: false,
    notes: "Repeat client. Wants same team as last time.",
    events: [
      { id: "e7", eventType: "Gruhapravesam", eventDate: "2026-07-05", startTime: "06:00", endTime: "14:00", venue: "New House, Nellore" },
    ],
    services: [
      { id: "s15", serviceName: "Traditional Photography", quantity: 1, unitPrice: 15000, totalPrice: 15000 },
      { id: "s16", serviceName: "Traditional Videography", quantity: 1, unitPrice: 15000, totalPrice: 15000 },
      { id: "s17", serviceName: "Drone Services", quantity: 1, unitPrice: 25000, totalPrice: 25000 },
    ],
    crew: [],
    createdAt: "2026-06-03T14:00:00Z",
    updatedAt: "2026-06-03T14:00:00Z",
  },
  {
    id: "p6",
    projectNumber: "KAL-2026-006",
    customerId: "c12",
    customerName: "Sridevi Naidu",
    projectType: "DIRECT_BOOKING",
    title: "Naidu Wedding + Reception",
    status: "QUOTATION_SENT",
    location: "Visakhapatnam",
    totalAmount: 250000,
    discountAmount: 10000,
    netAmount: 240000,
    paidAmount: 0,
    balanceAmount: 240000,
    isUrgent: true,
    notes: "High-value client. Wants premium package with drone and live streaming.",
    events: [
      { id: "e8", eventType: "Laggalu", eventDate: "2026-08-01", startTime: "08:00", endTime: "12:00", venue: "TBD" },
      { id: "e9", eventType: "Wedding", eventDate: "2026-08-02", startTime: "06:00", endTime: "23:00", venue: "TBD" },
      { id: "e10", eventType: "Reception", eventDate: "2026-08-03", startTime: "18:00", endTime: "23:00", venue: "TBD" },
    ],
    services: [
      { id: "s18", serviceName: "Candid Photography", quantity: 3, unitPrice: 20000, totalPrice: 60000 },
      { id: "s19", serviceName: "Candid Videography", quantity: 3, unitPrice: 25000, totalPrice: 75000 },
      { id: "s20", serviceName: "Traditional Photography", quantity: 3, unitPrice: 15000, totalPrice: 45000 },
      { id: "s21", serviceName: "Drone Services", quantity: 2, unitPrice: 25000, totalPrice: 50000 },
      { id: "s22", serviceName: "Live Streaming", quantity: 1, unitPrice: 25000, totalPrice: 25000 },
    ],
    crew: [],
    createdAt: "2026-06-04T09:00:00Z",
    updatedAt: "2026-06-04T09:00:00Z",
  },
  {
    id: "p7",
    projectNumber: "KAL-2026-B01",
    customerId: "c5",
    customerName: "Karthik Nair (LensKraft Studios)",
    partnerId: "c5",
    partnerName: "Karthik Nair",
    projectType: "OUTSOURCED_WORK",
    title: "LensKraft Editing — Chennai Wedding",
    status: "POST_PRODUCTION",
    location: "Remote",
    totalAmount: 30000,
    discountAmount: 0,
    netAmount: 30000,
    paidAmount: 15000,
    balanceAmount: 15000,
    isUrgent: false,
    notes: "B2B editing job. Raw footage received. Delivery by June 15.",
    events: [],
    services: [
      { id: "s23", serviceName: "Editing Services", quantity: 1, unitPrice: 30000, totalPrice: 30000 },
    ],
    crew: [
      { id: "cr4", contactId: "c7", contactName: "Deepak Singh", role: "Video Editor", dailyRate: 3000, days: 7, totalCost: 21000, status: "ASSIGNED" },
    ],
    createdAt: "2026-05-10T08:00:00Z",
    updatedAt: "2026-06-02T10:00:00Z",
  },
  {
    id: "p8",
    projectNumber: "KAL-2026-007",
    customerId: "c1",
    customerName: "Ravi Sharma",
    projectType: "DIRECT_BOOKING",
    title: "Sharma Baby Annaprasana",
    status: "COMPLETED",
    location: "Home, Hyderabad",
    totalAmount: 25000,
    discountAmount: 2000,
    netAmount: 23000,
    paidAmount: 23000,
    balanceAmount: 0,
    isUrgent: false,
    events: [
      { id: "e11", eventType: "Annaprasana", eventDate: "2026-03-20", startTime: "10:00", endTime: "14:00", venue: "Residence" },
    ],
    services: [
      { id: "s24", serviceName: "Traditional Photography", quantity: 1, unitPrice: 15000, totalPrice: 15000 },
      { id: "s25", serviceName: "Traditional Videography", quantity: 1, unitPrice: 10000, totalPrice: 10000 },
    ],
    crew: [],
    createdAt: "2026-02-25T09:00:00Z",
    updatedAt: "2026-04-01T16:00:00Z",
  },
];
