import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Debug endpoint for E2E testing - staging only
 * Returns xp_logs count for a specific action + reference_id
 *
 * Usage: GET /api/debug/xp-logs?action=quiz_perfect&referenceId=01
 * Returns: { count: 1 }
 */
export async function GET(request: NextRequest) {
  // Guard: Only allow in development/staging
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_DEBUG_ENDPOINTS) {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");
  const referenceId = searchParams.get("referenceId");

  if (!action) {
    return NextResponse.json({ error: "action parameter required" }, { status: 400 });
  }

  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Build query
  let query = supabase
    .from("xp_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("action", action);

  if (referenceId) {
    query = query.eq("reference_id", referenceId);
  }

  const { count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    count: count ?? 0,
    action,
    referenceId,
    userId: user.id,
  });
}
