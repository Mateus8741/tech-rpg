import { notFound } from "next/navigation";
import { getBackground } from "@repo/rules";
import BackgroundDetail from "@/components/compendio/BackgroundDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getBackground(id);
  if (!item) notFound();
  return <BackgroundDetail background={item} />;
}
