import { notFound, redirect } from "next/navigation";
import { PortfolioShowcase } from "@/features/portfolio/components/portfolio-showcase";
import { getPortfolioBySlug } from "@/features/portfolio/server/portfolio.service";

const defaultPortfolioSlug = "oliver";

export const dynamic = "force-dynamic";

export default async function PublicPortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === defaultPortfolioSlug) {
    redirect("/");
  }

  const portfolio = await getPortfolioBySlug(slug);

  if (!portfolio || !portfolio.isPublished) {
    notFound();
  }

  return <PortfolioShowcase portfolio={portfolio} />;
}
