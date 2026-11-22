import { notFound } from "next/navigation";
import { FEATS } from "@repo/rules";
import FeatDetail from "@/components/compendio/FeatDetail";

export function generateStaticParams() {
  return FEATS.map((f) => ({ id: f.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = FEATS.find((f) => f.id === id);
  if (!item) notFound();
  return <FeatDetail feat={item} />;
}
