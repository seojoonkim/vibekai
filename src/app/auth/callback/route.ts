import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    // Create response first - we'll add cookies to it
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Set cookies on the response object directly
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // Force a session refresh to trigger setAll
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      // Record daily login activity (only once per day in KST)
      const userId = data.session.user.id;
      const now = new Date();
      const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      const todayKST = kstNow.toISOString().split('T')[0]; // YYYY-MM-DD in KST

      // Check if already logged activity today (KST) - check last 2 days
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      const { data: recentLogs } = await supabase
        .from("xp_logs")
        .select("id, created_at")
        .eq("user_id", userId)
        .eq("action", "daily_login")
        .gte("created_at", twoDaysAgo.toISOString())
        .order("created_at", { ascending: false });

      let shouldRecordLogin = true;
      if (recentLogs && recentLogs.length > 0) {
        // Check if any log is from today (KST)
        shouldRecordLogin = !recentLogs.some(log => {
          const logUTC = new Date(log.created_at);
          const logKST = new Date(logUTC.getTime() + 9 * 60 * 60 * 1000);
          const logDateKST = logKST.toISOString().split('T')[0];
          return logDateKST === todayKST;
        });
      }

      if (shouldRecordLogin) {
        // Record login activity
        await supabase.from("xp_logs").insert({
          user_id: userId,
          action: "daily_login",
          xp_amount: 0,
          description: "일일 로그인",
        });
      }

      console.log("Auth callback success, cookies:", response.cookies.getAll().map(c => c.name));
      return response;
    }

    console.log("Auth callback error:", error?.message);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
