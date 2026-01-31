import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I/O/0/1 for clarity
  let code = "";
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete any existing active codes for this user
  await supabase
    .from("discord_link_codes")
    .delete()
    .eq("user_id", user.id);

  // Generate unique code with collision retry
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  let code = "";
  let inserted = false;

  for (let attempt = 0; attempt < 5; attempt++) {
    code = generateCode();
    const { error } = await supabase.from("discord_link_codes").insert({
      user_id: user.id,
      code,
      expires_at: expiresAt,
    });

    if (!error) {
      inserted = true;
      break;
    }

    // Unique constraint violation — retry with new code
    if (error.code === "23505") continue;

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!inserted) {
    return NextResponse.json(
      { error: "Failed to generate unique code" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    code,
    expires_at: expiresAt,
  });
}
