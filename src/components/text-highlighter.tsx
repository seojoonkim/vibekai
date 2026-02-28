"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Highlighter, StickyNote, X, Save } from "lucide-react";

interface HighlightData {
  id: string;
  text: string;
  startOffset: number;
  endOffset: number;
  startPath: string;
  endPath: string;
  memo: string;
}

function getStorageKey(chapterId: string) {
  return `vibekai_highlights_${chapterId}`;
}

function loadHighlights(chapterId: string): HighlightData[] {
  try {
    const stored = localStorage.getItem(getStorageKey(chapterId));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHighlightsToStorage(chapterId: string, highlights: HighlightData[]) {
  localStorage.setItem(getStorageKey(chapterId), JSON.stringify(highlights));
}

function getNodePath(node: Node, container: Element): string {
  const parts: number[] = [];
  let current: Node | null = node;
  while (current && current !== container) {
    const parent: Node | null = current.parentNode;
    if (!parent) break;
    const children = Array.from(parent.childNodes);
    parts.unshift(children.indexOf(current as ChildNode));
    current = parent;
  }
  return parts.join("/");
}

function getNodeFromPath(path: string, container: Element): Node | null {
  const parts = path.split("/").map(Number);
  let current: Node = container;
  for (const index of parts) {
    if (!current.childNodes[index]) return null;
    current = current.childNodes[index];
  }
  return current;
}

export function TextHighlighter({
  chapterId,
  containerSelector,
}: {
  chapterId: string;
  containerSelector: string;
}) {
  const [highlights, setHighlights] = useState<HighlightData[]>([]);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [pendingRange, setPendingRange] = useState<Range | null>(null);
  const [editingMemo, setEditingMemo] = useState<string | null>(null);
  const [memoText, setMemoText] = useState("");
  const [memoPos, setMemoPos] = useState<{ x: number; y: number } | null>(null);
  const memoRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setHighlights(loadHighlights(chapterId));
  }, [chapterId]);

  // Apply highlights to DOM
  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Remove existing
    container.querySelectorAll("mark[data-highlight-id]").forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
        parent.removeChild(mark);
        parent.normalize();
      }
    });

    for (const h of highlights) {
      try {
        const startNode = getNodeFromPath(h.startPath, container);
        const endNode = getNodeFromPath(h.endPath, container);
        if (!startNode || !endNode) continue;

        const range = document.createRange();
        range.setStart(startNode, Math.min(h.startOffset, startNode.textContent?.length ?? 0));
        range.setEnd(endNode, Math.min(h.endOffset, endNode.textContent?.length ?? 0));

        const mark = document.createElement("mark");
        mark.setAttribute("data-highlight-id", h.id);
        mark.style.backgroundColor = "rgba(240, 180, 41, 0.3)";
        mark.style.color = "inherit";
        mark.style.borderRadius = "2px";
        mark.style.padding = "0 1px";
        mark.style.cursor = "pointer";
        if (h.memo) {
          mark.style.borderBottom = "2px dashed #f97583";
        }

        try { range.surroundContents(mark); } catch { /* skip multi-node */ }
      } catch { /* skip invalid */ }
    }
  }, [highlights, containerSelector]);

  // Click on highlight for memo
  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const mark = target.closest("mark[data-highlight-id]");
      if (mark) {
        const id = mark.getAttribute("data-highlight-id");
        if (id) {
          const h = highlights.find((hl) => hl.id === id);
          const rect = mark.getBoundingClientRect();
          setEditingMemo(id);
          setMemoText(h?.memo || "");
          setMemoPos({ x: rect.left + rect.width / 2, y: rect.bottom + 8 });
          setTimeout(() => memoRef.current?.focus(), 100);
        }
      }
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [containerSelector, highlights]);

  // Text selection for highlight button
  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const handleMouseUp = () => {
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !selection.rangeCount) {
          if (!editingMemo) setTooltipPos(null);
          return;
        }

        const range = selection.getRangeAt(0);
        if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) return;

        const text = selection.toString().trim();
        if (text.length < 2) return;

        const rect = range.getBoundingClientRect();
        setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
        setPendingRange(range.cloneRange());
      }, 10);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [containerSelector, editingMemo]);

  const handleHighlight = useCallback(() => {
    if (!pendingRange) return;
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const newHighlight: HighlightData = {
      id: `hl_${Date.now()}`,
      text: pendingRange.toString(),
      startOffset: pendingRange.startOffset,
      endOffset: pendingRange.endOffset,
      startPath: getNodePath(pendingRange.startContainer, container),
      endPath: getNodePath(pendingRange.endContainer, container),
      memo: "",
    };

    const updated = [...highlights, newHighlight];
    setHighlights(updated);
    saveHighlightsToStorage(chapterId, updated);
    setTooltipPos(null);
    setPendingRange(null);
    window.getSelection()?.removeAllRanges();
  }, [pendingRange, highlights, chapterId, containerSelector]);

  const handleSaveMemo = useCallback(() => {
    if (!editingMemo) return;
    const updated = highlights.map((h) =>
      h.id === editingMemo ? { ...h, memo: memoText } : h
    );
    setHighlights(updated);
    saveHighlightsToStorage(chapterId, updated);
    setEditingMemo(null);
    setMemoPos(null);
  }, [editingMemo, memoText, highlights, chapterId]);

  const handleDeleteHighlight = useCallback(() => {
    if (!editingMemo) return;
    const updated = highlights.filter((h) => h.id !== editingMemo);
    setHighlights(updated);
    saveHighlightsToStorage(chapterId, updated);
    setEditingMemo(null);
    setMemoPos(null);
  }, [editingMemo, highlights, chapterId]);

  return (
    <>
      {tooltipPos && !editingMemo && (
        <div
          className="fixed z-[100] flex items-center gap-1 px-2 py-1.5 bg-[#1c2128] border border-[#30363d] rounded-lg shadow-xl animate-in fade-in duration-150"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <button
            onClick={handleHighlight}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[#f0b429] hover:bg-[#f0b429]/10 transition-colors"
          >
            <Highlighter className="h-3.5 w-3.5" />
            하이라이트
          </button>
        </div>
      )}

      {editingMemo && memoPos && (
        <div
          className="fixed z-[100] w-72 bg-[#1c2128] border border-[#30363d] rounded-lg shadow-xl p-3 animate-in fade-in duration-150"
          style={{
            left: Math.min(memoPos.x, typeof window !== "undefined" ? window.innerWidth - 300 : memoPos.x),
            top: memoPos.y,
            transform: "translateX(-50%)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#c9d1d9]">
              <StickyNote className="h-3.5 w-3.5 text-[#f0b429]" />
              개인 메모
            </div>
            <button
              onClick={handleDeleteHighlight}
              className="p-1 rounded text-[#f85149] hover:bg-[#f85149]/10 transition-colors"
              title="하이라이트 삭제"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <textarea
            ref={memoRef}
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            placeholder="메모를 입력하세요..."
            className="w-full bg-[#0a0c10] border border-[#30363d]/50 rounded-md px-3 py-2 text-sm text-[#c9d1d9] placeholder:text-[#6e7681] resize-none focus:outline-none focus:border-[#79c0ff]/40"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => { setEditingMemo(null); setMemoPos(null); }}
              className="px-2.5 py-1 text-xs text-[#8b949e] hover:text-[#c9d1d9] rounded transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSaveMemo}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#0a0c10] bg-[#f0b429] hover:bg-[#f7c948] rounded transition-colors"
            >
              <Save className="h-3 w-3" />
              저장
            </button>
          </div>
        </div>
      )}
    </>
  );
}
