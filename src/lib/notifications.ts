import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type NotificationType =
  | "chapter_complete"
  | "belt_upgrade"
  | "badge_earned"
  | "level_up"
  | "comment_reply";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  titleKo: string;
  titleEn: string;
  data?: Record<string, unknown>;
}

export async function createNotification({
  userId,
  type,
  titleKo,
  titleEn,
  data,
}: CreateNotificationParams) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title_ko: titleKo,
    title_en: titleEn,
    data: data ?? {},
    is_read: false,
  });
  if (error) {
    console.error("Failed to create notification:", error);
  }
}

export async function notifyChapterComplete(
  userId: string,
  chapterTitle: string,
  xpEarned: number,
  chapterId: string
) {
  await createNotification({
    userId,
    type: "chapter_complete",
    titleKo: `"${chapterTitle}" 수련 완료! +${xpEarned} XP`,
    titleEn: `Completed "${chapterTitle}"! +${xpEarned} XP`,
    data: { chapterId, xpEarned },
  });
}

export async function notifyBeltUpgrade(
  userId: string,
  beltNameKo: string,
  beltName: string,
  beltId: string
) {
  await createNotification({
    userId,
    type: "belt_upgrade",
    titleKo: `축하합니다! ${beltNameKo}로 승급했습니다!`,
    titleEn: `Congratulations! You've been promoted to ${beltName}!`,
    data: { beltId },
  });
}

export async function notifyBadgeEarned(
  userId: string,
  badgeNameKo: string,
  badgeNameEn: string,
  badgeId: string,
  badgeIcon: string
) {
  await createNotification({
    userId,
    type: "badge_earned",
    titleKo: `${badgeIcon} "${badgeNameKo}" 배지를 획득했습니다!`,
    titleEn: `${badgeIcon} You earned the "${badgeNameEn}" badge!`,
    data: { badgeId },
  });
}

export async function notifyLevelUp(
  userId: string,
  levelNameKo: string,
  levelNameEn: string,
  level: number
) {
  await createNotification({
    userId,
    type: "level_up",
    titleKo: `레벨 업! ${levelNameKo} (Lv.${level})`,
    titleEn: `Level Up! ${levelNameEn} (Lv.${level})`,
    data: { level },
  });
}
