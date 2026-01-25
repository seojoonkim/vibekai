"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Medal, Award, Zap, BookOpen, Rocket, Heart, PenLine, Loader2 } from "lucide-react";
import { BeltBadge } from "@/components/gamification/belt-badge";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface LeaderboardUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
}

interface XpBreakdown {
  chapter_complete: number;
  post_created: number;
  showcase_created: number;
  answer_accepted: number;
  like_received: number;
  other: number;
}

interface LeaderboardTabsProps {
  sortedByXP: LeaderboardUser[];
}

function getRankDisplay(rank: number) {
  if (rank === 1) return <Crown className="h-4 w-4 text-[#f0b429]" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-[#8b949e]" />;
  if (rank === 3) return <Award className="h-4 w-4 text-[#da7756]" />;
  return <span className="text-sm font-bold text-[#484f58] font-mono">{rank}</span>;
}

function XpBreakdownInline({ userId }: { userId: string }) {
  const [breakdown, setBreakdown] = useState<XpBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchXpBreakdown() {
      const supabase = createClient();
      const { data } = await supabase
        .from("xp_logs")
        .select("action, amount")
        .eq("user_id", userId);

      if (data) {
        const result: XpBreakdown = {
          chapter_complete: 0,
          post_created: 0,
          showcase_created: 0,
          answer_accepted: 0,
          like_received: 0,
          other: 0,
        };

        data.forEach((log) => {
          switch (log.action) {
            case "chapter_complete":
              result.chapter_complete += log.amount;
              break;
            case "post_created":
            case "comment_created":
              result.post_created += log.amount;
              break;
            case "showcase_created":
              result.showcase_created += log.amount;
              break;
            case "answer_accepted":
              result.answer_accepted += log.amount;
              break;
            case "like_received":
              result.like_received += log.amount;
              break;
            default:
              result.other += log.amount;
          }
        });

        setBreakdown(result);
      }
      setLoading(false);
    }

    fetchXpBreakdown();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center gap-1">
        <Loader2 className="h-3 w-3 animate-spin text-[#8b949e]" />
      </div>
    );
  }

  if (!breakdown) {
    return null;
  }

  const items = [
    { label: "챕터", value: breakdown.chapter_complete, icon: BookOpen, color: "text-[#79c0ff]" },
    { label: "프로젝트", value: breakdown.showcase_created, icon: Rocket, color: "text-[#a371f7]" },
    { label: "채택", value: breakdown.answer_accepted, icon: Award, color: "text-[#56d364]" },
    { label: "글/댓글", value: breakdown.post_created, icon: PenLine, color: "text-[#f0b429]" },
    { label: "좋아요", value: breakdown.like_received, icon: Heart, color: "text-[#f85149]" },
  ].filter(item => item.value > 0);

  if (items.length === 0 && breakdown.other === 0) {
    return (
      <span className="text-xs text-[#6e7681]">-</span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-1 text-xs"
          >
            <Icon className={cn("h-3 w-3", item.color)} />
            <span className="font-mono text-[#f0b429]">+{item.value.toLocaleString()}</span>
          </div>
        );
      })}
      {breakdown.other > 0 && (
        <div className="flex items-center gap-1 text-xs">
          <Zap className="h-3 w-3 text-[#484f58]" />
          <span className="font-mono text-[#f0b429]">+{breakdown.other.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}

function LeaderboardRow({ user, rank }: { user: LeaderboardUser; rank: number }) {
  const isTopThree = rank <= 3;

  return (
    <tr
      className={cn(
        "border-b border-[#21262d] transition-all",
        isTopThree ? "bg-[#1c2128]" : "bg-[#0d1117] hover:bg-[#1c2128]"
      )}
    >
      {/* Rank */}
      <td className="py-3 px-3 w-12">
        <div className="flex items-center justify-center w-6 h-6">
          {getRankDisplay(rank)}
        </div>
      </td>

      {/* User */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <Avatar className={cn(
            "h-8 w-8 shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.3)]",
            rank === 1 ? "ring-2 ring-[#f0b429]/50" :
            rank === 2 ? "ring-2 ring-[#8b949e]/50" :
            rank === 3 ? "ring-2 ring-[#da7756]/50" :
            ""
          )}>
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback className={cn(
              "text-white text-xs font-bold",
              rank === 1 ? "bg-gradient-to-br from-[#f0b429] to-[#a67c37]" :
              rank === 2 ? "bg-gradient-to-br from-[#8b949e] to-[#484f58]" :
              rank === 3 ? "bg-gradient-to-br from-[#da7756] to-[#8b6914]" :
              "bg-gradient-to-br from-[#484f58] to-[#21262d]"
            )}>
              {(user.display_name || user.username).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className={cn(
            "font-medium text-sm truncate",
            rank === 1 ? "text-[#f0b429]" :
            rank === 2 ? "text-[#c9d1d9]" :
            rank === 3 ? "text-[#da7756]" :
            "text-[#c9d1d9]"
          )}>
            {user.display_name || user.username}
          </span>
        </div>
      </td>

      {/* Belt */}
      <td className="py-3 px-3 hidden sm:table-cell">
        <BeltBadge xp={user.total_xp ?? 0} size="sm" />
      </td>

      {/* XP Breakdown */}
      <td className="py-3 px-3 hidden md:table-cell">
        <XpBreakdownInline userId={user.id} />
      </td>

      {/* Total XP */}
      <td className="py-3 px-3 text-right">
        <div className={cn(
          "font-bold text-sm flex items-center justify-end gap-1 font-mono",
          rank === 1 ? "text-[#f0b429]" :
          rank === 2 ? "text-[#8b949e]" :
          rank === 3 ? "text-[#da7756]" :
          "text-[#f0b429]"
        )}>
          <Zap className="h-4 w-4" />
          {(user.total_xp ?? 0).toLocaleString()}
        </div>
      </td>
    </tr>
  );
}

export function LeaderboardTabs({ sortedByXP }: LeaderboardTabsProps) {
  return (
    <div className="bg-[#1c2128] rounded-md overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#21262d] bg-[#0d1117]">
            <th className="py-3 px-3 text-left text-xs font-medium text-[#8b949e] uppercase tracking-wider w-12">순위</th>
            <th className="py-3 px-3 text-left text-xs font-medium text-[#8b949e] uppercase tracking-wider">사용자</th>
            <th className="py-3 px-3 text-left text-xs font-medium text-[#8b949e] uppercase tracking-wider hidden sm:table-cell">등급</th>
            <th className="py-3 px-3 text-left text-xs font-medium text-[#8b949e] uppercase tracking-wider hidden md:table-cell">획득 내역</th>
            <th className="py-3 px-3 text-right text-xs font-medium text-[#8b949e] uppercase tracking-wider">XP</th>
          </tr>
        </thead>
        <tbody>
          {sortedByXP.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-12 text-center text-[#8b949e]">
                아직 등록된 사용자가 없습니다
              </td>
            </tr>
          ) : (
            sortedByXP.map((user, index) => (
              <LeaderboardRow key={user.id} user={user} rank={index + 1} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
