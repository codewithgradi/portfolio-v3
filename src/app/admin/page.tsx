import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getPortfolioData } from "@/lib/data";
import { AdminLogin } from "./login";
import { AdminDashboard } from "./dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Content Studio — Daniel Okafor",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session) return <AdminLogin />;
  return <AdminDashboard data={getPortfolioData()} username={session.username} />;
}
