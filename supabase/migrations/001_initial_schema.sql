-- Kalakruthi v2 — Initial Schema Migration
-- Converted from Prisma schema to raw PostgreSQL DDL

-- ══════════════════════════════════════════
-- ENUMS
-- ══════════════════════════════════════════

CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER');
CREATE TYPE "ContactSource" AS ENUM ('WALK_IN', 'REFERRAL', 'ONLINE', 'PARTNER', 'SOCIAL_MEDIA', 'REPEAT', 'OTHER');
CREATE TYPE "RoleType" AS ENUM ('CUSTOMER', 'VENDOR', 'EMPLOYEE', 'FREELANCER', 'PARTNER_STUDIO', 'REFERRER');
CREATE TYPE "ServiceChannel" AS ENUM ('B2C', 'B2B', 'BOTH');
CREATE TYPE "ProjectType" AS ENUM ('DIRECT_BOOKING', 'PARTNER_REFERRAL', 'OUTSOURCED_WORK', 'EDITING_ONLY', 'SAVE_THE_DATE');
CREATE TYPE "ProjectStatus" AS ENUM ('INQUIRY', 'QUOTATION_SENT', 'CONFIRMED', 'SCHEDULED', 'IN_PROGRESS', 'POST_PRODUCTION', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'ARCHIVED');
CREATE TYPE "CrewStatus" AS ENUM ('ASSIGNED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'ONLINE', 'OTHER');
CREATE TYPE "PaymentType" AS ENUM ('ADVANCE', 'INSTALLMENT', 'FINAL_SETTLEMENT', 'REFUND', 'PARTIAL', 'FULL');
CREATE TYPE "PaymentDirection" AS ENUM ('INCOMING', 'OUTGOING');
CREATE TYPE "LedgerType" AS ENUM ('CREDIT', 'DEBIT');
CREATE TYPE "LedgerStatus" AS ENUM ('PENDING', 'SETTLED');
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'BLOCKED');
CREATE TYPE "WorkLogType" AS ENUM ('PERSONAL', 'PROFESSIONAL');
CREATE TYPE "InvoiceType" AS ENUM ('QUOTATION', 'TAX_INVOICE', 'RECEIPT', 'CREDIT_NOTE');
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED');
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- ══════════════════════════════════════════
-- TABLES
-- ══════════════════════════════════════════

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role "UserRole" NOT NULL DEFAULT 'STAFF',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contacts
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT,
  display_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  alt_phone TEXT,
  email TEXT,
  company_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  source "ContactSource" NOT NULL DEFAULT 'OTHER',
  referred_by_id UUID REFERENCES contacts(id),
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_display_name ON contacts(display_name);
CREATE INDEX idx_contacts_city_state ON contacts(city, state);

-- Contact Roles
CREATE TABLE contact_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  role "RoleType" NOT NULL,
  designation TEXT,
  daily_rate DECIMAL(10,2),
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(contact_id, role)
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  channel "ServiceChannel" NOT NULL,
  category TEXT,
  base_price DECIMAL(10,2),
  unit TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Event Types
CREATE TABLE event_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES contacts(id),
  partner_id UUID REFERENCES contacts(id),
  project_type "ProjectType" NOT NULL DEFAULT 'DIRECT_BOOKING',
  title TEXT,
  status "ProjectStatus" NOT NULL DEFAULT 'INQUIRY',
  location TEXT,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  net_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  balance_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_projects_customer ON projects(customer_id);
CREATE INDEX idx_projects_partner ON projects(partner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created ON projects(created_at);

-- Project Events
CREATE TABLE project_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  event_type_id UUID NOT NULL REFERENCES event_types(id),
  event_date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  venue TEXT,
  notes TEXT,
  sort_order INT NOT NULL DEFAULT 0
);
CREATE INDEX idx_project_events_date ON project_events(event_date);

-- Project Services
CREATE TABLE project_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT
);

