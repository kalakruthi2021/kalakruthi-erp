/**
 * Mock contact data for development.
 * Will be replaced with Prisma queries once Supabase is connected.
 */

export interface MockContact {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone: string;
  altPhone?: string;
  email?: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  source: string;
  notes?: string;
  isActive: boolean;
  roles: { role: string; designation?: string; dailyRate?: number }[];
  createdAt: string;
  updatedAt: string;
}

export const MOCK_CONTACTS: MockContact[] = [
  {
    id: "c1",
    firstName: "Ravi",
    lastName: "Sharma",
    displayName: "Ravi Sharma",
    phone: "9876543210",
    email: "ravi.sharma@gmail.com",
    city: "Hyderabad",
    state: "Telangana",
    source: "WALK_IN",
    notes: "Referred by cousin Anil. Preferred candid style.",
    isActive: true,
    roles: [
      { role: "CUSTOMER" },
    ],
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "c2",
    firstName: "Priya",
    lastName: "Patel",
    displayName: "Priya Patel",
    phone: "9123456780",
    email: "priya.p@yahoo.com",
    companyName: "Pixel Perfect Studio",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    source: "PARTNER",
    isActive: true,
    roles: [
      { role: "PARTNER_STUDIO" },
      { role: "VENDOR" },
    ],
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-05-20T14:30:00Z",
  },
  {
    id: "c3",
    firstName: "Ankit",
    lastName: "Verma",
    displayName: "Ankit Verma",
    phone: "9988776655",
    email: "ankit.v@gmail.com",
    city: "Hyderabad",
    state: "Telangana",
    source: "REFERRAL",
    isActive: true,
    roles: [
      { role: "EMPLOYEE", designation: "Lead Photographer", dailyRate: 5000 },
      { role: "FREELANCER", designation: "Drone Operator", dailyRate: 8000 },
    ],
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-05-10T11:00:00Z",
  },
  {
    id: "c4",
    firstName: "Sunita",
    lastName: "Reddy",
    displayName: "Sunita Reddy",
    phone: "9012345678",
    email: "sunita.reddy@outlook.com",
    city: "Guntur",
    state: "Andhra Pradesh",
    source: "ONLINE",
    isActive: true,
    roles: [
      { role: "CUSTOMER" },
    ],
    createdAt: "2026-05-25T16:00:00Z",
    updatedAt: "2026-05-25T16:00:00Z",
  },
  {
    id: "c5",
    firstName: "Karthik",
    lastName: "Nair",
    displayName: "Karthik Nair",
    phone: "9876501234",
    companyName: "LensKraft Studios",
    city: "Chennai",
    state: "Tamil Nadu",
    source: "PARTNER",
    isActive: true,
    roles: [
      { role: "PARTNER_STUDIO" },
    ],
    createdAt: "2026-02-18T12:00:00Z",
    updatedAt: "2026-04-05T09:00:00Z",
  },
  {
    id: "c6",
    firstName: "Meena",
    lastName: "Kumari",
    displayName: "Meena Kumari",
    phone: "9112233445",
    email: "meena.k@gmail.com",
    city: "Hyderabad",
    state: "Telangana",
    source: "SOCIAL_MEDIA",
    isActive: true,
    roles: [
      { role: "CUSTOMER" },
    ],
    createdAt: "2026-05-30T08:00:00Z",
    updatedAt: "2026-05-30T08:00:00Z",
  },
  {
    id: "c7",
    firstName: "Deepak",
    lastName: "Singh",
    displayName: "Deepak Singh",
    phone: "9001122334",
    email: "deepak.singh@gmail.com",
    city: "Warangal",
    state: "Telangana",
    source: "WALK_IN",
    isActive: true,
    roles: [
      { role: "EMPLOYEE", designation: "Video Editor", dailyRate: 3000 },
    ],
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-03-15T14:00:00Z",
  },
  {
    id: "c8",
    firstName: "Anjali",
    lastName: "Mehta",
    displayName: "Anjali Mehta",
    phone: "9876509876",
    email: "anjali.m@gmail.com",
    city: "Rajahmundry",
    state: "Andhra Pradesh",
    source: "REFERRAL",
    notes: "Sister of Ravi Sharma. Engagement shoot booked.",
    isActive: true,
    roles: [
      { role: "CUSTOMER" },
      { role: "REFERRER" },
    ],
    createdAt: "2026-05-28T11:00:00Z",
    updatedAt: "2026-06-01T09:00:00Z",
  },
  {
    id: "c9",
    firstName: "Venkat",
    lastName: "Rao",
    displayName: "Venkat Rao",
    phone: "9554433221",
    companyName: "Dream Clicks",
    city: "Tirupati",
    state: "Andhra Pradesh",
    source: "PARTNER",
    isActive: false,
    roles: [
      { role: "PARTNER_STUDIO" },
      { role: "VENDOR" },
    ],
    createdAt: "2025-11-20T09:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "c10",
    firstName: "Lakshmi",
    lastName: "Devi",
    displayName: "Lakshmi Devi",
    phone: "9443322110",
    city: "Nellore",
    state: "Andhra Pradesh",
    source: "REPEAT",
    notes: "Second event. Very specific about traditional shots.",
    isActive: true,
    roles: [
      { role: "CUSTOMER" },
    ],
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-05-18T15:00:00Z",
  },
  {
    id: "c11",
    firstName: "Ramesh",
    lastName: "Kumar",
    displayName: "Ramesh Kumar",
    phone: "9667788990",
    email: "ramesh.k@yahoo.com",
    city: "Hyderabad",
    state: "Telangana",
    source: "ONLINE",
    isActive: true,
    roles: [
      { role: "FREELANCER", designation: "Makeup Artist", dailyRate: 6000 },
      { role: "VENDOR" },
    ],
    createdAt: "2026-03-20T13:00:00Z",
    updatedAt: "2026-05-25T16:00:00Z",
  },
  {
    id: "c12",
    firstName: "Sridevi",
    lastName: "Naidu",
    displayName: "Sridevi Naidu",
    phone: "9778899001",
    email: "sridevi.n@gmail.com",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    source: "SOCIAL_MEDIA",
    isActive: true,
    roles: [
      { role: "CUSTOMER" },
    ],
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-06-01T09:00:00Z",
  },
];
