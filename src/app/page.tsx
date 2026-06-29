import { notFound } from "next/navigation";
import { PortfolioShowcase } from "@/features/portfolio/components/portfolio-showcase";
import { getPortfolioBySlug } from "@/features/portfolio/server/portfolio.service";

const defaultPortfolioSlug = "oliver";

export const dynamic = "force-dynamic";

export default async function Home() {
  const portfolio = await getPortfolioBySlug(defaultPortfolioSlug);

  if (!portfolio || !portfolio.isPublished) {
    notFound();
  }

  return <PortfolioShowcase portfolio={portfolio} />;
}
