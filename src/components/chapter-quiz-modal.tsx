"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle,
  XCircle,
  BookOpen,
  Trophy,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// Confetti particle component (shared with completion-celebration-modal)
function QuizConfetti() {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; delay: number; color: string; size: number; rotation: number }>
  >([]);

  useEffect(() => {
    const colors = ["#f0b429", "#56d364", "#f7c948", "#3fb950", "#ffd700", "#4ecdc4"];
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{ left: `${p.x}%`, animationDelay: `${p.delay}s`, top: "-20px" }}
        >
          <div
            className="rounded-sm"
            style={{ width: p.size, height: p.size, backgroundColor: p.color, transform: `rotate(${p.rotation}deg)` }}
          />
        </div>
      ))}
    </div>
  );
}

interface QuizQuestion {
  id: string;
  question_ko: string;
  options: Array<{ ko: string }>;
  correct_answer: number;
  explanation_ko?: string;
}

interface ChapterQuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapterId: string;
  chapterTitle: string;
  onQuizPassed: (isPerfect: boolean) => void;
}

interface UserAnswer {
  questionId: string;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
}

export function ChapterQuizModal({
  open,
  onOpenChange,
  chapterId,
  chapterTitle,
  onQuizPassed,
}: ChapterQuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [correctPulse, setCorrectPulse] = useState(false);

  // Fetch quiz questions
  useEffect(() => {
    if (!open) return;

    async function fetchQuizzes() {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("chapter_quizzes")
        .select("id, question_ko, options, correct_answer, explanation_ko")
        .eq("chapter_id", chapterId)
        .order("order_index");

      if (error) {
        console.error("Failed to fetch quizzes:", error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setQuestions(data);
        setUserAnswers(data.map(q => ({
          questionId: q.id,
          selectedAnswer: null,
          isCorrect: null,
        })));
      }
      setLoading(false);
    }

    fetchQuizzes();
  }, [open, chapterId]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
      setShowResult(false);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  }, [open]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const correctCount = userAnswers.filter(a => a.isCorrect === true).length;
  const allAnswered = userAnswers.every(a => a.selectedAnswer !== null);
  const isPassed = correctCount === totalQuestions && totalQuestions > 0;

  const handleSelectOption = useCallback((optionIndex: number) => {
    if (showExplanation) return; // Already answered
    setSelectedOption(optionIndex);
  }, [showExplanation]);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption === null || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correct_answer;

    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentIndex] = {
        questionId: currentQuestion.id,
        selectedAnswer: selectedOption,
        isCorrect,
      };
      return newAnswers;
    });

    setShowExplanation(true);

    // Trigger subtle pulse animation on correct answer
    if (isCorrect) {
      setCorrectPulse(true);
      setTimeout(() => setCorrectPulse(false), 300);
    }
  }, [selectedOption, currentQuestion, currentIndex]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Check if all answered correctly for confetti
      const finalCorrect = userAnswers.filter(a => a.isCorrect === true).length;
      if (finalCorrect === totalQuestions && totalQuestions > 0) {
        setShowConfetti(true);
      }
      setShowResult(true);
    }
  }, [currentIndex, totalQuestions, userAnswers]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setShowResult(false);
    setSelectedOption(null);
    setShowExplanation(false);
    setShowConfetti(false);
    setCorrectPulse(false);
    setUserAnswers(questions.map(q => ({
      questionId: q.id,
      selectedAnswer: null,
      isCorrect: null,
    })));
  }, [questions]);

  const handlePass = useCallback(async () => {
    // Save quiz attempt to database
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("quiz_attempts").upsert({
        user_id: user.id,
        chapter_id: chapterId,
        score: correctCount,
        passed: true,
        answers: userAnswers.map(a => ({
          question_id: a.questionId,
          selected_answer: a.selectedAnswer,
          is_correct: a.isCorrect,
        })),
      }, { onConflict: "user_id,chapter_id" });
    }

    onOpenChange(false);
    onQuizPassed(isPassed);
  }, [chapterId, correctCount, isPassed, userAnswers, onOpenChange, onQuizPassed]);

  // Loading state
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-[#1c2128] to-[#161b22] border-0 p-0 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <DialogTitle className="sr-only">퀴즈 로딩 중</DialogTitle>
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#f0b429] mb-4" />
            <p className="text-sm text-[#8b949e]">퀴즈 로딩 중...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // No quiz available
  if (questions.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-[#1c2128] to-[#161b22] border-0 p-0 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <DialogTitle className="sr-only">퀴즈 없음</DialogTitle>
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#f0b429]/15 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-[#f0b429]" />
              </div>
              <h3 className="text-xl font-bold text-[#e6edf3] mb-2">
                퀴즈 준비 중
              </h3>
              <p className="text-sm text-[#8b949e] mb-6">
                이 챕터의 퀴즈는 아직 준비 중입니다.<br />
                바로 완료 단계로 진행하세요.
              </p>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onQuizPassed(false);
                }}
                className="w-full h-12 text-base font-bold rounded-md bg-gradient-to-r from-[#f0b429] to-[#c49a4b] hover:from-[#f7c948] hover:to-[#f0b429] text-[#1a120b] shadow-[0_4px_20px_rgba(240,180,41,0.4)]"
              >
                계속하기
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Result screen
  if (showResult) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-[#1c2128] to-[#161b22] border-0 p-0 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <DialogTitle className="sr-only">퀴즈 결과</DialogTitle>
          {showConfetti && <QuizConfetti />}
          <div className="p-6 sm:p-8 relative">
            {isPassed ? (
              // Passed - all correct
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#56d364]/30 rounded-full blur-2xl animate-pulse" />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#56d364] to-[#3fb950] flex items-center justify-center shadow-[0_0_30px_rgba(86,211,100,0.4)]">
                      <Trophy className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-[#e6edf3] mb-2">
                  축하합니다!
                </h3>
                <p className="text-sm text-[#8b949e] mb-2">
                  모든 문제를 맞혔습니다
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#56d364]/15 rounded-md mb-3">
                  <Sparkles className="h-4 w-4 text-[#56d364]" />
                  <span className="text-lg font-bold text-[#56d364]">
                    {correctCount} / {totalQuestions}
                  </span>
                </div>

                {/* Bonus XP indicator */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f0b429]/15 rounded-md mb-6 ml-2">
                  <Zap className="h-4 w-4 text-[#f0b429]" />
                  <span className="text-sm font-bold text-[#f0b429]">+20 보너스 XP</span>
                </div>

                <Button
                  onClick={handlePass}
                  className="w-full h-12 text-base font-bold rounded-md bg-gradient-to-r from-[#56d364] to-[#3fb950] hover:from-[#6ee77a] hover:to-[#56d364] text-white shadow-[0_4px_20px_rgba(86,211,100,0.4)]"
                >
                  학습 완료하기
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            ) : (
              // Failed - some incorrect
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-[#f85149]/15 flex items-center justify-center">
                    <XCircle className="h-10 w-10 text-[#f85149]" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-[#e6edf3] mb-2">
                  아쉽습니다!
                </h3>
                <p className="text-sm text-[#8b949e] mb-4">
                  모든 문제를 맞혀야 완료할 수 있습니다
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f85149]/15 rounded-md mb-6">
                  <span className="text-lg font-bold text-[#f85149]">
                    {correctCount} / {totalQuestions}
                  </span>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleRetry}
                    className="w-full h-12 text-base font-bold rounded-md bg-gradient-to-r from-[#f0b429] to-[#c49a4b] hover:from-[#f7c948] hover:to-[#f0b429] text-[#1a120b] shadow-[0_4px_20px_rgba(240,180,41,0.4)]"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    다시 도전하기
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="w-full h-10 text-sm text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]"
                  >
                    돌아가서 복습하기
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Quiz question screen
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] bg-gradient-to-b from-[#1c2128] to-[#161b22] border-0 p-0 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <DialogTitle className="sr-only">챕터 퀴즈</DialogTitle>
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-[#8b949e] mb-1 font-mono uppercase tracking-wider">
                {chapterTitle}
              </p>
              <h3 className="text-lg font-bold text-[#e6edf3]">
                학습 점검 퀴즈
              </h3>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#21262d] rounded-md">
              <span className="text-sm font-mono font-bold text-[#f0b429]">
                {currentIndex + 1}
              </span>
              <span className="text-sm text-[#6e7681]">/</span>
              <span className="text-sm font-mono text-[#8b949e]">
                {totalQuestions}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[#21262d] rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#f0b429] to-[#56d364] transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + (showExplanation ? 1 : 0)) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="mb-6">
            <p className="text-base text-[#e6edf3] leading-relaxed">
              {currentQuestion?.question_ko}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion?.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === currentQuestion.correct_answer;
              const userAnswer = userAnswers[currentIndex];
              const wasUserAnswer = userAnswer?.selectedAnswer === index;

              let optionStyle = "border-[#30363d] bg-[#0a0c10] hover:border-[#484f58] hover:bg-[#151a21]";

              if (showExplanation) {
                if (isCorrect) {
                  optionStyle = "border-[#56d364] bg-[#56d364]/10";
                } else if (wasUserAnswer && !isCorrect) {
                  optionStyle = "border-[#f85149] bg-[#f85149]/10";
                } else {
                  optionStyle = "border-[#30363d] bg-[#0a0c10] opacity-50";
                }
              } else if (isSelected) {
                optionStyle = "border-[#f0b429] bg-[#f0b429]/10";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  disabled={showExplanation}
                  className={cn(
                    "w-full p-4 rounded-md border-2 text-left transition-all duration-150",
                    optionStyle,
                    showExplanation ? "cursor-default" : "cursor-pointer",
                    showExplanation && isCorrect && correctPulse && "scale-[1.02]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold",
                      showExplanation && isCorrect
                        ? "border-[#56d364] bg-[#56d364] text-white"
                        : showExplanation && wasUserAnswer && !isCorrect
                        ? "border-[#f85149] bg-[#f85149] text-white"
                        : isSelected
                        ? "border-[#f0b429] bg-[#f0b429] text-[#0a0c10]"
                        : "border-[#484f58] text-[#8b949e]"
                    )}>
                      {showExplanation && isCorrect ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : showExplanation && wasUserAnswer && !isCorrect ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <span className={cn(
                      "text-sm leading-relaxed",
                      showExplanation && isCorrect
                        ? "text-[#56d364]"
                        : showExplanation && wasUserAnswer && !isCorrect
                        ? "text-[#f85149]"
                        : "text-[#c9d1d9]"
                    )}>
                      {option.ko}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && currentQuestion?.explanation_ko && (
            <div className="mb-6 p-4 bg-[#0a0c10] rounded-md border border-[#30363d]">
              <p className="text-xs text-[#8b949e] mb-1 font-medium">해설</p>
              <p className="text-sm text-[#c9d1d9] leading-relaxed">
                {currentQuestion.explanation_ko}
              </p>
            </div>
          )}

          {/* Action Button */}
          {!showExplanation ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={cn(
                "w-full h-12 text-base font-bold rounded-md transition-all",
                selectedOption !== null
                  ? "bg-gradient-to-r from-[#f0b429] to-[#c49a4b] hover:from-[#f7c948] hover:to-[#f0b429] text-[#1a120b] shadow-[0_4px_20px_rgba(240,180,41,0.4)]"
                  : "bg-[#21262d] text-[#6e7681] cursor-not-allowed"
              )}
            >
              정답 확인
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="w-full h-12 text-base font-bold rounded-md bg-gradient-to-r from-[#f0b429] to-[#c49a4b] hover:from-[#f7c948] hover:to-[#f0b429] text-[#1a120b] shadow-[0_4px_20px_rgba(240,180,41,0.4)]"
            >
              {currentIndex < totalQuestions - 1 ? "다음 문제" : "결과 확인"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
