import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

interface NotifyRequest {
  chapter_num: number;
  chapter_title: string;
  unlocked_chapter?: number;
  part_complete?: boolean;
  total_progress?: number;
  xp_reward?: number;
}

function signPayload(payload: object, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");
}

async function sendWithRetry(
  url: string,
  payload: object,
  signature: string,
  maxRetries = 3
): Promise<boolean> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) return true;

      console.error(
        `[Discord Webhook] Attempt ${attempt + 1} failed: ${res.status}`
      );
    } catch (err) {
      console.error(
        `[Discord Webhook] Attempt ${attempt + 1} error:`,
        err
      );
    }

    // Exponential backoff: 1s, 2s, 4s
    if (attempt < maxRetries - 1) {
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }

  return false;
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const webhookSecret = process.env.DISCORD_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    // Webhook not configured — silently succeed (don't block chapter completion)
    return NextResponse.json({ success: true, webhook_sent: false });
  }

  let body: NotifyRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Get user's discord_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("discord_id")
    .eq("id", user.id)
    .single();

  if (!profile?.discord_id) {
    // User not linked to Discord — silently succeed
    return NextResponse.json({ success: true, webhook_sent: false });
  }

  const payload = {
    discord_id: profile.discord_id,
    guild_id: "1466005978632867881",
    chapter_num: body.chapter_num,
    chapter_title: body.chapter_title,
    unlocked_chapter: body.unlocked_chapter,
    part_complete: body.part_complete ?? false,
    total_progress: body.total_progress,
    xp_reward: body.xp_reward ?? 100,
  };

  const signature = signPayload(payload, webhookSecret);
  const sent = await sendWithRetry(
    `${webhookUrl}/webhook/chapter-complete`,
    payload,
    signature
  );

  return NextResponse.json({ success: true, webhook_sent: sent });
}
