import type { Metadata } from "next";
import { ContactDetailContent } from "./contact-detail-content";

export const metadata: Metadata = {
  title: "Contact Detail",
};

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ContactDetailContent contactId={id} />;
}
