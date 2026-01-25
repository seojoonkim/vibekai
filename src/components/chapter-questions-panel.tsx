"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, X, Send, Loader2, ChevronDown, ChevronUp, Reply, Check, Trash2, AlertTriangle, Award } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export interface Question {
  id: string;
  chapter_id: string;
  user_id: string;
  selected_text: string;
  context_before: string | null;
  context_after: string | null;
  question: string;
  is_resolved: boolean;
  created_at: string;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  replies: QuestionReply[];
}

export interface QuestionReply {
  id: string;
  question_id: string;
  user_id: string;
  content: string;
  is_accepted: boolean;
  created_at: string;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export interface TextSelection {
  text: string;
  contextBefore: string;
  contextAfter: string;
}

interface ChapterQuestionsPanelProps {
  chapterId: string;
  selectedText?: TextSelection | null;
  onClearSelection?: () => void;
  questions?: Question[];
  onQuestionsChange?: (questions: Question[]) => void;
  highlightedQuestionId?: string | null;
  hideHeader?: boolean;
  onScrollToText?: (text: string) => void;
}

export function ChapterQuestionsPanel({
  chapterId,
  selectedText: externalSelectedText,
  onClearSelection,
  questions: externalQuestions,
  onQuestionsChange,
  highlightedQuestionId,
  hideHeader = false,
  onScrollToText,
}: ChapterQuestionsPanelProps) {
  const [internalQuestions, setInternalQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  // 외부 questions가 있으면 사용, 없으면 내부 상태 사용
  const questions = externalQuestions ?? internalQuestions;
  const setQuestions = (newQuestions: Question[] | ((prev: Question[]) => Question[])) => {
    const resolved = typeof newQuestions === 'function' ? newQuestions(questions) : newQuestions;
    setInternalQuestions(resolved);
    onQuestionsChange?.(resolved);
  };

  // 새 질문 작성 상태
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 답변 작성 상태
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // 삭제 확인 모달 상태
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchQuestions = useCallback(async () => {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("chapter_questions")
        .select(`
          *,
          profiles:user_id (username, display_name, avatar_url),
          replies:chapter_question_replies (
            *,
            profiles:user_id (username, display_name, avatar_url)
          )
        `)
        .eq("chapter_id", chapterId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("질문 목록 로딩 실패:", JSON.stringify(error, null, 2));
        console.error("Error details:", error.message, error.code, error.details, error.hint);
      } else if (data) {
        console.log("질문 목록 로딩 성공:", data.length, "개");
        setQuestions(data as Question[]);
      }
    } catch (err) {
      console.error("질문 목록 로딩 중 오류:", err);
    }
    setLoading(false);
  }, [chapterId]);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({ id: user.id });
      }
      fetchQuestions();
    }
    init();
  }, [fetchQuestions]);

  const handleSubmitQuestion = async () => {
    if (!externalSelectedText || !newQuestion.trim() || !currentUser || submitting) return;

    setSubmitting(true);
    const supabase = createClient();

    // 잘못된 유니코드 서로게이트 문자 제거
    const sanitizeText = (text: string | null | undefined): string | null => {
      if (!text) return null;
      // 잘못된 서로게이트 쌍 제거
      return text.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
    };

    const insertData = {
      chapter_id: chapterId,
      user_id: currentUser.id,
      selected_text: sanitizeText(externalSelectedText.text) || '',
      context_before: sanitizeText(externalSelectedText.contextBefore),
      context_after: sanitizeText(externalSelectedText.contextAfter),
      question: sanitizeText(newQuestion.trim()) || '',
    };

    console.log("Insert data:", JSON.stringify(insertData, null, 2));

    try {
      // insert와 select를 분리해서 실행
      const { data, error } = await supabase
        .from("chapter_questions")
        .insert([insertData])
        .select("*");

      if (error) {
        console.error("질문 등록 실패:", JSON.stringify(error, null, 2));
        console.error("Error details:", error.message, error.code, error.details, error.hint);
        alert(`질문 등록에 실패했습니다: ${error.message || error.code || JSON.stringify(error)}`);
      } else {
        console.log("질문 등록 성공:", data);
        setNewQuestion("");
        onClearSelection?.();
        fetchQuestions();
      }
    } catch (err) {
      console.error("질문 등록 중 오류:", err);
      alert("질문 등록 중 오류가 발생했습니다.");
    }
    setSubmitting(false);
  };

  const handleSubmitReply = async (questionId: string) => {
    if (!replyContent.trim() || !currentUser || submittingReply) return;

    setSubmittingReply(true);
    const supabase = createClient();

    try {
      const { data, error } = await supabase.from("chapter_question_replies").insert({
        question_id: questionId,
        user_id: currentUser.id,
        content: replyContent.trim(),
      }).select();

      if (error) {
        console.error("답변 등록 실패:", error);
        alert(`답변 등록에 실패했습니다: ${error.message}`);
      } else {
        console.log("답변 등록 성공:", data);
        setReplyContent("");
        setReplyingTo(null);
        fetchQuestions();
      }
    } catch (err) {
      console.error("답변 등록 중 오류:", err);
      alert("답변 등록 중 오류가 발생했습니다.");
    }
    setSubmittingReply(false);
  };

  const handleResolve = async (questionId: string) => {
    const supabase = createClient();
    await supabase
      .from("chapter_questions")
      .update({ is_resolved: true })
      .eq("id", questionId);
    fetchQuestions();
  };

  const handleUnresolve = async (questionId: string) => {
    const supabase = createClient();
    await supabase
      .from("chapter_questions")
      .update({ is_resolved: false })
      .eq("id", questionId);
    fetchQuestions();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId || deleting) return;

    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("chapter_questions")
      .delete()
      .eq("id", deleteConfirmId);

    if (error) {
      console.error("질문 삭제 실패:", error);
    } else {
      fetchQuestions();
    }
    setDeleting(false);
    setDeleteConfirmId(null);
  };

  // 답변 채택/채택 취소
  const handleAcceptReply = async (replyId: string, replyUserId: string, isCurrentlyAccepted: boolean) => {
    const supabase = createClient();

    // 채택 상태 토글
    const { error } = await supabase
      .from("chapter_question_replies")
      .update({ is_accepted: !isCurrentlyAccepted })
      .eq("id", replyId);

    if (error) {
      console.error("답변 채택 실패:", error);
      return;
    }

    if (!isCurrentlyAccepted) {
      // 새로 채택하는 경우: 답변 작성자에게 10 XP 부여
      await supabase.from("xp_logs").insert({
        user_id: replyUserId,
        amount: 10,
        action: "answer_accepted",
        reference_id: replyId,
      });

      await supabase.rpc("increment_xp", {
        user_id: replyUserId,
        amount: 10,
      });
    } else {
      // 채택 취소하는 경우: 답변 작성자의 XP 차감
      await supabase.from("xp_logs").delete()
        .eq("action", "answer_accepted")
        .eq("reference_id", replyId);

      await supabase.rpc("increment_xp", {
        user_id: replyUserId,
        amount: -10,
      });
    }

    fetchQuestions();
  };

  const toggleExpanded = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const questionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // 하이라이트된 질문으로 스크롤
  useEffect(() => {
    if (highlightedQuestionId) {
      const element = questionRefs.current.get(highlightedQuestionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // 답변이 있으면 펼치기
        const question = questions.find(q => q.id === highlightedQuestionId);
        if (question?.replies && question.replies.length > 0) {
          setExpandedQuestions(prev => new Set([...prev, highlightedQuestionId]));
        }
      }
    }
  }, [highlightedQuestionId, questions]);

  const cancelSelection = () => {
    setNewQuestion("");
    onClearSelection?.();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-[#9198a1]" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header - 조건부 렌더링 */}
      {!hideHeader && (
        <div className="flex items-center gap-2 px-1">
          <MessageSquare className="h-4 w-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-[#e6edf3]">질문 & 토론</h3>
          <span className="text-xs text-[#9198a1]">({questions.length})</span>
        </div>
      )}

      {/* 안내 메시지 - 헤더 숨길 때만 표시 */}
      {hideHeader && questions.length === 0 && !externalSelectedText && (
        <div className="text-center py-8">
          <MessageSquare className="h-8 w-8 text-[#3d444d] mx-auto mb-3" />
          <p className="text-sm text-[#9198a1] mb-1">아직 질문이 없습니다</p>
          <p className="text-xs text-[#6e7681]">
            이해가 안되는 부분의 텍스트를 선택하면<br />질문을 남길 수 있습니다.
          </p>
        </div>
      )}

      {/* 새 질문 작성 (텍스트 선택 시) */}
      {externalSelectedText && currentUser && (
        <div className="bg-[#161b22] border border-violet-500/50 rounded-md p-3 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-violet-400 mb-1">선택된 텍스트</p>
              <p className="text-[15px] text-[#e6edf3] underline decoration-[#6e7681]/50 underline-offset-2">
                &ldquo;{externalSelectedText.text}&rdquo;
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-[#9198a1] hover:text-white hover:bg-[#21262d]"
              onClick={cancelSelection}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Textarea
            placeholder="이 부분에 대해 질문해주세요..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="min-h-[60px] text-sm bg-[#161b22] border-0 text-[#e6edf3] placeholder:text-[#6e7681] resize-none shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-violet-500/30"
            autoFocus
          />
          <Button
            onClick={handleSubmitQuestion}
            disabled={!newQuestion.trim() || submitting}
            size="sm"
            className="w-full h-8 text-xs bg-violet-600 hover:bg-violet-500"
          >
            {submitting ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Send className="h-3 w-3 mr-1" />
            )}
            질문 등록
          </Button>
        </div>
      )}

      {/* 로그인 안내 */}
      {!currentUser && externalSelectedText && (
        <div className="bg-[#161b22] border border-[#3d444d] rounded-md p-3 text-center">
          <p className="text-sm text-[#9198a1]">질문을 남기려면 로그인이 필요합니다.</p>
        </div>
      )}

      {/* 안내 메시지 - 헤더가 있을 때만 표시 (헤더 숨길 때는 위에서 처리) */}
      {!hideHeader && !externalSelectedText && questions.length === 0 && (
        <div className="bg-[#161b22] border border-[#3d444d] rounded-md p-4 text-center">
          <MessageSquare className="h-8 w-8 text-[#3d444d] mx-auto mb-2" />
          <p className="text-sm text-[#9198a1] mb-1">아직 질문이 없습니다</p>
          <p className="text-xs text-[#6e7681]">
            이해가 안되는 부분의 텍스트를 선택하면<br />질문을 남길 수 있습니다.
          </p>
        </div>
      )}

      {/* 질문 목록 */}
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {questions.map((q) => {
          const isExpanded = expandedQuestions.has(q.id);
          const hasReplies = q.replies && q.replies.length > 0;

          const isHighlighted = highlightedQuestionId === q.id;

          return (
            <div
              key={q.id}
              ref={(el) => {
                if (el) questionRefs.current.set(q.id, el);
                else questionRefs.current.delete(q.id);
              }}
              className="rounded-md overflow-hidden transition-all duration-700 ease-out"
              style={{
                backgroundColor: isHighlighted ? "rgba(139, 92, 246, 0.15)" : "#161b22",
              }}
            >
              {/* 질문 헤더 */}
              <div className="p-2.5">
                {/* 선택된 텍스트 - 클릭하면 해당 위치로 스크롤 */}
                <p
                  className={`text-[13px] text-[#9198a1] mb-2 underline decoration-[#6e7681]/50 underline-offset-2 ${
                    onScrollToText ? "cursor-pointer hover:text-violet-400 hover:decoration-violet-400/50 transition-colors" : ""
                  }`}
                  onClick={() => onScrollToText?.(q.selected_text)}
                >
                  &ldquo;{q.selected_text}&rdquo;
                </p>

                {/* 질문 내용 */}
                <p className="text-sm text-[#e6edf3] mb-2">{q.question}</p>

                {/* 메타 정보 */}
                <div className="flex items-center justify-between text-xs text-[#6e7681]">
                  <div className="flex items-center gap-1.5">
                    <Avatar className="h-5 w-5 ring-1 ring-[#e3b341]/30">
                      <AvatarImage src={q.profiles?.avatar_url || undefined} />
                      <AvatarFallback className="bg-[#e3b341]/20 text-[#e3b341] text-[8px] font-mono">
                        {(q.profiles?.username || "U").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{q.profiles?.display_name || q.profiles?.username}</span>
                  </div>
                  <span>
                    {formatDistanceToNow(new Date(q.created_at), { addSuffix: true, locale: ko })}
                  </span>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex flex-wrap items-center gap-1 mt-2 pt-2 border-t border-[#3d444d]">
                  {hasReplies && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-[#9198a1] hover:text-white hover:bg-[#21262d]"
                      onClick={() => toggleExpanded(q.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ChevronDown className="h-3 w-3 mr-1" />
                      )}
                      답변 {q.replies.length}개
                    </Button>
                  )}
                  {currentUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-[#9198a1] hover:text-white hover:bg-[#21262d]"
                      onClick={() => setReplyingTo(replyingTo === q.id ? null : q.id)}
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      답변
                    </Button>
                  )}
                  {currentUser?.id === q.user_id && !q.is_resolved && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-[#6e7681] hover:text-emerald-400 hover:bg-[#21262d] shrink-0"
                      onClick={() => handleResolve(q.id)}
                    >
                      <Check className="h-3 w-3 mr-1 shrink-0" />
                      <span className="whitespace-nowrap">해결</span>
                    </Button>
                  )}
                  {q.is_resolved && currentUser?.id === q.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-emerald-400 hover:text-[#9198a1] hover:bg-[#21262d] shrink-0"
                      onClick={() => handleUnresolve(q.id)}
                      title="해결 취소"
                    >
                      <Check className="h-3 w-3 mr-1 shrink-0" />
                      <span className="whitespace-nowrap">해결됨</span>
                    </Button>
                  )}
                  {q.is_resolved && currentUser?.id !== q.user_id && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 shrink-0 whitespace-nowrap px-2 py-1">
                      <Check className="h-3 w-3 shrink-0" />
                      해결됨
                    </span>
                  )}
                  {currentUser?.id === q.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
                      onClick={() => setDeleteConfirmId(q.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* 답변 목록 */}
              {isExpanded && hasReplies && (
                <div className="border-t border-[#3d444d] bg-[#0d1117]">
                  {q.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-2.5 border-b border-[#21262d] last:border-b-0 ${
                        reply.is_accepted ? "bg-emerald-500/5 border-l-2 border-l-emerald-500" : ""
                      }`}
                    >
                      {/* 채택됨 표시 */}
                      {reply.is_accepted && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <Award className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-xs font-medium text-emerald-400">채택된 답변</span>
                        </div>
                      )}
                      <p className="text-sm text-[#e6edf3] mb-2">{reply.content}</p>
                      <div className="flex items-center justify-between text-xs text-[#6e7681]">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-5 w-5 ring-1 ring-[#56d364]/30">
                            <AvatarImage src={reply.profiles?.avatar_url || undefined} />
                            <AvatarFallback className="bg-[#56d364]/20 text-[#56d364] text-[8px] font-mono">
                              {(reply.profiles?.username || "U").slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{reply.profiles?.display_name || reply.profiles?.username}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>
                            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: ko })}
                          </span>
                          {/* 질문자만 채택 버튼 표시 */}
                          {currentUser?.id === q.user_id && (
                            <button
                              onClick={() => handleAcceptReply(reply.id, reply.user_id, reply.is_accepted)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                                reply.is_accepted
                                  ? "text-emerald-400 bg-emerald-500/20 hover:bg-emerald-500/10"
                                  : "text-[#8b949e] hover:text-emerald-400 hover:bg-emerald-500/10"
                              }`}
                              title={reply.is_accepted ? "채택 취소" : "이 답변 채택하기"}
                            >
                              <Award className="h-3 w-3" />
                              {reply.is_accepted ? "채택됨" : "채택"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 답변 입력 */}
              {replyingTo === q.id && (
                <div className="p-2.5 border-t border-[#3d444d] bg-[#161b22]">
                  <Textarea
                    placeholder="답변을 입력하세요..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full min-h-[50px] text-sm bg-[#161b22] border-0 text-[#e6edf3] placeholder:text-[#6e7681] resize-none mb-2 shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-violet-500/30"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-[#9198a1] hover:text-white hover:bg-[#21262d]"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-violet-600 hover:bg-violet-500"
                      onClick={() => handleSubmitReply(q.id)}
                      disabled={!replyContent.trim() || submittingReply}
                    >
                      {submittingReply && (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      )}
                      답변 등록
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 삭제 확인 모달 */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent
          className="sm:max-w-[400px] bg-[#161b22] border-[#3d444d] text-[#e6edf3]"
          showCloseButton={false}
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <DialogTitle className="text-[#e6edf3]">질문 삭제</DialogTitle>
            </div>
            <DialogDescription className="text-[#9198a1]">
              정말 이 질문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmId(null)}
              disabled={deleting}
              className="text-[#9198a1] hover:text-[#e6edf3] hover:bg-[#21262d]"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  삭제 중...
                </>
              ) : (
                "삭제"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
