export const revalidate = 60;

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { CURRICULUM_DATA, getAllChapters } from "@/lib/curriculum-data";
import { createClient } from "@/lib/supabase/server";
import { CurriculumScrollHandler } from "@/components/curriculum-scroll-handler";
import { CurriculumContent } from "@/components/curriculum/curriculum-content";

// Part 이미지 매핑
const PART_IMAGES: Record<number, string> = {
  1: "/images/p1.png",
  2: "/images/p2.png",
  3: "/images/p3.png",
  4: "/images/p4.png",
  5: "/images/p5.png",
  6: "/images/p6.png",
};

// "Chapter XX: " 접두사 제거 함수
function removeChapterPrefix(title: string): string {
  return title.replace(/^Chapter\s+\d+:\s*/, '');
}

export default async function CurriculumPage() {
  const supabase = await createClient();

  // Fetch user and their progress
  const { data: { user } } = await supabase.auth.getUser();

  let completedChapterIds: string[] = [];
  let inProgressChapterId: string | null = null;

  if (user) {
    // Fetch user's progress from Supabase
    const { data: progressData } = await supabase
      .from("progress")
      .select("chapter_id, status")
      .eq("user_id", user.id);

    if (progressData) {
      completedChapterIds = progressData
        .filter((p) => p.status === "completed")
        .map((p) => p.chapter_id);

      const inProgressRecord = progressData.find((p) => p.status === "in_progress");
      if (inProgressRecord) {
        inProgressChapterId = inProgressRecord.chapter_id;
      }
    }
  }

  const getChapterStatus = (chapterId: string) => {
    if (completedChapterIds.includes(chapterId)) return "completed";

    // If there's an explicit in_progress chapter, use it
    if (inProgressChapterId === chapterId) return "in_progress";

    // Otherwise, the next chapter after completed ones is in_progress
    const allChapters = getAllChapters();
    const chapterIndex = allChapters.findIndex((c) => c.id === chapterId);

    // First chapter is always accessible if no progress exists
    if (chapterIndex === 0 && completedChapterIds.length === 0) return "in_progress";

    // Check if the previous chapter is completed
    if (chapterIndex > 0) {
      const prevChapterId = allChapters[chapterIndex - 1].id;
      if (completedChapterIds.includes(prevChapterId) && !completedChapterIds.includes(chapterId)) {
        return "in_progress";
      }
    }

    return "not_started";
  };

  const totalChapters = getAllChapters().length;
  const progressPercent = Math.round((completedChapterIds.length / totalChapters) * 100);

  return (
    <div className="min-h-screen bg-[#0a0c10] relative overflow-hidden">
      {/* Scroll handler for navigation from chapter completion */}
      <Suspense fallback={null}>
        <CurriculumScrollHandler />
      </Suspense>

      {/* Subtle ambient glow */}
      <div className="fixed top-20 left-1/4 w-[500px] h-[500px] bg-[#79c0ff]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-[400px] h-[400px] bg-[#f0b429]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Kanji */}
      <div className="fixed top-1/4 left-4 text-[12rem] font-serif text-[#f0b429]/[0.03] select-none pointer-events-none hidden lg:block">
        修
      </div>
      <div className="fixed bottom-1/4 right-4 text-[12rem] font-serif text-[#f0b429]/[0.03] select-none pointer-events-none hidden lg:block">
        練
      </div>

      {/* Header */}
      <div className="container pt-5">
        <div className="flex items-center gap-3 mb-3 pb-3 shadow-[0_1px_0_rgba(255,255,255,0.03)]">
          <div className="p-2.5 bg-[#daa520]/10 rounded-md shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
            <Icons.brain className="h-5 w-5 text-[#daa520]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#c9d1d9]">
              수련 과정
            </h1>
            <p className="text-sm text-[#8b949e] font-mono">바이브코딩의 비기를 전수받으세요</p>
          </div>
        </div>
      </div>

      <div className="container relative py-3 sm:py-4">
        <Tabs defaultValue="all" className="space-y-4">
          {/* Mobile: horizontal scrollable, Desktop: wrapped */}
          <TabsList className="bg-[#1c2128] backdrop-blur-sm rounded-md p-1.5 sm:p-2 h-auto shadow-[0_4px_12px_rgba(0,0,0,0.35)] flex gap-1.5 sm:gap-2 overflow-x-auto sm:flex-wrap scrollbar-hide">
            <TabsTrigger
              value="all"
              className="rounded-md h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-[#f0b429] data-[state=active]:text-[#0a0c10] text-[#8b949e] hover:text-[#c9d1d9] transition-all border-0 shrink-0"
            >
              전체 보기
            </TabsTrigger>
            {CURRICULUM_DATA.map((part) => (
              <TabsTrigger
                key={part.id}
                value={String(part.id)}
                className="rounded-md h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-[#f0b429] data-[state=active]:text-[#0a0c10] text-[#8b949e] hover:text-[#c9d1d9] transition-all border-0 shrink-0"
              >
                Part {part.id}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-10 sm:space-y-12 mt-4">
            <CurriculumContent
              completedChapterIds={completedChapterIds}
              inProgressChapterId={inProgressChapterId}
              isLoggedIn={!!user}
              partImages={PART_IMAGES}
            />
          </TabsContent>

          {CURRICULUM_DATA.map((part) => {
            const completedInPart = part.chapters.filter(c => completedChapterIds.includes(c.id)).length;
            const partProgress = Math.round((completedInPart / part.chapters.length) * 100);
            const isPartActive = part.chapters.some(c => getChapterStatus(c.id) === "in_progress");
            const isPartComplete = partProgress === 100;

            return (
              <TabsContent key={part.id} value={String(part.id)} className="mt-4">
                <div className="space-y-3 sm:space-y-4">
                  {/* Part Header with Image */}
                  <div className="relative rounded-md overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.4)] group hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-500">
                    {/* Background Image */}
                    <div className="relative aspect-[3/1] sm:aspect-[5/1] overflow-hidden">
                      <Image
                        src={PART_IMAGES[part.id]}
                        alt={part.subtitle.ko}
                        fill
                        className="object-cover object-[center_60%] transition-transform duration-700 group-hover:scale-105 saturate-[0.8]"
                      />
                      {/* Gradient Overlays - lighter for better image visibility */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10]/85 via-[#0a0c10]/40 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10]/70 via-transparent to-transparent" />

                      {/* Part Number Badge */}
                      <div className={`absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md backdrop-blur-sm font-mono ${
                        isPartActive
                          ? 'bg-[#f0b429] text-[#0a0c10]'
                          : isPartComplete
                            ? 'bg-[#56d364] text-[#0a0c10]'
                            : 'bg-[#21262d]/90 text-[#8b949e] shadow-[0_2px_6px_rgba(0,0,0,0.3)]'
                      }`}>
                        Part {part.id}
                      </div>

                      {/* Complete Badge */}
                      {isPartComplete && (
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#1c2128]/80 backdrop-blur-sm rounded-md shadow-[0_2px_8px_rgba(86,211,100,0.2)]">
                          <Icons.check className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-[#56d364]" />
                          <span className="text-[8px] sm:text-[10px] font-medium text-[#56d364] uppercase tracking-wider font-mono">완료</span>
                        </div>
                      )}

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                        <h2 className="text-base sm:text-2xl font-bold text-[#c9d1d9] mb-0.5 sm:mb-1.5">
                          {part.subtitle.ko}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#8b949e] mb-2 sm:mb-3 max-w-xl line-clamp-1 sm:line-clamp-none">
                          {part.description.ko}
                        </p>

                        {/* Progress */}
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

                  {/* Chapters Grid */}
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

                          {/* Chapter Number Area */}
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
                              {/* Hide bullets on mobile */}
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
                          <div key={chapter.id} id={`chapter-${chapter.id}-tab`}>
                            {ChapterContent}
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={chapter.id}
                          id={`chapter-${chapter.id}-tab`}
                          href={`/curriculum/${chapter.id}`}
                          className="group block"
                        >
                          {ChapterContent}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Decorative bottom element */}
        <div className="h-1 w-full bg-gradient-to-r from-[#f0b429]/20 via-[#f0b429]/50 to-[#f0b429]/20 rounded-full mt-8" />
      </div>
    </div>
  );
}
