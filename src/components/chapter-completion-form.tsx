"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Loader2, Sparkles, Trophy, Zap, ArrowRight, AlertCircle, CheckSquare, BookCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChapterQuizModal } from "@/components/chapter-quiz-modal";

interface ChapterCompletionFormProps {
  chapterId: string;
  chapterTitle: string;
  xpReward: number;
  onComplete: (data: {
    difficultyRating: number;
    satisfactionRating: number;
    review: string;
    quizPerfect: boolean;
  }) => Promise<void>;
  isSubmitting: boolean;
  isAlreadyCompleted?: boolean;
  savedReviewData?: {
    difficultyRating: number;
    satisfactionRating: number;
    review: string | null;
  } | null;
  // Checklist validation props
  totalCheckboxes?: number;
  checkedCount?: number;
  areAllChecked?: boolean;
  // Next chapter for navigation
  nextChapterId?: string | null;
}

function StarRating({
  value,
  onChange,
  label,
  description,
  readOnly = false,
}: {
  value: number;
  onChange?: (rating: number) => void;
  label: string;
  description: string;
  readOnly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#e6edf3]">{label}</span>
        <span className="text-xs text-[#8b949e]">{description}</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readOnly && onChange?.(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            className={cn(
              "p-1 transition-transform focus:outline-none",
              readOnly ? "cursor-default" : "hover:scale-110"
            )}
            disabled={readOnly}
          >
            <Star
              className={cn(
                "h-7 w-7 transition-colors",
                (hovered || value) >= star
                  ? "fill-[#f0b429] text-[#f0b429]"
                  : "text-[#3d444d] hover:text-[#6e7681]"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChapterCompletionForm({
  chapterId,
  chapterTitle,
  xpReward,
  onComplete,
  isSubmitting,
  isAlreadyCompleted = false,
  savedReviewData,
  totalCheckboxes = 0,
  checkedCount = 0,
  areAllChecked = true,
  nextChapterId,
}: ChapterCompletionFormProps) {
  const router = useRouter();
  const [difficultyRating, setDifficultyRating] = useState(0);
  const [satisfactionRating, setSatisfactionRating] = useState(0);
  const [review, setReview] = useState("");
  const [showChecklistWarning, setShowChecklistWarning] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizPerfect, setQuizPerfect] = useState(false);

  const handleStartCompletion = () => {
    // Check if all checkboxes are completed (if there are any)
    if (totalCheckboxes > 0 && !areAllChecked) {
      setShowChecklistWarning(true);
      return;
    }
    // Show quiz modal first
    setShowQuizModal(true);
  };

  const handleQuizPassed = (isPerfect: boolean) => {
    setQuizPassed(true);
    setQuizPerfect(isPerfect);
  };

  const handleSubmit = () => {
    onComplete({
      difficultyRating,
      satisfactionRating,
      review,
      quizPerfect,
    });
  };

  const canSubmit = difficultyRating > 0 && satisfactionRating > 0;

  // 이미 완료된 챕터인 경우 읽기 전용 모드
  if (isAlreadyCompleted && savedReviewData) {
    return (
      <div className="bg-gradient-to-b from-[#1c2128] to-[#161b22] rounded-md p-6 sm:p-8 space-y-6 shadow-[0_4px_16px_rgba(86,211,100,0.12),0_4px_12px_rgba(0,0,0,0.35)]">
        {/* Header - Completed */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#56d364]/20 to-[#3fb950]/10 shadow-[0_4px_12px_rgba(86,211,100,0.2)] mb-2">
            <Trophy className="h-8 w-8 text-[#56d364]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#e6edf3]">
            수련 완료!
          </h3>
          <p className="text-sm text-[#8b949e]">
            이 챕터를 성공적으로 완료했습니다
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#56d364]/15 shadow-[0_2px_6px_rgba(86,211,100,0.2)]">
            <Zap className="h-4 w-4 text-[#56d364]" />
            <span className="text-sm font-semibold text-[#56d364]">
              +{xpReward} XP 획득 완료
            </span>
          </div>
        </div>

        {/* Saved Rating Section - Read Only */}
        <div className="space-y-5 py-4 border-y border-[#30363d]/50">
          <StarRating
            value={savedReviewData.difficultyRating}
            label="난이도"
            description="1: 매우 쉬움 ~ 5: 매우 어려움"
            readOnly
          />
          <StarRating
            value={savedReviewData.satisfactionRating}
            label="만족도"
            description="1: 불만족 ~ 5: 매우 만족"
            readOnly
          />
        </div>

        {/* Saved Review - Read Only */}
        {savedReviewData.review && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e6edf3]">
              수련 후기
            </label>
            <div className="p-4 bg-[#0a0c10] rounded-md text-sm text-[#c9d1d9] whitespace-pre-wrap shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)]">
              {savedReviewData.review}
            </div>
            <p className="text-xs text-[#8b949e] flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#56d364]" />
              커뮤니티에 공유된 후기입니다
            </p>
          </div>
        )}

        {/* Back to Curriculum Button */}
        <Button
          onClick={() => router.push(nextChapterId ? `/curriculum?scrollTo=${nextChapterId}` : "/curriculum")}
          className="w-full h-14 text-lg font-bold rounded-md bg-gradient-to-r from-[#f0b429] to-[#c49a4b] hover:from-[#f7c948] hover:to-[#f0b429] text-[#1a120b] shadow-[0_4px_20px_rgba(240,180,41,0.4)] transition-all"
        >
          수련 과정으로 돌아가기
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    );
  }

  // 완료되었지만 저장된 리뷰 데이터가 없는 경우 (로딩 중이거나 에러)
  if (isAlreadyCompleted && !savedReviewData) {
    return (
      <div className="bg-gradient-to-b from-[#1c2128] to-[#161b22] rounded-md p-6 sm:p-8 space-y-6 shadow-[0_4px_16px_rgba(86,211,100,0.12),0_4px_12px_rgba(0,0,0,0.35)]">
        {/* Header - Completed */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#56d364]/20 to-[#3fb950]/10 shadow-[0_4px_12px_rgba(86,211,100,0.2)] mb-2">
            <Trophy className="h-8 w-8 text-[#56d364]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#e6edf3]">
            수련 완료!
          </h3>
          <p className="text-sm text-[#8b949e]">
            이 챕터를 성공적으로 완료했습니다
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#56d364]/15 shadow-[0_2px_6px_rgba(86,211,100,0.2)]">
            <Zap className="h-4 w-4 text-[#56d364]" />
            <span className="text-sm font-semibold text-[#56d364]">
              +{xpReward} XP 획득 완료
            </span>
          </div>
        </div>

        {/* Back to Curriculum Button */}
        <Button
          onClick={() => router.push(nextChapterId ? `/curriculum?scrollTo=${nextChapterId}` : "/curriculum")}
          className="w-full h-14 text-lg font-bold rounded-md bg-gradient-to-r from-[#f0b429] to-[#c49a4b] hover:from-[#f7c948] hover:to-[#f0b429] text-[#1a120b] shadow-[0_4px_20px_rgba(240,180,41,0.4)] transition-all"
        >
          수련 과정으로 돌아가기
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    );
  }

  // 아직 완료하지 않은 챕터 - 퀴즈 통과 여부에 따라 다른 UI 표시
  return (
    <>
      <div className="bg-gradient-to-b from-[#1c2128] to-[#161b22] rounded-md p-6 sm:p-8 space-y-6 shadow-[0_4px_16px_rgba(240,180,41,0.12),0_4px_12px_rgba(0,0,0,0.35)]">
        {!quizPassed ? (
          // Step 1: 퀴즈 시작 전 - 퀴즈 시작 버튼 표시
          <>
            {/* Header - Quiz */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 bg-gradient-to-br from-[#f0b429]/20 to-[#c49a4b]/10 shadow-[0_4px_12px_rgba(240,180,41,0.2)]">
                <BookCheck className="h-8 w-8 text-[#f0b429]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#e6edf3]">
                수련을 마치셨습니다!
              </h3>
              <p className="text-sm text-[#8b949e]">
                학습 내용을 점검하는 퀴즈를 풀어보세요
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#f0b429]/15 shadow-[0_2px_6px_rgba(240,180,41,0.2)]">
                <Zap className="h-4 w-4 text-[#f0b429]" />
                <span className="text-sm font-semibold text-[#f0b429]">
                  +{xpReward} XP 획득 예정
                </span>
              </div>
            </div>

            {/* Quiz Info */}
            <div className="bg-[#0a0c10] rounded-md p-4 shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f0b429]/15 flex items-center justify-center">
                  <BookCheck className="h-5 w-5 text-[#f0b429]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#c9d1d9]">학습 점검 퀴즈</p>
                  <p className="text-xs text-[#8b949e]">5문항 모두 정답 시 완료</p>
                </div>
              </div>
            </div>

            {/* Start Quiz Button */}
            <Button
              onClick={handleStartCompletion}
              className="w-full h-12 text-base font-bold rounded-md bg-gradient-to-r from-[#f0b429] to-[#c49a4b] hover:from-[#f7c948] hover:to-[#f0b429] text-[#1a120b] shadow-[0_4px_20px_rgba(240,180,41,0.4)] transition-all"
            >
              <BookCheck className="h-5 w-5 mr-2" />
              퀴즈 시작하기
            </Button>
          </>
        ) : (
          // Step 2: 퀴즈 통과 후 - 리뷰 입력 폼 표시
          <>
            {/* Header - Celebration */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 bg-gradient-to-br from-[#56d364]/20 to-[#3fb950]/10 shadow-[0_4px_12px_rgba(86,211,100,0.2)]">
                <Trophy className="h-8 w-8 text-[#56d364]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#e6edf3]">
                퀴즈 통과!
              </h3>
              <p className="text-sm text-[#8b949e]">
                이번 챕터에 대한 의견을 남겨주세요
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#f0b429]/15 shadow-[0_2px_6px_rgba(240,180,41,0.2)]">
                <Zap className="h-4 w-4 text-[#f0b429]" />
                <span className="text-sm font-semibold text-[#f0b429]">
                  +{xpReward} XP 획득 예정
                </span>
              </div>
            </div>

            {/* Rating Section */}
            <div className="space-y-5 py-4 border-y border-[#30363d]/50">
              <StarRating
                value={difficultyRating}
                onChange={setDifficultyRating}
                label="난이도"
                description="1: 매우 쉬움 ~ 5: 매우 어려움"
              />
              <StarRating
                value={satisfactionRating}
                onChange={setSatisfactionRating}
                label="만족도"
                description="1: 불만족 ~ 5: 매우 만족"
              />
            </div>

            {/* Review Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#e6edf3]">
                수련 후기
              </label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="이번 챕터에서 배운 내용이나 느낀 점을 자유롭게 적어주세요... (입력하지 않으면 기본 완료 메시지가 공유됩니다)"
                className="min-h-[100px] bg-[#161b22] border-0 text-[#e6edf3] placeholder:text-[#6e7681] resize-none shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-[#f0b429]/30"
              />
              <p className="text-xs text-[#8b949e] flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#f0b429]" />
                완료 후기는 커뮤니티 &apos;학습 후기&apos; 게시판에 자동으로 공유됩니다
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={cn(
                "w-full h-12 text-base font-bold rounded-md transition-all",
                canSubmit
                  ? "bg-gradient-to-r from-[#f0b429] to-[#c49a4b] hover:from-[#f7c948] hover:to-[#f0b429] text-[#1a120b] shadow-[0_4px_20px_rgba(240,180,41,0.4)]"
                  : "bg-[#21262d] text-[#6e7681] cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  수련 완료 처리 중...
                </>
              ) : (
                <>
                  <Trophy className="h-5 w-5 mr-2" />
                  수련 완료
                </>
              )}
            </Button>

            {!canSubmit && (
              <p className="text-xs text-center text-[#8b949e]">
                난이도와 만족도를 평가해주세요
              </p>
            )}
          </>
        )}

        {/* Checklist Warning Modal */}
        <Dialog open={showChecklistWarning} onOpenChange={setShowChecklistWarning}>
          <DialogContent className="sm:max-w-[400px] bg-gradient-to-b from-[#1c2128] to-[#161b22] border-0 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-0 overflow-hidden">
            <DialogTitle className="sr-only">체크리스트 미완료</DialogTitle>
            <div className="p-6 sm:p-8">
              {/* Warning Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#f0b429]/15 flex items-center justify-center shadow-[0_4px_12px_rgba(240,180,41,0.2)]">
                  <AlertCircle className="h-8 w-8 text-[#f0b429]" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-[#e6edf3] text-center mb-3">
                체크리스트를 완료해주세요
              </h3>

              {/* Description */}
              <p className="text-sm text-[#8b949e] text-center mb-6">
                학습 컨텐츠의 모든 체크박스를 확인한 후<br />
                수련 완료를 진행해주세요.
              </p>

              {/* Progress */}
              <div className="bg-[#0a0c10] rounded-md p-4 mb-6 shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-[#f0b429]" />
                    <span className="text-sm text-[#c9d1d9]">진행 상황</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-[#f0b429]">
                    {checkedCount} / {totalCheckboxes}
                  </span>
                </div>
                <div className="w-full h-2 bg-[#21262d] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f0b429] to-[#56d364] transition-all duration-300 rounded-full"
                    style={{ width: `${totalCheckboxes > 0 ? (checkedCount / totalCheckboxes) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Button */}
              <Button
                onClick={() => setShowChecklistWarning(false)}
                className="w-full h-12 text-base font-bold rounded-md bg-gradient-to-r from-[#f0b429] to-[#c49a4b] hover:from-[#f7c948] hover:to-[#f0b429] text-[#1a120b] shadow-[0_4px_20px_rgba(240,180,41,0.4)]"
              >
                확인했습니다
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quiz Modal */}
      <ChapterQuizModal
        open={showQuizModal}
        onOpenChange={setShowQuizModal}
        chapterId={chapterId}
        chapterTitle={chapterTitle}
        onQuizPassed={handleQuizPassed}
      />
    </>
  );
}
