"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Loader2,
  Award,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getPartById, getPartChapterIds } from "@/lib/curriculum-data";
import { getBeltByXp } from "@/lib/belt-system";
import type { Belt } from "@/lib/belt-system";
import { calculateLevel, getBadgeById } from "@/lib/gamification";
import type { Level, Badge as GamificationBadge } from "@/lib/gamification";
import { Icons } from "@/components/icons";
import { ChapterQuestionsPanel, TextSelection, Question } from "@/components/chapter-questions-panel";
import { TextSelectionTooltip } from "@/components/text-selection-tooltip";
import { QuestionHighlightOverlay } from "@/components/question-highlight-overlay";
import { ChapterCompletionForm } from "@/components/chapter-completion-form";
import { CompletionCelebrationModal } from "@/components/completion-celebration-modal";
import { ChecklistProvider, useChecklistContext } from "@/components/interactive-checklist";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileLearningNotice } from "@/components/mobile-learning-notice";

interface Chapter {
  id: string;
  title_ko: string;
  title_en: string;
  description_ko: string | null;
  description_en: string | null;
  part: number;
  order_index: number;
  xp_reward: number;
  content_url: string | null;
  content_url_ko: string | null;
}

interface ChapterProgress {
  status: "not_started" | "in_progress" | "completed";
  completed_at: string | null;
}

interface SavedReviewData {
  difficultyRating: number;
  satisfactionRating: number;
  review: string | null;
}

// Interactive checkbox component for markdown checklists
function InteractiveCheckbox({ itemId }: { itemId: string }) {
  const { isChecked, toggleItem, registerCheckbox } = useChecklistContext();
  const isItemChecked = isChecked(itemId);

  // Register this checkbox on mount
  useEffect(() => {
    registerCheckbox(itemId);
  }, [itemId, registerCheckbox]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(itemId);
      }}
      className={cn(
        "inline-flex items-center justify-center w-[18px] h-[18px] rounded border-2 mr-2.5 mt-[5px] shrink-0 cursor-pointer transition-all duration-200",
        isItemChecked
          ? "bg-[#56d364] border-[#56d364]"
          : "border-[#484f58] hover:border-[#8b949e] bg-transparent"
      )}
      aria-checked={isItemChecked}
      role="checkbox"
    >
      <Check
        className={cn(
          "h-3 w-3 text-[#0a0c10] transition-all duration-200",
          isItemChecked ? "opacity-100 scale-100" : "opacity-0 scale-75"
        )}
        strokeWidth={3}
      />
    </button>
  );
}

// Wrapper for list items containing checkboxes
function ChecklistItem({ children, itemId }: { children: React.ReactNode; itemId: string }) {
  const { isChecked } = useChecklistContext();
  const isItemChecked = isChecked(itemId);

  return (
    <li
      className={cn(
        "flex items-start transition-all duration-200 cursor-pointer select-none group",
        isItemChecked && "[&>span]:text-[#8b949e] [&>span]:line-through"
      )}
    >
      {children}
    </li>
  );
}

// Wrapper component that connects checklist state to completion form
function ChecklistAwareCompletionForm({
  chapter,
  chapterTitle,
  completing,
  isCompleted,
  savedReviewData,
  onComplete,
  nextChapterId,
}: {
  chapter: Chapter;
  chapterTitle: string;
  completing: boolean;
  isCompleted: boolean;
  savedReviewData: SavedReviewData | null;
  onComplete: (data: {
    difficultyRating: number;
    satisfactionRating: number;
    review: string;
    quizPerfect: boolean;
  }) => Promise<void>;
  nextChapterId?: string | null;
}) {
  const { getTotalCheckboxes, getCheckedCount, areAllChecked } = useChecklistContext();

  return (
    <ChapterCompletionForm
      chapterId={chapter.id}
      chapterTitle={chapterTitle}
      xpReward={chapter.xp_reward}
      onComplete={onComplete}
      isSubmitting={completing}
      isAlreadyCompleted={isCompleted}
      savedReviewData={savedReviewData}
      totalCheckboxes={getTotalCheckboxes()}
      checkedCount={getCheckedCount()}
      areAllChecked={areAllChecked()}
      nextChapterId={nextChapterId}
    />
  );
}

