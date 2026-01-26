import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { BeltProgressCard } from "@/components/gamification/belt-badge";
import { Icons } from "@/components/icons";
import { CURRICULUM_DATA, getAllChapters } from "@/lib/curriculum-data";
import { CharacterDisplay } from "@/components/dashboard/character-display";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get today's date in KST for comparison
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const todayKST = kstNow.toISOString().split('T')[0];

  // Record daily login activity (only once per day in KST)
  let justRecordedLogin = false;
  if (user) {
    // Check if already logged activity today (KST) - check last 2 days
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const { data: recentLogs } = await supabase
      .from("xp_logs")
      .select("id, created_at")
      .eq("user_id", user.id)
      .eq("action", "daily_login")
      .gte("created_at", twoDaysAgo.toISOString())
      .order("created_at", { ascending: false });

    let hasLoggedToday = false;
    if (recentLogs && recentLogs.length > 0) {
      // Check if any log is from today (KST)
      hasLoggedToday = recentLogs.some(log => {
        const logUTC = new Date(log.created_at);
        const logKST = new Date(logUTC.getTime() + 9 * 60 * 60 * 1000);
        const logDateKST = logKST.toISOString().split('T')[0];
        return logDateKST === todayKST;
      });
    }

    if (!hasLoggedToday) {
      const { data: insertedLog } = await supabase.from("xp_logs").insert({
        user_id: user.id,
        action: "daily_login",
        amount: 0,
      }).select();

      if (insertedLog) {
        justRecordedLogin = true;
      }
    }
  }

  // Fetch real user profile data from database
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_url, total_xp, current_streak, character_id")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  // Fetch completed chapters count
  let completedChaptersCount = 0;
  if (user) {
    const { count } = await supabase
      .from("progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "completed");
    completedChaptersCount = count || 0;
  }

  // Fetch activity data for heatmap (last 1 year)
  let activityData: { date: string; count: number }[] = [];
  if (user) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 370); // ~1 year + buffer

    // Fetch all xp_logs including the one we just inserted
    const { data: xpLogs } = await supabase
      .from("xp_logs")
      .select("created_at")
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    const countByDate = new Map<string, number>();

    if (xpLogs && xpLogs.length > 0) {
      xpLogs.forEach((log) => {
        // Convert UTC to KST (UTC+9) for proper date grouping
        const utcDate = new Date(log.created_at);
        const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
        // Use ISO string split for accurate date extraction
        const date = kstDate.toISOString().split('T')[0];
        countByDate.set(date, (countByDate.get(date) || 0) + 1);
      });
    }

    // If we just recorded login, ensure today is in the map
    // This handles replication lag or timing issues
    if (justRecordedLogin && !countByDate.has(todayKST)) {
      countByDate.set(todayKST, 1);
    }

    activityData = Array.from(countByDate.entries()).map(([date, count]) => ({ date, count }));
  }

  const userStats = {
    displayName: profile?.display_name || profile?.username || user?.email?.split("@")[0] || "수련생",
    characterId: profile?.character_id ?? "panda",
    totalXp: profile?.total_xp ?? 0,
    currentStreak: profile?.current_streak ?? 0,
    completedChapters: completedChaptersCount,
  };

  const totalChapters = getAllChapters().length;
  const progressPercent = Math.round(
    (userStats.completedChapters / totalChapters) * 100
  );

  const nextChapterId = String(userStats.completedChapters + 1).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#0a0c10] relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="fixed top-20 left-1/4 w-[500px] h-[500px] bg-[#58a6ff]/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-[400px] h-[400px] bg-[#daa520]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Kanji */}
      <div className="fixed top-1/3 left-4 text-[10rem] font-serif text-[#daa520]/[0.03] select-none pointer-events-none hidden lg:block">
        道
      </div>
      <div className="fixed top-1/3 right-4 text-[10rem] font-serif text-[#daa520]/[0.03] select-none pointer-events-none hidden lg:block">
        場
      </div>

      {/* Header */}
      <div className="container pt-5">
        <div className="flex items-center gap-3 mb-3 pb-3 shadow-[0_1px_0_rgba(255,255,255,0.03)]">
          <div className="p-2.5 bg-[#daa520]/10 rounded-md shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
            <Icons.code className="h-5 w-5 text-[#daa520]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-[#c9d1d9]">
              내 도장
            </h1>
            <p className="text-xs sm:text-sm text-[#8b949e] font-mono">나의 수련 현황</p>
          </div>
        </div>
      </div>

      {/* Hero - Character & XP in 1:2 horizontal layout */}
      <div className="relative shadow-[0_1px_0_rgba(255,255,255,0.03)]">

        <div className="container relative py-3">
          {/* Welcome Message */}
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 sm:h-10 bg-gradient-to-b from-[#daa520] to-[#58a6ff] rounded-full" />
              <div>
                <h2 className="text-base sm:text-xl font-bold text-[#c9d1d9]">
                  <span className="text-[#daa520]">{userStats.displayName}</span> 수련생님, 환영합니다!
                </h2>
                <p className="text-xs sm:text-sm text-[#8b949e] mt-0.5">오늘도 무공을 갈고닦으러 오셨군요</p>
              </div>
            </div>
          </div>

          {/* 1:2 Layout - Character : XP Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Character Card - 1 portion */}
            <div className="relative bg-[#1c2128] p-5 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_rgba(218,165,32,0.1)] transition-all duration-300 group">
              <CharacterDisplay
                initialCharacterId={userStats.characterId}
                displayName={userStats.displayName}
                totalXp={userStats.totalXp}
              />
            </div>

            {/* XP & Belt Progress - 2 portions */}
            <div className="md:col-span-2">
              <BeltProgressCard xp={userStats.totalXp} className="h-full" />
            </div>
          </div>

          {/* Activity Heatmap - GitHub Style */}
          <div className="mt-5 bg-[#1c2128] p-5 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <ActivityHeatmap activities={activityData} />
          </div>
        </div>
      </div>

      {/* Divider with more padding */}
      <div className="container py-6 sm:py-8">
        <div className="h-px w-full bg-[#21262d]" />
      </div>

      <div className="container relative pb-6 sm:pb-8 space-y-10 sm:space-y-12">
        {/* Curriculum Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-8 sm:h-10 bg-gradient-to-b from-[#daa520] to-[#3fb950] rounded-full" />
              <h2 className="text-lg sm:text-xl font-bold text-[#c9d1d9]">수련 과정</h2>
            </div>
            {/* Progress Stats */}
            <div className="flex items-center gap-4 sm:gap-5 ml-4 sm:ml-5">
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-[#daa520] font-mono">{userStats.completedChapters}</span>
                <span className="text-sm sm:text-base text-[#8b949e] font-medium">/{totalChapters}장</span>
                <span className="text-xs sm:text-sm text-[#6e7681] ml-2 font-mono">({progressPercent}%)</span>
              </div>
              <div className="bg-[#0a0c10] h-2.5 sm:h-3 flex-1 max-w-[240px] sm:max-w-[320px] overflow-hidden rounded-full relative ">
                <div
                  className="bg-gradient-to-r from-[#daa520] via-[#e6b82e] to-[#3fb950] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
          <Button asChild size="default" className="rounded-md h-9 sm:h-10 px-4 sm:px-6 text-xs sm:text-sm font-bold bg-[#daa520] hover:bg-[#e6b82e] text-[#0d1117] border-0 transition-all duration-300 w-full sm:w-auto shadow-[0_2px_8px_rgba(218,165,32,0.3)] hover:shadow-[0_4px_16px_rgba(218,165,32,0.4)]">
            <Link href={`/curriculum/${nextChapterId}`}>
              수련하기
              <Icons.swords className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Curriculum List - All 6 parts (2 columns) */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 pt-2">
          {CURRICULUM_DATA.map((part, index) => {
            const completedInPart = Math.min(
              userStats.completedChapters -
                CURRICULUM_DATA.slice(0, part.id - 1).reduce((sum, p) => sum + p.chapters.length, 0),
              part.chapters.length
            );
            const partProgress = Math.max(0, Math.round((completedInPart / part.chapters.length) * 100));
            const isActive = completedInPart >= 0 && completedInPart < part.chapters.length;
            const isCompleted = partProgress === 100;
            const isLocked = completedInPart < 0;

            return (
              <Link
                key={part.id}
                href={`/curriculum?part=${part.id}`}
                className="block group"
              >
                <div className={`relative h-full transition-all duration-300 backdrop-blur-sm p-4 sm:p-6 rounded-md border ${
                  isActive
                    ? 'bg-[#1c2128] border-[#30363d] shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
                    : isCompleted
                      ? 'bg-[#1a1f26] border-[#2d333b] shadow-[0_4px_12px_rgba(0,0,0,0.25)]'
                      : 'bg-[#161b22] border-[#21262d] shadow-[0_4px_12px_rgba(0,0,0,0.2)] opacity-80'
                } hover:shadow-[0_8px_24px_rgba(218,165,32,0.1)] hover:border-[#daa520]/30 hover:-translate-y-0.5`}>

                  {/* Part Number Badge */}
                  <div className={`absolute -top-2 sm:-top-2.5 -left-1.5 sm:-left-2 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md font-mono shadow-[0_2px_6px_rgba(0,0,0,0.4)] ${
                    isActive
                      ? 'bg-[#daa520] text-[#0a0c10]'
                      : isCompleted
                        ? 'bg-[#3fb950] text-[#0a0c10]'
                        : 'bg-[#242b33] text-[#8b949e] border border-[#30363d]/50'
                  }`}>
                    Part {part.id}
                  </div>

                  <div className="flex-1 min-w-0 mt-2 sm:mt-2">
                    <div className="flex items-center gap-1.5 sm:gap-2.5 mb-1.5 sm:mb-2.5 flex-wrap">
                      <h3 className={`font-bold text-sm sm:text-base transition-colors ${
                        isActive
                          ? 'text-[#c9d1d9] group-hover:text-[#daa520]'
                          : isCompleted
                            ? 'text-[#8b949e] group-hover:text-[#c9d1d9]'
                            : 'text-[#484f58] group-hover:text-[#8b949e]'
                      }`}>
                        {part.subtitle.ko}
                      </h3>
                      {isCompleted && (
                        <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 bg-[#3fb950]/15 rounded-md border border-[#3fb950]/20">
                          <Icons.check className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-[#3fb950]" />
                          <span className="text-[8px] sm:text-[10px] text-[#3fb950] font-medium uppercase tracking-wider font-mono">완료</span>
                        </div>
                      )}
                      {isActive && (
                        <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 bg-[#daa520]/15 rounded-md border border-[#daa520]/20">
                          <span className="text-[8px] sm:text-[10px] text-[#daa520] font-medium uppercase tracking-wider font-mono">진행중</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#8b949e] mb-2 sm:mb-3 group-hover:text-[#c9d1d9] transition-colors line-clamp-2">
                      {part.description.ko}
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex-1 h-1.5 bg-[#0a0c10] overflow-hidden rounded-md relative ">
                        <div
                          className={`h-full transition-all ${isCompleted ? 'bg-[#3fb950]' : 'bg-gradient-to-r from-[#daa520] to-[#3fb950]'}`}
                          style={{ width: `${partProgress}%` }}
                        />
                      </div>
                      <span className={`text-xs sm:text-sm font-mono font-bold shrink-0 ${
                        isCompleted ? 'text-[#3fb950]' : isActive ? 'text-[#daa520]' : 'text-[#484f58]'
                      }`}>
                        {Math.max(0, completedInPart)}/{part.chapters.length}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Key Visual Banner */}
        <div className="relative overflow-hidden rounded-md  shadow-[0_4px_12px_rgba(0,0,0,0.3)] group hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]  transition-all duration-500">
          <div className="relative h-44 sm:h-56 md:h-64 bg-[#0a0c10]">
            <Image
              src="/images/bg.jpg"
              alt="VibeDojo Key Visual"
              fill
              className="object-cover object-center opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 saturate-[0.8]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10]/95 via-[#0a0c10]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10]/70 via-transparent to-transparent" />

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 text-6xl sm:text-7xl md:text-8xl font-serif text-[#daa520]/10 select-none group-hover:text-[#daa520]/15 transition-all duration-500">武</div>

            <div className="absolute bottom-5 sm:bottom-7 left-5 sm:left-7">
              <p className="text-[#c9d1d9] text-base sm:text-xl md:text-2xl font-bold mb-2">
                바이브 코딩의 도장, 준비됐나요?
              </p>
              <p className="text-[#8b949e] text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
                AI와 함께 코딩 무술을 익히고 검은띠에 도전하세요
              </p>
              <Button asChild className="rounded-md px-4 py-1.5 bg-[#1c2128]/90 border border-[#30363d]/50 text-[#c9d1d9] text-xs sm:text-sm hover:bg-[#262c36] hover:border-[#484f58]/60 shadow-[0_2px_8px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_12px_rgba(218,165,32,0.2)] hover:scale-105 transition-all duration-300">
                <Link href="/curriculum">
                  수련 과정 보기
                  <Icons.chevronRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative bottom element */}
        <div className="h-1 w-full bg-gradient-to-r from-[#daa520]/20 via-[#daa520]/50 to-[#daa520]/20 rounded-full" />
      </div>
    </div>
  );
}
