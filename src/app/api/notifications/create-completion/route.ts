import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  notifyChapterComplete,
  notifyBeltUpgrade,
  notifyBadgeEarned,
  notifyLevelUp,
} from "@/lib/notifications";

export async function POST(request: NextRequest) {
  // Auth check - userId comes from session only
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { chapterTitle, chapterId, xpEarned, beltUp, levelUp, newBadges } = body;

  if (!chapterId || !chapterTitle) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Dedupe: check if chapter_complete notification already exists for this chapter
  const adminSupabase = createAdminClient();
  const { count: existing } = await adminSupabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("type", "chapter_complete")
    .contains("data", { chapterId });

  if (existing && existing > 0) {
    return NextResponse.json({ success: true, skipped: true });
  }

  // Create notifications
  await notifyChapterComplete(user.id, chapterTitle, xpEarned ?? 0, chapterId);

  if (beltUp?.to) {
    await notifyBeltUpgrade(
      user.id,
      beltUp.to.nameKo,
      beltUp.to.name,
      beltUp.to.id
    );
  }

  if (levelUp?.to) {
    await notifyLevelUp(
      user.id,
      levelUp.to.name?.ko ?? "",
      levelUp.to.name?.en ?? "",
      levelUp.to.level
    );
  }

  if (Array.isArray(newBadges)) {
    for (const badge of newBadges) {
      await notifyBadgeEarned(
        user.id,
        badge.name?.ko ?? "",
        badge.name?.en ?? "",
        badge.id,
        badge.icon ?? ""
      );
    }
  }

  return NextResponse.json({ success: true });
}
