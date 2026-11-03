import { Portfolio } from "@/components/portfolio/portfolio";
import { getSession } from "@/lib/auth";
import { getPortfolioData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [data, session] = await Promise.all([
    Promise.resolve(getPortfolioData()),
    getSession(),
  ]);
  return <Portfolio data={data} isAdmin={Boolean(session)} />;
}
