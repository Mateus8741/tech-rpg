import { notFound } from "next/navigation";
import { getClass } from "@repo/rules";
import ClassDetail from "@/components/compendio/ClassDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getClass(id);
  if (!item) notFound();
  return <ClassDetail cls={item} />;
}
