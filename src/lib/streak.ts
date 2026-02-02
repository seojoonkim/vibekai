import { createClient } from "@/lib/supabase/server";

/**
 * Get today's date in KST as "YYYY-MM-DD" string.
 * Compatible with PostgreSQL DATE type.
 */
function getTodayKST(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split("T")[0];
}

function getYesterdayKST(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  kst.setDate(kst.getDate() - 1);
  return kst.toISOString().split("T")[0];
}

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  isNewDay: boolean;
}

/**
 * Update user's streak. Idempotent — safe to call multiple times per day.
 *
 * Uses a conditional UPDATE with .neq("last_activity_date", todayKST)
 * so concurrent calls on the same day result in only one actual update.
 */
export async function updateStreak(userId: string): Promise<StreakResult> {
  const supabase = await createClient();
  const todayKST = getTodayKST();
  const yesterdayKST = getYesterdayKST();

  // 1. Read current values
  const { data: profile } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak, last_activity_date")
    .eq("id", userId)
    .single();

  if (!profile) {
    return { currentStreak: 0, longestStreak: 0, isNewDay: false };
  }

  const lastDate = profile.last_activity_date
    ? String(profile.last_activity_date).split("T")[0]
    : null;

  // 2. Already processed today — noop
  if (lastDate === todayKST) {
    return {
      currentStreak: profile.current_streak ?? 0,
      longestStreak: profile.longest_streak ?? 0,
      isNewDay: false,
    };
  }

  // 3. Calculate new streak
  let newStreak: number;
  if (lastDate === yesterdayKST) {
    newStreak = (profile.current_streak ?? 0) + 1;
  } else {
    newStreak = 1; // Reset
  }

  const newLongest = Math.max(newStreak, profile.longest_streak ?? 0);

  // 4. Idempotent UPDATE — only if last_activity_date != today
  //    If two requests race, only the first one updates (second gets 0 rows).
  const { data: updated } = await supabase
    .from("profiles")
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_activity_date: todayKST,
    })
    .eq("id", userId)
    .neq("last_activity_date", todayKST)
    .select("current_streak, longest_streak");

  // If 0 rows updated (concurrent call), return the values we calculated
  // They're still correct since we read the profile at the start
  if (!updated || updated.length === 0) {
    return {
      currentStreak: newStreak,
      longestStreak: newLongest,
      isNewDay: false,
    };
  }

  return {
    currentStreak: updated[0].current_streak,
    longestStreak: updated[0].longest_streak,
    isNewDay: true,
  };
}

/**
 * Get current streak without updating.
 */
export async function getStreak(userId: string): Promise<StreakResult> {
  const supabase = await createClient();
  const todayKST = getTodayKST();

  const { data: profile } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak, last_activity_date")
    .eq("id", userId)
    .single();

  if (!profile) {
    return { currentStreak: 0, longestStreak: 0, isNewDay: false };
  }

  const lastDate = profile.last_activity_date
    ? String(profile.last_activity_date).split("T")[0]
    : null;

  return {
    currentStreak: profile.current_streak ?? 0,
    longestStreak: profile.longest_streak ?? 0,
    isNewDay: lastDate !== todayKST,
  };
}
