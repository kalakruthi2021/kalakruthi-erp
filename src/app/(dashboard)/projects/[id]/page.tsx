import type { Metadata } from "next";
import { ProjectDetailContent } from "./project-detail-content";

export const metadata: Metadata = {
  title: "Project Detail",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailContent projectId={id} />;
}
