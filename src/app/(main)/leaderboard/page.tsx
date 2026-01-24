import { TrendingUp, Target, BookOpen, Award, Rocket, Heart, PenLine } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface LeaderboardUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
}

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // Fetch users sorted by XP
  const { data: usersByXP, error: xpError } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, total_xp")
    .order("total_xp", { ascending: false })
    .limit(50);

  // Log errors for debugging
  if (xpError) {
    console.error("Error fetching XP leaderboard:", xpError);
  }

  const sortedByXP: LeaderboardUser[] = usersByXP || [];

  return (
    <div className="min-h-screen bg-[#0d1117] relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="fixed top-10 right-20 w-72 h-72 bg-[#f0b429]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-10 left-20 w-80 h-80 bg-[#79c0ff]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Kanji */}
      <div className="fixed top-24 left-8 text-[120px] sm:text-[180px] font-serif text-[#f0b429]/[0.03] pointer-events-none select-none leading-none">
        榮
      </div>
      <div className="fixed bottom-16 right-8 text-[100px] sm:text-[150px] font-serif text-[#f0b429]/[0.03] pointer-events-none select-none leading-none">
        譽
      </div>

      {/* Header */}
      <div className="container pt-5">
        <div className="flex items-center gap-3 mb-3 pb-3 shadow-[0_1px_0_rgba(255,255,255,0.03)]">
          <div className="p-2.5 bg-[#daa520]/10 rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
            <TrendingUp className="h-5 w-5 text-[#daa520]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#c9d1d9]">
              리더보드
            </h1>
            <p className="text-sm text-[#8b949e] font-mono">최고의 바이브 코더들</p>
          </div>
        </div>
      </div>

      <div className="container py-3 sm:py-4 relative z-10">
        <LeaderboardTabs
          sortedByXP={sortedByXP}
        />

        {/* Bottom section - XP 획득 방법 상세 */}
        <div className="bg-[#1c2128] backdrop-blur-sm p-6 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.35)] mt-8">
          <div className="flex items-center gap-2 mb-5">
            <Target className="h-5 w-5 text-[#f0b429]" />
            <h3 className="font-semibold text-base text-[#c9d1d9]">XP 획득 방법</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* 챕터 완료 */}
            <div className="flex flex-col items-center gap-2 p-4 bg-[#0d1117] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(240,180,41,0.1)] transition-all">
              <div className="w-10 h-10 flex items-center justify-center bg-[#79c0ff]/10 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                <BookOpen className="h-5 w-5 text-[#79c0ff]" />
              </div>
              <div className="text-center">
                <p className="text-xs text-[#8b949e]">챕터 완료</p>
                <p className="text-sm font-bold text-[#f0b429] font-mono mt-0.5">+50~250</p>
              </div>
            </div>

            {/* 프로젝트 공유 */}
            <div className="flex flex-col items-center gap-2 p-4 bg-[#0d1117] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(240,180,41,0.1)] transition-all">
              <div className="w-10 h-10 flex items-center justify-center bg-[#a371f7]/10 border border-[#a371f7]/30 rounded-lg">
                <Rocket className="h-5 w-5 text-[#a371f7]" />
              </div>
              <div className="text-center">
                <p className="text-xs text-[#8b949e]">프로젝트 공유</p>
                <p className="text-sm font-bold text-[#f0b429] font-mono mt-0.5">+30</p>
              </div>
            </div>

            {/* 답변 채택 */}
            <div className="flex flex-col items-center gap-2 p-4 bg-[#0d1117] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(240,180,41,0.1)] transition-all">
              <div className="w-10 h-10 flex items-center justify-center bg-[#56d364]/10 border border-[#56d364]/30 rounded-lg">
                <Award className="h-5 w-5 text-[#56d364]" />
              </div>
              <div className="text-center">
                <p className="text-xs text-[#8b949e]">답변 채택</p>
                <p className="text-sm font-bold text-[#f0b429] font-mono mt-0.5">+10</p>
              </div>
            </div>

            {/* 글 작성 */}
            <div className="flex flex-col items-center gap-2 p-4 bg-[#0d1117] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(240,180,41,0.1)] transition-all">
              <div className="w-10 h-10 flex items-center justify-center bg-[#f0b429]/10 border border-[#f0b429]/30 rounded-lg">
                <PenLine className="h-5 w-5 text-[#f0b429]" />
              </div>
              <div className="text-center">
                <p className="text-xs text-[#8b949e]">글/댓글 작성</p>
                <p className="text-sm font-bold text-[#f0b429] font-mono mt-0.5">+3</p>
              </div>
            </div>

            {/* 좋아요 획득 */}
            <div className="flex flex-col items-center gap-2 p-4 bg-[#0d1117] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(240,180,41,0.1)] transition-all">
              <div className="w-10 h-10 flex items-center justify-center bg-[#f85149]/10 border border-[#f85149]/30 rounded-lg">
                <Heart className="h-5 w-5 text-[#f85149]" />
              </div>
              <div className="text-center">
                <p className="text-xs text-[#8b949e]">좋아요 획득</p>
                <p className="text-sm font-bold text-[#f0b429] font-mono mt-0.5">+3</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#6e7681] mt-4 text-center">
            XP를 모아 띠를 승급하고 리더보드에서 순위를 올려보세요!
          </p>
        </div>

        {/* Decorative bottom element */}
        <div className="mt-8">
          <div className="h-1 w-full bg-gradient-to-r from-[#f0b429]/20 via-[#f0b429]/50 to-[#f0b429]/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