export default function ChapterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [progress, setProgress] = useState<ChapterProgress | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [markdownTitle, setMarkdownTitle] = useState<string | null>(null);
  const [showQuestionsPanel, setShowQuestionsPanel] = useState(false);
  const [selectedText, setSelectedText] = useState<TextSelection | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [highlightedQuestionId, setHighlightedQuestionId] = useState<string | null>(null);
  const [showSubheader, setShowSubheader] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const checkboxCounterRef = useRef(0);

  // Completion celebration state
  const [showCelebration, setShowCelebration] = useState(false);
  const [completionData, setCompletionData] = useState<{
    difficultyRating: number;
    satisfactionRating: number;
    hasReview: boolean;
    quizPerfect: boolean;
    quizBonusXp: number;
  } | null>(null);
  const [celebrationExtras, setCelebrationExtras] = useState<{
    beltUp: { from: Belt; to: Belt } | null;
    levelUp: { from: Level; to: Level } | null;
    newBadges: GamificationBadge[];
  } | null>(null);

  // Saved review data for completed chapters
  const [savedReviewData, setSavedReviewData] = useState<SavedReviewData | null>(null);

  // Login modal state
  const [showLoginModal, setShowLoginModal] = useState(false);

  const chapterId = params.id as string;

  useEffect(() => {
    async function fetchChapter() {
      const supabase = createClient();
      const formattedId = chapterId.padStart(2, "0");

      const { data: chapterData, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("id", formattedId)
        .single();

      if (error || !chapterData) {
        setLoading(false);
        return;
      }

      setChapter(chapterData);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Show login modal instead of redirecting
        setLoading(false);
        setShowLoginModal(true);
        return;
      }

      if (user) {
        const { data: progressData } = await supabase
          .from("progress")
          .select("status, completed_at")
          .eq("user_id", user.id)
          .eq("chapter_id", chapterData.id)
          .single();

        if (progressData) {
          setProgress(progressData);

          // If completed, fetch saved review data
          if (progressData.status === "completed") {
            // First try to get from chapter_reviews table
            const { data: reviewData } = await supabase
              .from("chapter_reviews")
              .select("difficulty_rating, satisfaction_rating, post_id")
              .eq("user_id", user.id)
              .eq("chapter_id", chapterData.id)
              .single();

            if (reviewData) {
              let reviewText: string | null = null;

              // If there's a linked post, get the review content
              if (reviewData.post_id) {
                const { data: postData } = await supabase
                  .from("posts")
                  .select("content")
                  .eq("id", reviewData.post_id)
                  .single();

                if (postData) {
                  reviewText = postData.content;
                }
              }

              setSavedReviewData({
                difficultyRating: reviewData.difficulty_rating,
                satisfactionRating: reviewData.satisfaction_rating,
                review: reviewText,
              });
            }
          }
        }
      }

      const currentOrder = chapterData.order_index;

      const { data: prevData } = await supabase
        .from("chapters")
        .select("*")
        .eq("order_index", currentOrder - 1)
        .maybeSingle();

      if (prevData) setPrevChapter(prevData);

      const { data: nextData } = await supabase
        .from("chapters")
        .select("*")
        .eq("order_index", currentOrder + 1)
        .maybeSingle();

      if (nextData) setNextChapter(nextData);

      setLoading(false);

      const contentUrl = chapterData.content_url_ko || chapterData.content_url;
      if (contentUrl) {
        setContentLoading(true);
        try {
          const response = await fetch(contentUrl);
          if (response.ok) {
            let text = await response.text();

            // H1 제목 추출 (예: "# Chapter 01: AI 코딩이란?")
            const h1Match = text.match(/^#\s+(.+?)(?:\n|$)/m);
            if (h1Match) {
              setMarkdownTitle(h1Match[1].trim());
              // H1 제거
              text = text.replace(/^#\s+.+?\n+/m, '');
            }

            // "English | 한국어" 언어 선택 라인 제거 (다양한 마크다운 형식 지원)
            text = text.replace(/\[English\]\([^)]+\)\s*\|\s*\*\*한국어\*\*\n*/g, '');
            text = text.replace(/\*\*English\*\*\s*\|\s*\[한국어\]\([^)]+\)\n*/g, '');
            text = text.replace(/\[English\]\([^)]+\)\s*\|\s*한국어\n*/g, '');
            text = text.replace(/English\s*\|\s*\[한국어\]\([^)]+\)\n*/g, '');
            text = text.replace(/English\s*\|\s*한국어\n*/g, '');
            // 언어 선택 라인 뒤의 구분선도 제거
            text = text.replace(/^---\n*/m, '');

            // "다음 단계" 섹션 제거 (다음 챕터 링크가 포함된 섹션)
            // ## 🚀 다음 단계, ## 다음 단계, ## ➡️ 다음 단계 등의 형식 지원
            text = text.replace(/##\s*(?:🚀|➡️|▶️)?\s*다음\s*단계[\s\S]*?(?=##|$)/gi, '');

            setMarkdownContent(text);
          }
        } catch (err) {
          console.error("Failed to fetch markdown content:", err);
        }
        setContentLoading(false);
      }
    }

    fetchChapter();
  }, [chapterId]);

  // 타이틀 영역 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (titleRef.current) {
        const rect = titleRef.current.getBoundingClientRect();
        // 타이틀 영역이 sticky 헤더(메인헤더 56px + 서브헤더 약 44px = 100px) 아래로 완전히 가면 서브헤더 표시
        // 타이틀의 top이 헤더 영역 아래로 가면 서브헤더 표시
        setShowSubheader(rect.top < 56);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기 상태 체크

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleComplete = async (data: {
    difficultyRating: number;
    satisfactionRating: number;
    review: string;
    quizPerfect: boolean;
  }) => {
    if (!chapter || completing) return;

    setCompleting(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCompleting(false);
      return;
    }

    // 1. Update progress
    const { error: progressError } = await supabase.from("progress").upsert(
      {
        user_id: user.id,
        chapter_id: chapter.id,
        status: "completed",
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,chapter_id" }
    );

    if (progressError) {
      console.error("Failed to update progress:", progressError);
      setCompleting(false);
      return;
    }

    // 2. Add XP
    await supabase.from("xp_logs").insert({
      user_id: user.id,
      amount: chapter.xp_reward,
      action: "chapter_complete",
      reference_id: chapter.id,
    });

    await supabase.rpc("increment_xp", {
      user_id: user.id,
      amount: chapter.xp_reward,
    });

    // 2a. Quiz perfect bonus XP (20) with dedupe
    let quizBonusAwarded = false;
    if (data.quizPerfect) {
      const { count } = await supabase
        .from("xp_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("action", "quiz_perfect")
        .eq("reference_id", chapter.id);

      if (count === 0) {
        await supabase.from("xp_logs").insert({
          user_id: user.id,
          amount: 20,
          action: "quiz_perfect",
          reference_id: chapter.id,
        });
        await supabase.rpc("increment_xp", {
          user_id: user.id,
          amount: 20,
        });
        quizBonusAwarded = true;
      }
    }

    // 2b. Detect belt/level/badge changes
    const { data: profileData } = await supabase
      .from("profiles")
      .select("total_xp")
      .eq("id", user.id)
      .single();

    const newTotalXp = profileData?.total_xp ?? 0;
    const totalXpAwarded = chapter.xp_reward + (quizBonusAwarded ? 20 : 0);
    const oldTotalXp = newTotalXp - totalXpAwarded;

    const oldBelt = getBeltByXp(oldTotalXp);
    const newBelt = getBeltByXp(newTotalXp);
    const beltUpResult = oldBelt.id !== newBelt.id ? { from: oldBelt, to: newBelt } : null;

    const oldLevel = calculateLevel(oldTotalXp);
    const newLevel = calculateLevel(newTotalXp);
    const levelUpResult = oldLevel.level !== newLevel.level ? { from: oldLevel, to: newLevel } : null;

    // Check badge eligibility
    const earnedBadges: GamificationBadge[] = [];
    const chapterNumForBadge = parseInt(chapter.id, 10);

    // first-chapter: first ever chapter completed
    const { count: totalCompleted } = await supabase
      .from("progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "completed");

    if (totalCompleted === 1) {
      const badge = getBadgeById("first-chapter");
      if (badge) earnedBadges.push(badge);
    }

    // Part completion badges
    const partChapterIds = getPartChapterIds(chapter.part);
    if (partChapterIds.length > 0) {
      const { count: partCompleted } = await supabase
        .from("progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "completed")
        .in("chapter_id", partChapterIds);

      if (partCompleted === partChapterIds.length) {
        if (chapter.part === 1) {
          const badge = getBadgeById("part-1-complete");
          if (badge) earnedBadges.push(badge);
        }
        if (chapter.part === 6) {
          const badge = getBadgeById("web3-pioneer");
          if (badge) earnedBadges.push(badge);
        }
      }
    }

    // full-curriculum badge
    if (chapterNumForBadge === 30 && totalCompleted === 30) {
      const badge = getBadgeById("full-curriculum");
      if (badge) earnedBadges.push(badge);
    }

    // Insert earned badges
    for (const badge of earnedBadges) {
      await supabase.from("user_badges").upsert(
        { user_id: user.id, badge_id: badge.id },
        { onConflict: "user_id,badge_id" }
      );
    }

    setCelebrationExtras({ beltUp: beltUpResult, levelUp: levelUpResult, newBadges: earnedBadges });

    // 3. Post completion to community (with review or default message)
    let postId: string | null = null;
    const reviewContent = data.review.trim() || `${markdownTitle || chapter.title_ko} 챕터를 완료했습니다! 🎉`;

    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        author_id: user.id,
        type: "review",
        title: `학습 후기 - ${markdownTitle || chapter.title_ko}`,
        content: reviewContent,
        chapter_id: chapter.id,
        difficulty_rating: data.difficultyRating,
        satisfaction_rating: data.satisfactionRating,
      })
      .select("id")
      .single();

    if (postError) {
      console.error("Failed to create review post:", postError.message, postError.code, postError.details, postError.hint);
    } else if (postData) {
      postId = postData.id;
    }

    // 4. Save chapter review (ratings)
    await supabase.from("chapter_reviews").upsert(
      {
        user_id: user.id,
        chapter_id: chapter.id,
        difficulty_rating: data.difficultyRating,
        satisfaction_rating: data.satisfactionRating,
        post_id: postId,
      },
      { onConflict: "user_id,chapter_id" }
    );

    // 5. Create web notifications (fire-and-forget)
    fetch("/api/notifications/create-completion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapterTitle: markdownTitle || chapter.title_ko,
        chapterId: chapter.id,
        xpEarned: chapter.xp_reward,
        beltUp: beltUpResult,
        levelUp: levelUpResult,
        newBadges: earnedBadges,
      }),
    }).catch(() => {});

    // 6. Notify Discord bot (fire-and-forget)
    const chapterNum = parseInt(chapter.id, 10);
    fetch("/api/discord/notify-chapter-complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapter_num: chapterNum,
        chapter_title: markdownTitle || chapter.title_ko,
        unlocked_chapter: chapterNum < 30 ? chapterNum + 1 : undefined,
        part_complete: nextChapter ? nextChapter.part !== chapter.part : chapterNum === 30,
        total_progress: chapterNum,
        xp_reward: chapter.xp_reward,
      }),
    }).catch(() => {/* fire-and-forget */});

    // 7. Update streak (fire-and-forget)
    fetch("/api/streak", { method: "POST" }).catch(() => {});

    setProgress({ status: "completed", completed_at: new Date().toISOString() });
    setCompletionData({
      difficultyRating: data.difficultyRating,
      satisfactionRating: data.satisfactionRating,
      hasReview: !!data.review.trim(),
      quizPerfect: data.quizPerfect,
      quizBonusXp: quizBonusAwarded ? 20 : 0,
    });
    setCompleting(false);
    setShowCelebration(true);
  };

  const handleAskQuestion = useCallback((selection: TextSelection) => {
    setSelectedText(selection);
    setShowQuestionsPanel(true);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedText(null);
  }, []);

  // 하이라이트된 텍스트에 추가 질문하기
  const handleAddQuestionToText = useCallback((text: string) => {
    setSelectedText({
      text,
      contextBefore: "",
      contextAfter: "",
    });
    setShowQuestionsPanel(true);
  }, []);

  const handleQuestionClick = useCallback((questionId: string) => {
    setShowQuestionsPanel(true);
    setHighlightedQuestionId(questionId);
    // 3초 후 하이라이트 해제
    setTimeout(() => setHighlightedQuestionId(null), 3000);
  }, []);

  // 본문 내 텍스트로 스크롤하고 하이라이트하는 함수
  const handleScrollToText = useCallback((searchText: string) => {
    const container = document.querySelector(".curriculum-content");
    if (!container) return;

    // TreeWalker로 텍스트 노드 찾기
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node: Text | null;
    let foundRange: Range | null = null;

    // 단일 노드에서 찾기
    while ((node = walker.nextNode() as Text | null)) {
      const text = node.textContent || "";
      const index = text.indexOf(searchText);
      if (index !== -1) {
        foundRange = document.createRange();
        foundRange.setStart(node, index);
        foundRange.setEnd(node, index + searchText.length);
        break;
      }
    }

    // 여러 노드에 걸친 텍스트 찾기 (못 찾은 경우)
    if (!foundRange) {
      const fullText = container.textContent || "";
      const searchIndex = fullText.indexOf(searchText);
      if (searchIndex === -1) return;

      let currentIndex = 0;
      let startNode: Text | null = null;
      let startOffset = 0;
      let endNode: Text | null = null;
      let endOffset = 0;

      const walker2 = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null
      );

      while ((node = walker2.nextNode() as Text | null)) {
        const nodeLength = node.textContent?.length || 0;
        const nodeStart = currentIndex;
        const nodeEnd = currentIndex + nodeLength;

        if (!startNode && searchIndex >= nodeStart && searchIndex < nodeEnd) {
          startNode = node;
          startOffset = searchIndex - nodeStart;
        }

        const searchEnd = searchIndex + searchText.length;
        if (startNode && searchEnd > nodeStart && searchEnd <= nodeEnd) {
          endNode = node;
          endOffset = searchEnd - nodeStart;
          break;
        }

        currentIndex = nodeEnd;
      }

      if (startNode && endNode) {
        foundRange = document.createRange();
        foundRange.setStart(startNode, startOffset);
        foundRange.setEnd(endNode, endOffset);
      }
    }

    if (!foundRange) return;

    // 하이라이트 span 만들기
    const highlightSpan = document.createElement("span");
    highlightSpan.className = "text-highlight-animation";

    try {
      foundRange.surroundContents(highlightSpan);
    } catch {
      // surroundContents가 실패할 수 있음 (여러 노드에 걸친 경우)
      // 이 경우 첫 번째 rect로만 스크롤
      const rects = foundRange.getClientRects();
      if (rects.length > 0) {
        const rect = rects[0];
        window.scrollTo({
          top: window.scrollY + rect.top - window.innerHeight / 3,
          behavior: "smooth",
        });
      }
      return;
    }

    // 해당 위치로 부드럽게 스크롤
    highlightSpan.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // 5초 후 하이라이트 제거 (span 언래핑)
    setTimeout(() => {
      const parent = highlightSpan.parentNode;
      if (parent) {
        while (highlightSpan.firstChild) {
          parent.insertBefore(highlightSpan.firstChild, highlightSpan);
        }
        parent.removeChild(highlightSpan);
      }
    }, 5000);
  }, []);

  // Show mobile notice on small screens
  if (isMobile) {
    return <MobileLearningNotice chapterTitle={chapter?.title_ko || markdownTitle || undefined} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#f0b429]" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <Card className="max-w-sm mx-auto bg-[#151a21] border-0 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
          <CardContent className="py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-[#21262d] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-7 w-7 text-[#8b949e]" />
            </div>
            <h2 className="text-lg font-bold mb-2 text-[#c9d1d9]">챕터를 찾을 수 없습니다</h2>
            <p className="text-[#8b949e] text-sm mb-5">
              요청하신 챕터가 존재하지 않습니다.
            </p>
            <Button asChild className="rounded-md h-10 px-5 text-sm bg-[#f0b429] hover:bg-[#f7c948] text-[#0a0c10] border-0">
              <Link href="/curriculum">수련 과정으로 돌아가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCompleted = progress?.status === "completed";
  const partInfo = getPartById(chapter.part);

  return (
    <div className="min-h-screen bg-[#0a0c10]">
      {/* Text Selection Tooltip */}
      <TextSelectionTooltip
        containerSelector=".curriculum-content"
        onAskQuestion={handleAskQuestion}
      />

      {/* Question Highlight Overlay */}
      {markdownContent && questions.length > 0 && (
        <QuestionHighlightOverlay
          containerSelector=".curriculum-content"
          questions={questions}
          onQuestionClick={handleQuestionClick}
          onAddQuestion={handleAddQuestionToText}
        />
      )}

      {/* Sticky Header - Single line (스크롤 시에만 나타남) */}
      <div
        className={`bg-[#161b22]/95 shadow-[0_2px_8px_rgba(0,0,0,0.3)] sticky top-14 z-40 backdrop-blur-lg transition-all duration-300 ease-out ${
          showSubheader
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="container py-2.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/curriculum"
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[#21262d] transition-colors shrink-0"
              >
                <ArrowLeft className="h-4 w-4 text-[#8b949e]" />
              </Link>
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <h1 className="text-sm font-medium text-[#c9d1d9] truncate">
                  {markdownTitle || chapter.title_ko}
                </h1>
                {isCompleted && (
                  <CheckCircle className="h-4 w-4 text-[#56d364] shrink-0" />
                )}
              </div>
            </div>

            {isCompleted ? (
              <div className="flex items-center gap-2 text-sm shrink-0">
                <span className="font-medium text-[#8b949e]">+{chapter.xp_reward} XP</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-[#56d364] flex items-center justify-center">
                    <CheckCircle className="h-2.5 w-2.5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-[#56d364]">Completed</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm shrink-0">
                <Award className="h-4 w-4 text-[#f0b429]" />
                <span className="font-semibold text-[#f0b429]">{chapter.xp_reward} XP</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-4 px-3 sm:px-4 lg:px-6">
        {/* Chapter Info - Non-sticky */}
        <div ref={titleRef} className="mb-4 max-w-7xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/curriculum"
              className="inline-flex items-center gap-1.5 text-sm text-[#79c0ff] hover:text-[#79b8ff] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>수련 과정으로 돌아가기</span>
            </Link>
          </div>

          {/* Part Info */}
          {partInfo && (
            <div className="mb-2">
              <span className="text-base sm:text-lg text-[#8b949e]">
                Part {chapter.part}. {partInfo.subtitle.ko} - {partInfo.description.ko}
              </span>
            </div>
          )}

          {/* Title */}
          <div className="flex items-center justify-between gap-4 py-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#c9d1d9]">{markdownTitle || chapter.title_ko}</h2>
            {isCompleted ? (
              <div className="flex items-center gap-2 shrink-0 px-3 py-1.5 bg-[#56d364]/15 rounded-md shadow-[0_2px_6px_rgba(86,211,100,0.2)]">
                <CheckCircle className="h-4 w-4 text-[#56d364]" />
                <span className="text-sm font-medium text-[#56d364]">완료</span>
                <span className="text-sm text-[#56d364]/70">+{chapter.xp_reward} XP</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 bg-[#f0b429]/15 rounded-md shadow-[0_2px_6px_rgba(240,180,41,0.2)]">
                <span className="text-sm font-medium text-[#f0b429]">{chapter.xp_reward} XP</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 max-w-7xl mx-auto">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0 transition-all duration-300">
            <ChecklistProvider chapterId={chapterId}>
              {/* Content */}
              <Card className="mb-5 bg-[#151a21] border-0 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.35)] overflow-hidden py-0 gap-0">
                <CardContent className="p-4 sm:p-5 md:p-6 curriculum-content">
                  {contentLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-[#79c0ff] mb-3" />
                      <span className="text-sm text-[#8b949e]">콘텐츠 로딩 중...</span>
                    </div>
                  ) : markdownContent ? (
                    (() => {
                      // Reset checkbox counter before rendering
                      checkboxCounterRef.current = 0;
                      return (
                        <div className="prose prose-invert max-w-none [&>*:first-child]:mt-0 prose-headings:text-[#c9d1d9] prose-p:text-[#c9d1d9] prose-strong:text-[#c9d1d9] prose-a:text-[#79c0ff] prose-code:text-[#f0883e] prose-code:bg-[#21262d] prose-pre:bg-[#0a0c10] prose-pre:border prose-pre:border-[#30363d] prose-blockquote:border-l-[#30363d] prose-blockquote:text-[#8b949e] prose-li:text-[#c9d1d9]">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                              // Transform cross-chapter relative links to webapp routes
                              a: ({ href, children, ...props }) => {
                                if (href) {
                                  // Match ../ChapterXX-*/README.ko.md or ../ChapterXX-*/README.md
                                  const chapterMatch = href.match(/\.\.\/Chapter(\d+)-[^/]+\/README(?:\.ko)?\.md/);
                                  if (chapterMatch) {
                                    const chapterNum = parseInt(chapterMatch[1], 10).toString().padStart(2, "0");
                                    return (
                                      <Link href={`/curriculum/${chapterNum}`} {...props}>
                                        {children}
                                      </Link>
                                    );
                                  }
                                }
                                return <a href={href} {...props}>{children}</a>;
                              },
                              // Custom checkbox input for task lists
                              input: ({ type, checked, ...props }) => {
                                if (type === "checkbox") {
                                  // Generate a unique sequential ID
                                  const itemId = `item-${checkboxCounterRef.current++}`;
                                  return <InteractiveCheckbox itemId={itemId} />;
                                }
                                return <input type={type} {...props} />;
                              },
                              // Style list items containing checkboxes
                              li: ({ children, className, ...props }) => {
                                // Check if this is a task list item (contains checkbox)
                                const hasCheckbox = className?.includes("task-list-item");
                                if (hasCheckbox) {
                                  // Note: The itemId is already assigned in the input component
                                  // We just need to apply the styling based on checked state
                                  return (
                                    <li className={cn(className, "flex items-start transition-all duration-200 cursor-pointer select-none group")} {...props}>
                                      {children}
                                    </li>
                                  );
                                }
                                return <li className={className} {...props}>{children}</li>;
                              },
                            }}
                          >
                            {markdownContent}
                          </ReactMarkdown>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-14 h-14 rounded-full bg-[#21262d] flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-7 w-7 text-[#8b949e]" />
                      </div>
                      <p className="text-[#c9d1d9] text-sm mb-2">{chapter.description_ko}</p>
                      <p className="text-xs text-[#8b949e]">
                        학습 자료가 준비 중입니다.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chapter Completion Form - 항상 표시 */}
              <div className="mb-5">
                <ChecklistAwareCompletionForm
                  chapter={chapter}
                  chapterTitle={markdownTitle || chapter.title_ko}
                  completing={completing}
                  isCompleted={isCompleted}
                  savedReviewData={savedReviewData}
                  onComplete={handleComplete}
                  nextChapterId={nextChapter?.id}
                />
              </div>
            </ChecklistProvider>

            {/* Mobile Questions Panel Toggle */}
            <div className="lg:hidden mt-4">
              <Button
                variant="outline"
                className="w-full rounded-md h-11 bg-[#151a21] border-0 shadow-[0_4px_12px_rgba(0,0,0,0.35)] hover:bg-[#21262d] hover:shadow-[0_6px_16px_rgba(0,0,0,0.45)] text-[#c9d1d9]"
                onClick={() => setShowQuestionsPanel(!showQuestionsPanel)}
              >
                <MessageSquare className="h-4 w-4 mr-2 text-[#8b949e]" />
                질문 & 토론
                {questions.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-[#30363d] text-[#8b949e] text-xs rounded">
                    {questions.length}
                  </span>
                )}
                {showQuestionsPanel ? (
                  <ChevronRight className="h-4 w-4 ml-auto text-[#8b949e]" />
                ) : (
                  <ChevronLeft className="h-4 w-4 ml-auto text-[#8b949e]" />
                )}
              </Button>
            </div>
          </div>

          {/* Questions Panel - Collapsible */}
          <div className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-32 max-h-[calc(100vh-9rem)] flex flex-col">
              <div className={`bg-[#151a21] border-0 shadow-[0_4px_12px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col transition-all duration-300 rounded-md`}>
                {/* Toggle Bar - Top */}
                <button
                  onClick={() => setShowQuestionsPanel(!showQuestionsPanel)}
                  className="flex items-center justify-between px-4 py-3 bg-[#161b22] hover:bg-[#21262d] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[#79c0ff]" />
                    <span className="text-sm font-medium text-[#c9d1d9]">
                      질문 & 토론
                    </span>
                    <span className="text-xs text-[#8b949e]">({questions.length})</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-[#8b949e] group-hover:text-[#c9d1d9] transition-transform duration-300 ${
                    showQuestionsPanel ? "rotate-90" : "-rotate-90"
                  }`} />
                </button>

                {/* Panel Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showQuestionsPanel ? "flex-1 opacity-100" : "h-0 opacity-0"
                  }`}
                >
                  <div className="h-px bg-[#30363d]/50" />
                  <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
                    <ChapterQuestionsPanel
                      chapterId={chapterId}
                      selectedText={selectedText}
                      onClearSelection={handleClearSelection}
                      questions={questions}
                      onQuestionsChange={setQuestions}
                      highlightedQuestionId={highlightedQuestionId}
                      hideHeader
                      onScrollToText={handleScrollToText}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Questions Panel (Expandable) */}
        {showQuestionsPanel && (
          <div className="lg:hidden mt-4 max-w-7xl mx-auto">
            <Card className="bg-[#151a21] border-0 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.35)] overflow-hidden py-0">
              <CardContent className="p-4">
                <ChapterQuestionsPanel
                  chapterId={chapterId}
                  selectedText={selectedText}
                  onClearSelection={handleClearSelection}
                  questions={questions}
                  onQuestionsChange={setQuestions}
                  highlightedQuestionId={highlightedQuestionId}
                  onScrollToText={handleScrollToText}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Completion Celebration Modal */}
      {completionData && (
        <CompletionCelebrationModal
          open={showCelebration}
          onOpenChange={setShowCelebration}
          chapterTitle={markdownTitle || chapter.title_ko}
          xpEarned={chapter.xp_reward + completionData.quizBonusXp}
          difficultyRating={completionData.difficultyRating}
          satisfactionRating={completionData.satisfactionRating}
          hasReview={completionData.hasReview}
          quizPerfect={completionData.quizPerfect}
          quizBonusXp={completionData.quizBonusXp}
          nextChapterId={nextChapter?.id}
          isLastChapter={chapter.id === "30"}
          beltUp={celebrationExtras?.beltUp}
          levelUp={celebrationExtras?.levelUp}
          newBadges={celebrationExtras?.newBadges}
        />
      )}

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
              <Link href={`/login?redirect=/curriculum/${chapterId}`}>
                로그인
              </Link>
            </Button>
            <Button
              asChild
              className="flex-1 rounded-md h-10 text-sm font-semibold bg-[#f0b429] hover:bg-[#f7c948] text-[#0d1117] border-0"
            >
              <Link href={`/signup?redirect=/curriculum/${chapterId}`}>
                입문하기
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
