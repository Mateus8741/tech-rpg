import { notFound } from "next/navigation";
import { getRace } from "@repo/rules";
import RaceDetail from "@/components/compendio/RaceDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getRace(id);
  if (!item) notFound();
  return <RaceDetail race={item} />;
}
