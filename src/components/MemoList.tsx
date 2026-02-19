"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useMemos } from "@/hooks/use-memos";
import { MemoForm } from "./MemoForm";
import { MemoCard } from "./MemoCard";
import { CategoryFilterDropdown } from "./CategoryFilterDropdown";
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
  const stickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // unmount 시 또는 새 타이머 등록 전 기존 타이머 정리
  useEffect(() => {
    return () => {
      if (stickTimerRef.current !== null) {
        clearTimeout(stickTimerRef.current);
        stickTimerRef.current = null;
      }
    };
  }, []);

  const filteredMemos = useMemo(() => {
    let list = memos;
    if (categoryFilter !== FILTER_ALL) {
      list = list.filter((m) => getMemoCategory(m) === categoryFilter);
    }
    return list.filter((m) => matchesSearch(m, searchQuery));
  }, [memos, categoryFilter, searchQuery]);

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
    (result: { destination?: { index: number } | null; source: { index: number } }) => {
      if (!result.destination || result.destination.index === result.source.index) {
        return;
      }
      const fromId = filteredMemos[result.source.index].id;
      const toId = filteredMemos[result.destination.index].id;
      const fullFrom = memos.findIndex((m) => m.id === fromId);
      const fullTo = memos.findIndex((m) => m.id === toId);
      if (fullFrom === -1 || fullTo === -1) return;
      reorderMemos(fullFrom, fullTo);
    },
    [reorderMemos, filteredMemos, memos]
  );

  if (!hydrated) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <MemoForm onSubmit={handleAddMemo} />
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목·내용 검색"
            className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="제목·내용 검색"
          />
        </div>
        <CategoryFilterDropdown
          value={categoryFilter}
          onChange={setCategoryFilter}
        />
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={DROPPABLE_ID}>
          {(droppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start content-start"
            >
              {filteredMemos.map((memo, index) => (
                <Draggable
                  key={memo.id}
                  draggableId={memo.id}
                  index={index}
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
        <p className="text-center text-muted-foreground py-8">
          {searchQuery.trim()
            ? "검색 결과가 없습니다. 검색어나 카테고리를 바꿔 보세요."
            : categoryFilter === FILTER_ALL
              ? "메모가 없습니다. 위에서 새 메모를 추가해 보세요."
              : "이 카테고리의 메모가 없습니다."}
        </p>
      )}
    </div>
  );
}
