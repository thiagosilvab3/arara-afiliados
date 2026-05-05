import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "../../../lib/supabase/admin";

const analyticsEventSchema = z.object({
  eventName: z.enum([
    "page_view",
    "product_view",
    "checkout_start",
    "lead_submit",
    "affiliate_click",
  ]),
  slug: z.string().optional(),
  path: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = analyticsEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Payload inválido." },
        { status: 400 }
      );
    }

    const { eventName, slug, path } = parsed.data;

    const supabase = createSupabaseAdminClient();

    const payload = {
      event_name: eventName,
      product_slug: slug ?? null,
      path: path ?? null,
      session_id: null,
      user_agent: request.headers.get("user-agent"),
      ip_hash: null,
      metadata: {},
    };

    const { error } = await supabase.from("analytics_events").insert(payload);

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Erro interno ao registrar analytics." },
      { status: 500 }
    );
  }
}