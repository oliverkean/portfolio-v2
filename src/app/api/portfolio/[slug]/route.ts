import { ZodError } from "zod";
import { getPortfolioBySlug, savePortfolio } from "@/features/portfolio/server/portfolio.service";
import { requireApiUser } from "@/features/auth/server/session";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  if (!portfolio) {
    return Response.json({ error: "Portfolio not found." }, { status: 404 });
  }

  return Response.json({ portfolio });
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireApiUser();

  if (!user) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const portfolio = await savePortfolio(slug, payload, user.id);

    return Response.json({ portfolio });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: "Validation failed.", issues: error.issues }, { status: 422 });
    }

    console.error(error);
    return Response.json({ error: "Unable to save portfolio." }, { status: 500 });
  }
}
