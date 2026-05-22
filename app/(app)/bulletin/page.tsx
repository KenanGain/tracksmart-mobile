import type { Metadata } from "next";
import { getLoadTenders } from "@/lib/api/bulletin";
import { BulletinList } from "@/components/bulletin/BulletinList";

export const metadata: Metadata = { title: "Bulletin" };

export default async function BulletinPage() {
  const tenders = await getLoadTenders();
  return <BulletinList tenders={tenders} />;
}
