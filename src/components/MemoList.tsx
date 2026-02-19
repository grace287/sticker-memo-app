"use client";

import { useMemos } from "@/hooks/use-memos";
import { MemoForm } from "./MemoForm";
import { MemoCard } from "./MemoCard";

export function MemoList() {
  const { memos, addMemo, updateMemo, deleteMemo, hydrated } = useMemos();

  if (!hydrated) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MemoForm onSubmit={addMemo} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {memos.map((memo) => (
          <MemoCard
            key={memo.id}
            memo={memo}
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
