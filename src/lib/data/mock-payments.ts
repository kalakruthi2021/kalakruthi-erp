/**
 * Mock payment data for development.
 */
export interface MockPayment {
  id: string;
  projectId: string;
  projectTitle: string;
  projectNumber: string;
  contactId: string;
  contactName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  paymentType: string;
  direction: "INCOMING" | "OUTGOING";
  referenceNo?: string;
  notes?: string;
  createdAt: string;
}

export const MOCK_PAYMENTS: MockPayment[] = [
  {
    id: "pay1",
    projectId: "p1",
    projectTitle: "Sharma Family Wedding",
    projectNumber: "KAL-2026-001",
    contactId: "c1",
    contactName: "Ravi Sharma",
    amount: 50000,
    paymentDate: "2026-05-22",
    paymentMethod: "UPI",
    paymentType: "ADVANCE",
    direction: "INCOMING",
    referenceNo: "UPI-78234956",
    createdAt: "2026-05-22T10:30:00Z",
  },
  {
    id: "pay2",
    projectId: "p1",
    projectTitle: "Sharma Family Wedding",
    projectNumber: "KAL-2026-001",
    contactId: "c1",
    contactName: "Ravi Sharma",
    amount: 40000,
    paymentDate: "2026-06-01",
    paymentMethod: "BANK_TRANSFER",
    paymentType: "INSTALLMENT",
    direction: "INCOMING",
    referenceNo: "NEFT-AX789012",
    createdAt: "2026-06-01T14:00:00Z",
  },
  {
    id: "pay3",
    projectId: "p2",
    projectTitle: "Reddy Reception",
    projectNumber: "KAL-2026-002",
    contactId: "c4",
    contactName: "Sunita Reddy",
    amount: 50000,
    paymentDate: "2026-05-30",
    paymentMethod: "CASH",
    paymentType: "ADVANCE",
    direction: "INCOMING",
    notes: "Cash received at studio",
    createdAt: "2026-05-30T16:00:00Z",
  },
  {
    id: "pay4",
    projectId: "p3",
    projectTitle: "Mehta Engagement",
    projectNumber: "KAL-2026-003",
    contactId: "c8",
    contactName: "Anjali Mehta",
    amount: 20000,
    paymentDate: "2026-04-25",
    paymentMethod: "UPI",
    paymentType: "ADVANCE",
    direction: "INCOMING",
    referenceNo: "UPI-45689123",
    createdAt: "2026-04-25T11:00:00Z",
  },
  {
    id: "pay5",
    projectId: "p3",
    projectTitle: "Mehta Engagement",
    projectNumber: "KAL-2026-003",
    contactId: "c8",
    contactName: "Anjali Mehta",
    amount: 20000,
    paymentDate: "2026-05-20",
    paymentMethod: "BANK_TRANSFER",
    paymentType: "FINAL_SETTLEMENT",
    direction: "INCOMING",
    referenceNo: "NEFT-BX456789",
    createdAt: "2026-05-20T09:00:00Z",
  },
  {
    id: "pay6",
    projectId: "p4",
    projectTitle: "Kumari Birthday Celebration",
    projectNumber: "KAL-2026-004",
    contactId: "c6",
    contactName: "Meena Kumari",
    amount: 15000,
    paymentDate: "2026-06-02",
    paymentMethod: "CASH",
    paymentType: "ADVANCE",
    direction: "INCOMING",
    createdAt: "2026-06-02T12:00:00Z",
  },
  {
    id: "pay7",
    projectId: "p7",
    projectTitle: "LensKraft Editing — Chennai Wedding",
    projectNumber: "KAL-2026-B01",
    contactId: "c5",
    contactName: "Karthik Nair",
    amount: 15000,
    paymentDate: "2026-05-15",
    paymentMethod: "BANK_TRANSFER",
    paymentType: "ADVANCE",
    direction: "INCOMING",
    referenceNo: "NEFT-CX123456",
    createdAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "pay8",
    projectId: "p1",
    projectTitle: "Sharma Family Wedding",
    projectNumber: "KAL-2026-001",
    contactId: "c3",
    contactName: "Ankit Verma",
    amount: 15000,
    paymentDate: "2026-06-03",
    paymentMethod: "UPI",
    paymentType: "FULL",
    direction: "OUTGOING",
    referenceNo: "UPI-99887766",
    notes: "Photographer fee — 3 days",
    createdAt: "2026-06-03T17:00:00Z",
  },
  {
    id: "pay9",
    projectId: "p8",
    projectTitle: "Sharma Baby Annaprasana",
    projectNumber: "KAL-2026-007",
    contactId: "c1",
    contactName: "Ravi Sharma",
    amount: 23000,
    paymentDate: "2026-03-25",
    paymentMethod: "UPI",
    paymentType: "FULL",
    direction: "INCOMING",
    referenceNo: "UPI-11223344",
    createdAt: "2026-03-25T11:00:00Z",
  },
];