-- Project Crew
CREATE TABLE project_crew (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id),
  role TEXT NOT NULL,
  daily_rate DECIMAL(10,2),
  days INT NOT NULL DEFAULT 1,
  total_cost DECIMAL(10,2),
  status "CrewStatus" NOT NULL DEFAULT 'ASSIGNED',
  notes TEXT,
  UNIQUE(project_id, contact_id)
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method "PaymentMethod" NOT NULL DEFAULT 'CASH',
  payment_type "PaymentType" NOT NULL DEFAULT 'ADVANCE',
  direction "PaymentDirection" NOT NULL DEFAULT 'INCOMING',
  reference_no TEXT,
  notes TEXT,
  received_by_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_payments_project ON payments(project_id);
CREATE INDEX idx_payments_contact ON payments(contact_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- Ledger Entries
CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_type "LedgerType" NOT NULL,
  category TEXT NOT NULL,
  contact_id UUID REFERENCES contacts(id),
  person_name TEXT,
  purpose TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  entry_date DATE NOT NULL,
  status "LedgerStatus" NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ledger_date ON ledger_entries(entry_date);
CREATE INDEX idx_ledger_category ON ledger_entries(category);

-- Production Tasks
CREATE TABLE production_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  title TEXT NOT NULL,
  status "TaskStatus" NOT NULL DEFAULT 'PENDING',
  assigned_to TEXT,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Work Logs
CREATE TABLE work_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_type "WorkLogType" NOT NULL DEFAULT 'PROFESSIONAL',
  log_date DATE NOT NULL,
  content TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  project_id UUID REFERENCES projects(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_work_logs_date ON work_logs(log_date);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  project_id UUID NOT NULL REFERENCES projects(id),
  invoice_type "InvoiceType" NOT NULL DEFAULT 'TAX_INVOICE',
  subtotal DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  status "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
  issued_at TIMESTAMPTZ,
  due_date DATE,
  pdf_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Media Files
CREATE TABLE media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  project_id UUID,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  action "AuditAction" NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- ══════════════════════════════════════════
-- TRIGGERS: auto-update updated_at
-- ══════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_contacts_updated BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_services_updated BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════════
-- SEED: Event Types
-- ══════════════════════════════════════════

INSERT INTO event_types (name, category, icon, sort_order) VALUES
  ('Barasala', 'celebration', '🍼', 1),
  ('Annaprasana', 'celebration', '🍚', 2),
  ('Birthday', 'celebration', '🎂', 3),
  ('Dhoti Ceremony', 'celebration', '👘', 4),
  ('Onilu', 'cultural', '🎵', 5),
  ('Mature Function', 'cultural', '🌸', 6),
  ('Laggalu', 'wedding', '💐', 7),
  ('Engagement', 'wedding', '💍', 8),
  ('Haldi', 'wedding', '💛', 9),
  ('Wedding', 'wedding', '💒', 10),
  ('Reception', 'wedding', '🥂', 11),
  ('Vratham', 'cultural', '🙏', 12),
  ('Gruhapravesam', 'property', '🏠', 13);

-- ══════════════════════════════════════════
-- SEED: Services
-- ══════════════════════════════════════════

INSERT INTO services (name, channel, category, base_price, unit, sort_order) VALUES
  ('Traditional Photography', 'BOTH', 'photography', 15000, 'per event', 1),
  ('Candid Photography', 'BOTH', 'photography', 20000, 'per event', 2),
  ('Traditional Videography', 'BOTH', 'videography', 15000, 'per event', 3),
  ('Candid Videography', 'BOTH', 'videography', 25000, 'per event', 4),
  ('Live Streaming', 'B2C', 'streaming', 25000, 'per event', 5),
  ('Drone Services', 'B2C', 'aerial', 25000, 'per event', 6),
  ('LED Wall', 'B2C', 'equipment', 15000, 'per event', 7),
  ('Save the Date Shoots', 'BOTH', 'shoots', 5000, 'per shoot', 8),
  ('Editing Services', 'B2B', 'post_production', 30000, 'per project', 9);

-- ══════════════════════════════════════════
-- RLS: Enable Row Level Security
-- ══════════════════════════════════════════

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (single-tenant app)
CREATE POLICY "Authenticated users have full access" ON users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON contact_roles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON event_types FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON project_events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON project_services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON project_crew FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON payments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON ledger_entries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON production_tasks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON work_logs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON invoices FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON media_files FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users have full access" ON audit_logs FOR ALL USING (auth.role() = 'authenticated');
