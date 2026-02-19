"use client";

import { useState, useCallback } from "react";
import { useMemos } from "@/hooks/use-memos";
import { MemoForm } from "./MemoForm";
import { MemoCard } from "./MemoCard";

const STICK_ANIMATION_MS = 480;

export function MemoList() {
  const { memos, addMemo, updateMemo, deleteMemo, hydrated } = useMemos();
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const handleAddMemo = useCallback(
    (title: string, content: string) => {
      const id = addMemo(title, content);
      setLastAddedId(id);
      setTimeout(() => setLastAddedId(null), STICK_ANIMATION_MS);
    },
    [addMemo]
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start content-start">
        {memos.map((memo, index) => (
          <MemoCard
            key={memo.id}
            memo={memo}
            index={index}
            justAdded={memo.id === lastAddedId}
            onUpdate={updateMemo}
            onDelete={deleteMemo}
          />
        ))}
      </div>
      {memos.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          메모가 없습니다. 위에서 새 메모를 추가해 보세요.
        </p>
      )}
    </div>
  );
}
