"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Search, FileText } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useMemos } from "@/hooks/use-memos";
import { MemoForm } from "./MemoForm";
import { MemoCard } from "./MemoCard";
import { CategoryFilterDropdown } from "./CategoryFilterDropdown";
import { MemoGuideline, MEMO_GUIDELINE_DRAGGABLE_ID, GUIDELINE_HIDDEN_KEY } from "./MemoGuideline";
import { DEFAULT_CATEGORY, FILTER_ALL, type CategoryFilterValue } from "@/types/memo";
import type { Memo } from "@/types/memo";

const STICK_ANIMATION_MS = 480;
const DROPPABLE_ID = "memo-list";

function getMemoCategory(memo: { category?: string }) {
  return memo.category || DEFAULT_CATEGORY;
}

/** 제목·내용에 검색어가 포함되는지 (대소문자 무시, 공백 trim) */
function matchesSearch(memo: Memo, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const title = (memo.title ?? "").toLowerCase();
  const content = (memo.content ?? "").toLowerCase();
  return title.includes(q) || content.includes(q);
}

export function MemoList() {
  const { memos, addMemo, updateMemo, deleteMemo, reorderMemos, hydrated } =
    useMemos();
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterValue>(FILTER_ALL);
  const [searchQuery, setSearchQuery] = useState("");
  const [guidelineVisible, setGuidelineVisible] = useState(true);
  const stickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setGuidelineVisible(localStorage.getItem(GUIDELINE_HIDDEN_KEY) !== "true");
  }, []);

  // unmount 시 또는 새 타이머 등록 전 기존 타이머 정리
  useEffect(() => {
    return () => {
      if (stickTimerRef.current !== null) {
        clearTimeout(stickTimerRef.current);
        stickTimerRef.current = null;
      }
    };
  }, []);

  // 고정(핀)된 메모를 상단에 유지한 뒤 카테고리·검색 필터 적용
  const sortedMemos = useMemo(
    () => [...memos.filter((m) => m.pinned), ...memos.filter((m) => !m.pinned)],
    [memos]
  );
  const filteredMemos = useMemo(() => {
    let list = sortedMemos;
    if (categoryFilter !== FILTER_ALL) {
      list = list.filter((m) => getMemoCategory(m) === categoryFilter);
    }
    return list.filter((m) => matchesSearch(m, searchQuery));
  }, [sortedMemos, categoryFilter, searchQuery]);

  const handleAddMemo = useCallback(
    (title: string, content: string, category: string) => {
      if (stickTimerRef.current !== null) {
        clearTimeout(stickTimerRef.current);
        stickTimerRef.current = null;
      }
      const id = addMemo(title, content, category);
      setLastAddedId(id);
      stickTimerRef.current = setTimeout(() => {
        setLastAddedId(null);
        stickTimerRef.current = null;
      }, STICK_ANIMATION_MS);
    },
    [addMemo]
  );

  const handleDragEnd = useCallback(
    (result: { destination?: { index: number } | null; source: { index: number; draggableId: string } }) => {
      if (result.source.draggableId === MEMO_GUIDELINE_DRAGGABLE_ID) return;
      if (!result.destination || result.destination.index === result.source.index) return;
      const offset = guidelineVisible ? 1 : 0;
      const sourceIdx = result.source.index - offset;
      const destIdx = result.destination.index - offset;
      if (sourceIdx < 0 || destIdx < 0 || sourceIdx >= filteredMemos.length || destIdx >= filteredMemos.length) return;
      const fromId = filteredMemos[sourceIdx].id;
      const toId = filteredMemos[destIdx].id;
      const fullFrom = memos.findIndex((m) => m.id === fromId);
      const fullTo = memos.findIndex((m) => m.id === toId);
      if (fullFrom === -1 || fullTo === -1) return;
      reorderMemos(fullFrom, fullTo);
    },
    [reorderMemos, filteredMemos, memos, guidelineVisible]
  );

  const handleDismissGuideline = useCallback(() => {
    localStorage.setItem(GUIDELINE_HIDDEN_KEY, "true");
    setGuidelineVisible(false);
  }, []);

  const handleShowGuideline = useCallback(() => {
    localStorage.removeItem(GUIDELINE_HIDDEN_KEY);
    setGuidelineVisible(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section aria-label="메모 작성 및 필터" className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch gap-3">
          <MemoForm onSubmit={handleAddMemo} />
          <div className="flex flex-col sm:flex-row flex-1 flex-wrap items-stretch sm:items-center gap-2 min-w-0">
            <div className="relative flex-1 min-w-0 w-full sm:min-w-[160px] sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="제목·내용 검색"
                className="w-full h-10 sm:h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-shadow touch-manipulation"
                aria-label="제목·내용 검색"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryFilterDropdown
                value={categoryFilter}
                onChange={setCategoryFilter}
              />
              {!guidelineVisible && (
                <button
                  type="button"
                  onClick={handleShowGuideline}
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 py-2 min-h-[44px] sm:min-h-0"
                >
                  가이드라인 다시 보기
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section aria-label="메모 목록" className="min-h-[200px]">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={DROPPABLE_ID}>
          {(droppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start content-start"
            >
              {guidelineVisible && (
                <Draggable
                  draggableId={MEMO_GUIDELINE_DRAGGABLE_ID}
                  index={0}
                  isDragDisabled
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <MemoGuideline onDismiss={handleDismissGuideline} />
                    </div>
                  )}
                </Draggable>
              )}
              {filteredMemos.map((memo, index) => (
                <Draggable
                  key={memo.id}
                  draggableId={memo.id}
                  index={index + (guidelineVisible ? 1 : 0)}
                >
                  {(draggableProvided, snapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      className={snapshot.isDragging ? "opacity-90 z-50" : ""}
                    >
                      <MemoCard
                        memo={memo}
                        index={index}
                        justAdded={memo.id === lastAddedId}
                        onUpdate={updateMemo}
                        onDelete={deleteMemo}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {filteredMemos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <FileText className="size-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">
            {searchQuery.trim()
              ? "검색 결과가 없습니다"
              : categoryFilter === FILTER_ALL
                ? "메모가 없습니다"
                : "이 카테고리의 메모가 없습니다"}
          </p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            {searchQuery.trim()
              ? "검색어나 카테고리를 바꿔 보세요."
              : categoryFilter === FILTER_ALL
                ? "위 「새 메모 추가」를 눌러 첫 메모를 작성해 보세요."
                : "다른 카테고리를 선택하거나 새 메모를 추가해 보세요."}
          </p>
        </div>
      )}
      </section>
    </div>
  );
}
