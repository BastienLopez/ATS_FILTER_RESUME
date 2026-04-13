import { NextResponse } from "next/server";
import { getReport } from "@/services/reports/temp-report-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const report = getReport(id);

  if (!report) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Rapport introuvable ou expiré." } },
      { status: 404 },
    );
  }

  return NextResponse.json({ report }, { status: 200 });
}
