import type { Metadata } from "next";
import { BillingContent } from "./billing-content";

export const metadata: Metadata = {
  title: "Payments",
};

export default function BillingPage() {
  return <BillingContent />;
}
