import { PortfolioStudio } from "@/features/portfolio/components/portfolio-studio";
import { getPortfolioBySlug } from "@/features/portfolio/server/portfolio.service";
import { starterPortfolio } from "@/features/portfolio/portfolio.sample";
import { isDatabaseConfigured } from "@/lib/prisma";
import { requireUser } from "@/features/auth/server/session";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const user = await requireUser();
  const portfolio = (await getPortfolioBySlug("oliver")) ?? starterPortfolio;

  return <PortfolioStudio initialPortfolio={portfolio} databaseConfigured={isDatabaseConfigured()} user={user} />;
}
