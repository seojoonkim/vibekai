"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Zap, Star, Sparkles, ArrowRight, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Belt } from "@/lib/belt-system";
import type { Level, Badge } from "@/lib/gamification";

interface CompletionCelebrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapterTitle: string;
  xpEarned: number;
  difficultyRating: number;
  satisfactionRating: number;
  hasReview: boolean;
  nextChapterId?: string | null;
  isLastChapter?: boolean;
  beltUp?: { from: Belt; to: Belt } | null;
  levelUp?: { from: Level; to: Level } | null;
  newBadges?: Badge[];
  quizPerfect?: boolean;
  quizBonusXp?: number;
}

// Confetti particle component
function Confetti() {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      delay: number;
      color: string;
      size: number;
      rotation: number;
    }>
  >([]);

  useEffect(() => {
    const colors = ["#f0b429", "#c49a4b", "#f7c948", "#8b5a2b", "#ffd700", "#ff6b6b", "#4ecdc4"];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
            top: "-20px",
          }}
        >
          <div
            className="rounded-sm"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// Sparkle effect component
function SparkleEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <Sparkles
          key={i}
          className="absolute text-[#f0b429] animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            width: Math.random() * 16 + 8,
            height: Math.random() * 16 + 8,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

export function CompletionCelebrationModal({
  open,
  onOpenChange,
  chapterTitle,
  xpEarned,
  difficultyRating,
  satisfactionRating,
  hasReview,
  nextChapterId,
  isLastChapter,
  beltUp,
  levelUp,
  newBadges,
  quizPerfect,
  quizBonusXp,
}: CompletionCelebrationModalProps) {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [xpCounter, setXpCounter] = useState(0);

  // Animate XP counter
  useEffect(() => {
    if (!open) {
      setShowContent(false);
      setXpCounter(0);
      return;
    }

    const contentTimer = setTimeout(() => setShowContent(true), 300);

    // Animate XP counting
    const duration = 1500;
    const steps = 30;
    const increment = xpEarned / steps;
    let current = 0;

    const counterTimer = setInterval(() => {
      current += increment;
      if (current >= xpEarned) {
        setXpCounter(xpEarned);
        clearInterval(counterTimer);
      } else {
        setXpCounter(Math.floor(current));
      }
    }, duration / steps);

    return () => {
      clearTimeout(contentTimer);
      clearInterval(counterTimer);
    };
  }, [open, xpEarned]);

  const handleGoToCurriculum = useCallback(() => {
    onOpenChange(false);
    const url = nextChapterId
      ? `/curriculum?scrollTo=${nextChapterId}`
      : "/curriculum";
    router.push(url);
  }, [onOpenChange, router, nextChapterId]);

  const handleGoToNextChapter = useCallback(() => {
    onOpenChange(false);
    router.push(`/curriculum/${nextChapterId}`);
  }, [onOpenChange, router, nextChapterId]);

  const hasBeltUp = beltUp && beltUp.from.id !== beltUp.to.id;
  const hasLevelUp = levelUp && levelUp.from.level !== levelUp.to.level;
  const hasBadges = newBadges && newBadges.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[440px] bg-gradient-to-b from-[#1a120b] via-[#231810] to-[#1a120b] border-[#f0b429]/40 p-0 overflow-hidden"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">수련 완료</DialogTitle>
        {/* Confetti animation */}
        {open && <Confetti />}
        {open && <SparkleEffect />}

        <div className="relative p-6 sm:p-8">
          {/* Trophy with glow effect */}
          <div
            className={cn(
              "flex justify-center mb-6 transition-all duration-700",
              showContent ? "opacity-100 scale-100" : "opacity-0 scale-50"
            )}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#f0b429]/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#f0b429] to-[#8b5a2b] flex items-center justify-center shadow-[0_0_40px_rgba(212,165,90,0.5)]">
                {isLastChapter ? (
                  <Crown className="h-12 w-12 text-[#1a120b]" />
                ) : (
                  <Trophy className="h-12 w-12 text-[#1a120b]" />
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div
            className={cn(
              "text-center mb-6 transition-all duration-700 delay-200",
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f0e6d6] mb-2">
              {isLastChapter ? "커리큘럼 완료!" : "수련 완료!"}
            </h2>
            <p className="text-sm text-[#c4b5a0]">
              {chapterTitle}
            </p>
          </div>

          {/* XP Earned */}
          <div
            className={cn(
              "flex justify-center mb-4 transition-all duration-700 delay-300",
              showContent ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#f0b429]/20 to-[#c49a4b]/10 border border-[#f0b429]/40 rounded-md">
              <Zap className="h-6 w-6 text-[#f0b429] animate-pulse" />
              <span className="text-3xl font-bold text-[#f0b429]">
                +{xpCounter}
              </span>
              <span className="text-lg text-[#c4b5a0]">XP</span>
            </div>
          </div>

          {/* Belt Upgrade */}
          {hasBeltUp && (
            <div
              className={cn(
                "mb-3 p-3 bg-[#0d0906]/50 border border-[#2a1f15] rounded-md text-center transition-all duration-700 delay-[350ms]",
                showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <p className="text-xs text-[#8b7355] mb-1.5">승급!</p>
              <div className="flex items-center justify-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded-full border border-[#3d444d]"
                  style={{ backgroundColor: beltUp!.from.color }}
                />
                <span className="text-sm text-[#c4b5a0]">{beltUp!.from.nameKo}</span>
                <ArrowRight className="h-3 w-3 text-[#8b7355]" />
                <span
                  className="inline-block w-4 h-4 rounded-full border border-[#3d444d]"
                  style={{ backgroundColor: beltUp!.to.color }}
                />
                <span className="text-sm font-medium text-[#f0e6d6]">{beltUp!.to.nameKo}</span>
              </div>
            </div>
          )}

          {/* Level Up */}
          {hasLevelUp && (
            <div
              className={cn(
                "mb-3 p-3 bg-[#0d0906]/50 border border-[#2a1f15] rounded-md text-center transition-all duration-700 delay-[400ms]",
                showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <p className="text-xs text-[#8b7355] mb-1.5">레벨 업!</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-[#c4b5a0]">{levelUp!.from.name.ko}</span>
                <ArrowRight className="h-3 w-3 text-[#8b7355]" />
                <span className="text-sm font-medium text-[#f0e6d6]">{levelUp!.to.name.ko}</span>
              </div>
            </div>
          )}

          {/* New Badges */}
          {hasBadges && (
            <div
              className={cn(
                "mb-3 p-3 bg-[#0d0906]/50 border border-[#2a1f15] rounded-md text-center transition-all duration-700 delay-[450ms]",
                showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <p className="text-xs text-[#8b7355] mb-1.5">배지 획득!</p>
              <div className="flex items-center justify-center gap-3">
                {newBadges!.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-1.5">
                    <span className="text-lg">{badge.icon}</span>
                    <span className="text-sm text-[#f0e6d6]">{badge.name.ko}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings Summary */}
          <div
            className={cn(
              "grid grid-cols-2 gap-4 mb-6 transition-all duration-700 delay-500",
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="bg-[#0d0906]/50 rounded-md p-4 text-center border border-[#2a1f15]">
              <p className="text-xs text-[#8b7355] mb-2">난이도</p>
              <div className="flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= difficultyRating
                        ? "fill-[#f0b429] text-[#f0b429]"
                        : "text-[#3d444d]"
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="bg-[#0d0906]/50 rounded-md p-4 text-center border border-[#2a1f15]">
              <p className="text-xs text-[#8b7355] mb-2">만족도</p>
              <div className="flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= satisfactionRating
                        ? "fill-[#f0b429] text-[#f0b429]"
                        : "text-[#3d444d]"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Review posted notice + Community CTA */}
          {hasReview && (
            <div
              className={cn(
                "mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-center space-y-2 transition-all duration-700 delay-[550ms]",
                showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <p className="text-xs text-emerald-400 flex items-center justify-center gap-2">
                <Sparkles className="h-3 w-3" />
                후기가 커뮤니티에 공유되었습니다
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/community")}
                className="text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
              >
                커뮤니티에서 보기 →
              </Button>
            </div>
          )}

          {/* Quiz perfect bonus notice */}
          {quizPerfect && quizBonusXp && quizBonusXp > 0 && (
            <div
              className={cn(
                "mb-6 p-3 bg-[#f0b429]/10 border border-[#f0b429]/30 rounded-md text-center transition-all duration-700 delay-[550ms]",
                showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <p className="text-xs text-[#f0b429] flex items-center justify-center gap-2">
                <Zap className="h-3 w-3" />
                퀴즈 만점 보너스 +{quizBonusXp} XP!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div
            className={cn(
              "space-y-2 transition-all duration-700 delay-600",
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {/* Primary CTA: Next Chapter (if available and not last) */}
            {nextChapterId && !isLastChapter && (
              <Button
                onClick={handleGoToNextChapter}
                className="w-full h-12 text-base font-bold rounded-md bg-gradient-to-r from-[#f0b429] to-[#c49a4b] hover:from-[#f7c948] hover:to-[#f0b429] text-[#1a120b] shadow-[0_4px_20px_rgba(212,165,90,0.4)] transition-all"
              >
                다음 챕터 시작하기
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            )}
            {/* Secondary CTA: Back to Curriculum */}
            <Button
              onClick={handleGoToCurriculum}
              variant="outline"
              className={cn(
                "w-full h-12 text-base font-bold rounded-md transition-all",
                nextChapterId && !isLastChapter
                  ? "border-[#f0b429]/30 text-[#c4b5a0] hover:bg-[#f0b429]/10 hover:text-[#f0e6d6]"
                  : "bg-gradient-to-r from-[#f0b429] to-[#c49a4b] hover:from-[#f7c948] hover:to-[#f0b429] text-[#1a120b] border-0 shadow-[0_4px_20px_rgba(212,165,90,0.4)]"
              )}
            >
              수련 과정으로 돌아가기
              {(!nextChapterId || isLastChapter) && <ArrowRight className="h-5 w-5 ml-2" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
