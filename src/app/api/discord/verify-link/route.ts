import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  // Authenticate bot via shared secret
  const botToken = request.headers.get("X-Bot-Token");
  const expectedToken = process.env.BOT_SHARED_SECRET;

  if (!expectedToken || botToken !== expectedToken) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { code?: string; discord_id?: string; discord_username?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { code, discord_id, discord_username } = body;

  if (!code || !discord_id || !discord_username) {
    return NextResponse.json(
      { success: false, error: "Missing required fields: code, discord_id, discord_username" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Look up the code
  const { data: linkCode, error: codeError } = await supabase
    .from("discord_link_codes")
    .select("id, user_id, expires_at, used")
    .eq("code", code)
    .single();

  if (codeError || !linkCode) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired code" },
      { status: 400 }
    );
  }

  if (linkCode.used) {
    return NextResponse.json(
      { success: false, error: "Code already used" },
      { status: 400 }
    );
  }

  if (new Date(linkCode.expires_at) < new Date()) {
    return NextResponse.json(
      { success: false, error: "Code expired" },
      { status: 400 }
    );
  }

  // Check if this discord_id is already linked to another account
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("discord_id", discord_id)
    .single();

  if (existingProfile && existingProfile.id !== linkCode.user_id) {
    return NextResponse.json(
      { success: false, error: "This Discord account is already linked to another user" },
      { status: 409 }
    );
  }

  // Link the discord account to the user's profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ discord_id, discord_username })
    .eq("id", linkCode.user_id);

  if (updateError) {
    return NextResponse.json(
      { success: false, error: "Failed to link account" },
      { status: 500 }
    );
  }

  // Mark code as used
  await supabase
    .from("discord_link_codes")
    .update({ used: true })
    .eq("id", linkCode.id);

  // Get user info for response
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", linkCode.user_id)
    .single();

  return NextResponse.json({
    success: true,
    user_id: linkCode.user_id,
    username: profile?.username || "unknown",
  });
}
