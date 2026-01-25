"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Question } from "./chapter-questions-panel";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { MessageSquare, Check, Plus } from "lucide-react";

interface QuestionHighlightOverlayProps {
  containerSelector: string;
  questions: Question[];
  onQuestionClick?: (questionId: string) => void;
  onAddQuestion?: (selectedText: string) => void;
}

interface HighlightedRange {
  question: Question;
  rects: DOMRect[];
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  question: Question | null;
}

export function QuestionHighlightOverlay({
  containerSelector,
  questions,
  onQuestionClick,
  onAddQuestion,
}: QuestionHighlightOverlayProps) {
  const [highlightedRanges, setHighlightedRanges] = useState<HighlightedRange[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    question: null,
  });
  const [mounted, setMounted] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const findTextInContainer = useCallback((container: Element, searchText: string): Range | null => {
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      const text = node.textContent || "";
      const index = text.indexOf(searchText);
      if (index !== -1) {
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + searchText.length);
        return range;
      }
    }

    // 여러 노드에 걸친 텍스트 찾기
    const fullText = container.textContent || "";
    const searchIndex = fullText.indexOf(searchText);
    if (searchIndex === -1) return null;

    // 시작점과 끝점 찾기
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

      // 시작점 찾기
      if (!startNode && searchIndex >= nodeStart && searchIndex < nodeEnd) {
        startNode = node;
        startOffset = searchIndex - nodeStart;
      }

      // 끝점 찾기
      const searchEnd = searchIndex + searchText.length;
      if (startNode && searchEnd > nodeStart && searchEnd <= nodeEnd) {
        endNode = node;
        endOffset = searchEnd - nodeStart;
        break;
      }

      currentIndex = nodeEnd;
    }

    if (startNode && endNode) {
      const range = document.createRange();
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
      return range;
    }

    return null;
  }, []);

  const updateHighlights = useCallback(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const ranges: HighlightedRange[] = [];

    for (const question of questions) {
      const range = findTextInContainer(container, question.selected_text);
      if (range) {
        const rects = Array.from(range.getClientRects());
        if (rects.length > 0) {
          ranges.push({ question, rects });
        }
      }
    }

    setHighlightedRanges(ranges);
  }, [containerSelector, questions, findTextInContainer]);

  useEffect(() => {
    updateHighlights();

    // 스크롤, 리사이즈 시 업데이트
    const handleUpdate = () => {
      requestAnimationFrame(updateHighlights);
    };

    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);

    // MutationObserver로 DOM 변화 감지
    const container = document.querySelector(containerSelector);
    let observer: MutationObserver | null = null;
    if (container) {
      observer = new MutationObserver(handleUpdate);
      observer.observe(container, { childList: true, subtree: true, characterData: true });
    }

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
      observer?.disconnect();
    };
  }, [containerSelector, updateHighlights]);

  const handleMouseEnter = useCallback((question: Question, rect: DOMRect) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
      question,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }, 150);
  }, []);

  const handleTooltipMouseEnter = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const handleTooltipMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleClick = useCallback((questionId: string) => {
    onQuestionClick?.(questionId);
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, [onQuestionClick]);

  const handleAddQuestion = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (tooltip.question) {
      onAddQuestion?.(tooltip.question.selected_text);
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  }, [tooltip.question, onAddQuestion]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* 밑줄 표시 레이어 (pointer-events: none) */}
      {highlightedRanges.map(({ question, rects }) =>
        rects.map((rect, rectIndex) => (
          <div
            key={`underline-${question.id}-${rectIndex}`}
            className="pointer-events-none"
            style={{
              position: "fixed",
              left: rect.left,
              top: rect.top + rect.height - 2,
              width: rect.width,
              height: 0,
              borderBottom: question.is_resolved
                ? "1px dashed rgba(139, 92, 246, 0.7)"
                : "1px dashed rgba(251, 146, 60, 0.7)",
              zIndex: 5,
            }}
          />
        ))
      )}

      {/* 텍스트 영역 전체 - 호버 및 클릭 가능 영역 */}
      {highlightedRanges.map(({ question, rects }) =>
        rects.map((rect, rectIndex) => (
          <div
            key={`hover-${question.id}-${rectIndex}`}
            className="pointer-events-auto cursor-pointer"
            style={{
              position: "fixed",
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
              zIndex: 10,
              transition: "background 0.15s ease",
              background: "transparent",
            }}
            data-question-bg={question.id}
            onMouseEnter={() => {
              // 배경 하이라이트 표시
              const bgElements = document.querySelectorAll(`[data-question-bg="${question.id}"]`);
              bgElements.forEach((el) => {
                (el as HTMLElement).style.background = question.is_resolved
                  ? "rgba(139, 92, 246, 0.1)"
                  : "rgba(251, 146, 60, 0.1)";
              });
              handleMouseEnter(question, rect);
            }}
            onMouseLeave={() => {
              // 배경 하이라이트 제거
              const bgElements = document.querySelectorAll(`[data-question-bg="${question.id}"]`);
              bgElements.forEach((el) => {
                (el as HTMLElement).style.background = "transparent";
              });
              handleMouseLeave();
            }}
            onClick={() => handleClick(question.id)}
          />
        ))
      )}

      {/* 툴팁 팝업 */}
      {tooltip.visible && tooltip.question && (
        <div
          className="fixed z-50 pointer-events-auto"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translateX(-50%)",
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          <div
            className="bg-[#161b22] border border-[#3d444d] rounded-md shadow-xl max-w-xs w-72 overflow-hidden cursor-pointer hover:border-violet-500/50 transition-colors"
            onClick={() => handleClick(tooltip.question!.id)}
          >
            {/* 질문 내용 */}
            <div className="p-3">
              <div className="flex items-start gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-sm text-[#e6edf3] line-clamp-3">{tooltip.question.question}</p>
              </div>

              {/* 메타 정보 */}
              <div className="flex items-center justify-between text-xs text-[#6e7681]">
                <span>{tooltip.question.profiles?.display_name || tooltip.question.profiles?.username}</span>
                <div className="flex items-center gap-2">
                  {tooltip.question.is_resolved && (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Check className="h-3 w-3" />
                      해결됨
                    </span>
                  )}
                  <span>
                    {formatDistanceToNow(new Date(tooltip.question.created_at), { addSuffix: true, locale: ko })}
                  </span>
                </div>
              </div>

              {/* 답변 수 */}
              {tooltip.question.replies && tooltip.question.replies.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[#3d444d] text-xs text-[#9198a1]">
                  💬 답변 {tooltip.question.replies.length}개
                </div>
              )}
            </div>

            {/* 추가 질문하기 버튼 */}
            {onAddQuestion && (
              <div
                className="px-3 py-2 border-t border-[#3d444d] flex items-center gap-2 text-xs text-violet-400 hover:bg-violet-500/10 cursor-pointer transition-colors"
                onClick={handleAddQuestion}
              >
                <Plus className="h-3.5 w-3.5" />
                이 부분에 추가 질문하기
              </div>
            )}
          </div>

          {/* 화살표 */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "8px solid #3d444d",
            }}
          />
        </div>
      )}
    </>,
    document.body
  );
}
