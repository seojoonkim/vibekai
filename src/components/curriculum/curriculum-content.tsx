"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { CURRICULUM_DATA } from "@/lib/curriculum-data";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CurriculumContentProps {
  completedChapterIds: string[];
  inProgressChapterId: string | null;
  isLoggedIn: boolean;
  partImages: Record<number, string>;
}

function removeChapterPrefix(title: string): string {
  return title.replace(/^Chapter\s+\d+:\s*/, '');
}

export function CurriculumContent({
  completedChapterIds,
  inProgressChapterId,
  isLoggedIn,
  partImages
}: CurriculumContentProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");

  const getChapterStatus = (chapterId: string) => {
    if (completedChapterIds.includes(chapterId)) return "completed";
    if (inProgressChapterId === chapterId) return "in_progress";

    const allChapters = CURRICULUM_DATA.flatMap(part => part.chapters);
    const chapterIndex = allChapters.findIndex((c) => c.id === chapterId);

    if (chapterIndex === 0 && completedChapterIds.length === 0) return "in_progress";

    if (chapterIndex > 0) {
      const prevChapterId = allChapters[chapterIndex - 1].id;
      if (completedChapterIds.includes(prevChapterId) && !completedChapterIds.includes(chapterId)) {
        return "in_progress";
      }
    }

    return "not_started";
  };

  const handleChapterClick = (e: React.MouseEvent, chapterId: string, isNotStarted: boolean) => {
    if (isNotStarted) {
      return; // 잠긴 챕터는 아무것도 안함
    }

    if (!isLoggedIn) {
      e.preventDefault();
      setSelectedChapterId(chapterId);
      setShowLoginModal(true);
    }
    // 로그인 되어 있으면 Link의 기본 동작(페이지 이동)이 실행됨
  };

  return (
    <>
      {CURRICULUM_DATA.map((part) => {
        const completedInPart = part.chapters.filter(c => completedChapterIds.includes(c.id)).length;
        const partProgress = Math.round((completedInPart / part.chapters.length) * 100);
        const isPartActive = part.chapters.some(c => getChapterStatus(c.id) === "in_progress");
        const isPartComplete = partProgress === 100;

        return (
          <div key={part.id} className="space-y-3 sm:space-y-4">
            {/* Part Header with Image */}
            <div className="relative rounded-md overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.4)] group hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-500">
              <div className="relative aspect-[3/1] sm:aspect-[5/1] overflow-hidden">
                <Image
                  src={partImages[part.id]}
                  alt={part.subtitle.ko}
                  fill
                  className="object-cover object-[center_60%] transition-transform duration-700 group-hover:scale-105 saturate-[0.8]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10]/85 via-[#0a0c10]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10]/70 via-transparent to-transparent" />

                <div className={`absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md backdrop-blur-sm font-mono ${
                  isPartActive
                    ? 'bg-[#f0b429] text-[#0a0c10]'
                    : isPartComplete
                      ? 'bg-[#56d364] text-[#0a0c10]'
                      : 'bg-[#21262d]/90 text-[#8b949e] shadow-[0_2px_6px_rgba(0,0,0,0.3)]'
                }`}>
                  Part {part.id}
                </div>

                {isPartComplete && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#1c2128]/80 backdrop-blur-sm rounded-md shadow-[0_2px_8px_rgba(86,211,100,0.2)]">
                    <Icons.check className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-[#56d364]" />
                    <span className="text-[8px] sm:text-[10px] font-medium text-[#56d364] uppercase tracking-wider font-mono">완료</span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                  <h2 className="text-base sm:text-2xl font-bold text-[#c9d1d9] mb-0.5 sm:mb-1.5">
                    {part.subtitle.ko}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8b949e] mb-2 sm:mb-3 max-w-xl line-clamp-1 sm:line-clamp-none">
                    {part.description.ko}
                  </p>

                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xs sm:text-sm text-[#8b949e] font-mono">{part.chapters.length} Ch</span>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-16 sm:w-28 h-1.5 sm:h-2 bg-[#21262d]/60 overflow-hidden rounded-full backdrop-blur-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${isPartComplete ? 'bg-[#56d364]' : 'bg-gradient-to-r from-[#f0b429] to-[#56d364]'}`}
                          style={{ width: `${partProgress}%` }}
                        />
                      </div>
                      <span className={`text-xs sm:text-sm font-mono font-bold ${
                        isPartComplete ? 'text-[#56d364]' : isPartActive ? 'text-[#f0b429]' : 'text-[#484f58]'
                      }`}>
                        {completedInPart}/{part.chapters.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapters */}
            <div className="grid gap-3 sm:gap-4 pl-0 sm:pl-10">
              {part.chapters.map((chapter) => {
                const status = getChapterStatus(chapter.id);
                const isCompleted = status === "completed";
                const isActive = status === "in_progress";
                const isNotStarted = status === "not_started";

                const ChapterContent = (
                  <div className={`relative transition-all duration-300 overflow-hidden flex group rounded-md ${
                    isActive
                      ? 'bg-[#1c2128] shadow-[0_4px_16px_rgba(240,180,41,0.2),0_4px_16px_rgba(0,0,0,0.4)]'
                      : isCompleted
                        ? 'bg-[#1c2128]/80 shadow-[0_4px_12px_rgba(86,211,100,0.15),0_4px_12px_rgba(0,0,0,0.35)]'
                        : 'bg-[#1c2128]/50 shadow-[0_4px_12px_rgba(0,0,0,0.25)] opacity-50'
                  } ${!isNotStarted ? 'hover:shadow-[0_8px_24px_rgba(240,180,41,0.15)] hover:-translate-y-0.5' : 'cursor-not-allowed'}`}>

                    <div className={`shrink-0 w-14 sm:w-18 flex flex-col items-center justify-center text-center py-3 sm:py-4 ${
                      isActive
                        ? 'bg-[#f0b429]'
                        : isCompleted
                          ? 'bg-[#56d364]'
                          : 'bg-[#21262d]'
                    }`}>
                      {isNotStarted ? (
                        <Icons.lock className="h-4 sm:h-5 w-4 sm:w-5 text-[#484f58]" />
                      ) : (
                        <>
                          <span className={`text-[8px] sm:text-[10px] font-medium uppercase tracking-wider font-mono ${isActive || isCompleted ? 'text-[#0a0c10]/70' : 'text-[#484f58]'}`}>Ch</span>
                          <span className={`text-lg sm:text-2xl font-bold font-mono ${isActive || isCompleted ? 'text-[#0a0c10]' : 'text-[#484f58]'}`}>{chapter.id}</span>
                        </>
                      )}
                    </div>

                    <div className="flex-1 flex items-center gap-2 sm:gap-4 p-2.5 sm:p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2.5 mb-1 sm:mb-2 flex-wrap">
                          <h3 className={`font-bold text-sm sm:text-base transition-colors ${
                            isActive
                              ? 'text-[#c9d1d9] group-hover:text-[#f0b429]'
                              : isCompleted
                                ? 'text-[#8b949e] group-hover:text-[#c9d1d9]'
                                : 'text-[#484f58]'
                          }`}>
                            {removeChapterPrefix(chapter.title.ko)}
                          </h3>
                          <span className={`text-xs sm:text-sm font-mono ${isActive || isCompleted ? 'text-[#8b949e]' : 'text-[#30363d]'}`}>+{chapter.xpReward} XP</span>
                          {isCompleted && (
                            <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 bg-[#56d364]/10 rounded-md shadow-[0_1px_3px_rgba(86,211,100,0.2)]">
                              <Icons.check className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-[#56d364]" />
                              <span className="text-[10px] sm:text-xs font-medium text-[#56d364] uppercase tracking-wider font-mono">완료</span>
                            </div>
                          )}
                          {isActive && (
                            <Badge className="bg-[#f0b429] text-[#0a0c10] border-0 text-[10px] sm:text-xs h-4 sm:h-5 font-medium animate-pulse rounded-md font-mono shadow-[0_2px_6px_rgba(240,180,41,0.3)]">
                              수련 중
                            </Badge>
                          )}
                          {isNotStarted && (
                            <span className="text-[10px] sm:text-xs text-[#484f58] hidden sm:inline">이전 챕터를 먼저 완료하세요</span>
                          )}
                        </div>
                        {chapter.bullets && (
                          <ul className="space-y-1 hidden sm:block">
                            {chapter.bullets.map((bullet, idx) => (
                              <li key={idx} className={`text-sm flex items-start gap-2 ${
                                isActive || isCompleted ? 'text-[#8b949e]' : 'text-[#484f58]'
                              }`}>
                                <span className={`mt-0.5 ${isActive ? 'text-[#f0b429]' : isCompleted ? 'text-[#56d364]' : 'text-[#30363d]'}`}>•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="shrink-0 flex items-center justify-center">
                        {isNotStarted ? (
                          <Icons.lock className="h-4 sm:h-5 w-4 sm:w-5 text-[#30363d]" />
                        ) : (
                          <Icons.chevronRight className={`h-5 sm:h-7 w-5 sm:w-7 transition-all ${
                            isActive
                              ? 'text-[#f0b429] group-hover:translate-x-1'
                              : isCompleted
                                ? 'text-[#56d364] group-hover:translate-x-1'
                                : 'text-[#30363d]'
                          }`} />
                        )}
                      </div>
                    </div>
                  </div>
                );

                if (isNotStarted) {
                  return (
                    <div key={chapter.id} id={`chapter-${chapter.id}`}>
                      {ChapterContent}
                    </div>
                  );
                }

                return (
                  <Link
                    key={chapter.id}
                    id={`chapter-${chapter.id}`}
                    href={`/curriculum/${chapter.id}`}
                    className="group block"
                    onClick={(e) => handleChapterClick(e, chapter.id, isNotStarted)}
                  >
                    {ChapterContent}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Login Required Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="max-w-md bg-[#1c2128] border-0 rounded-md shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#c9d1d9] text-center">
              도장 입문이 필요합니다
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#f0b429]/10 flex items-center justify-center mb-4">
              <Icons.lock className="h-8 w-8 text-[#f0b429]" />
            </div>
            <p className="text-[#8b949e] text-sm">
              챕터 학습을 시작하려면 VibeKai에<br />
              로그인하거나 입문해주세요
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="flex-1 rounded-md h-10 text-sm border-0 text-[#c9d1d9] hover:text-[#e6edf3] bg-[#21262d] hover:bg-[#262c36]"
            >
              <Link href={`/login?redirect=/curriculum/${selectedChapterId}`}>
                로그인
              </Link>
            </Button>
            <Button
              asChild
              className="flex-1 rounded-md h-10 text-sm font-semibold bg-[#f0b429] hover:bg-[#f7c948] text-[#0d1117] border-0"
            >
              <Link href={`/signup?redirect=/curriculum/${selectedChapterId}`}>
                입문하기
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
