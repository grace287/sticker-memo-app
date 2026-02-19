"use client";

import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useMemos } from "@/hooks/use-memos";
import { MemoForm } from "./MemoForm";
import { MemoCard } from "./MemoCard";

const STICK_ANIMATION_MS = 480;
const DROPPABLE_ID = "memo-list";

export function MemoList() {
  const { memos, addMemo, updateMemo, deleteMemo, reorderMemos, hydrated } =
    useMemos();
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const handleAddMemo = useCallback(
    (title: string, content: string) => {
      const id = addMemo(title, content);
      setLastAddedId(id);
      setTimeout(() => setLastAddedId(null), STICK_ANIMATION_MS);
    },
    [addMemo]
  );

  const handleDragEnd = useCallback(
    (result: { destination?: { index: number } | null; source: { index: number } }) => {
      if (!result.destination || result.destination.index === result.source.index) {
        return;
      }
      reorderMemos(result.source.index, result.destination.index);
    },
    [reorderMemos]
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
      <MemoForm onSubmit={handleAddMemo} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={DROPPABLE_ID}>
          {(droppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start content-start"
            >
              {memos.map((memo, index) => (
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
      {memos.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          메모가 없습니다. 위에서 새 메모를 추가해 보세요.
        </p>
      )}
    </div>
  );
}
