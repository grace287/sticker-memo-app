"use client";

import { useState } from "react";
import type { Memo } from "@/types/memo";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoCardProps {
  memo: Memo;
  onUpdate: (id: string, updates: { title?: string; content?: string }) => void;
  onDelete: (id: string) => void;
}

function formatDate(ms: number) {
  const d = new Date(ms);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (isToday) {
    return d.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MemoCard({ memo, onUpdate, onDelete }: MemoCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(memo.title);
  const [content, setContent] = useState(memo.content);

  const handleSave = () => {
    onUpdate(memo.id, { title, content });
    setEditing(false);
  };

  const handleDelete = () => {
    if (typeof window !== "undefined" && window.confirm("이 메모를 삭제할까요?")) {
      onDelete(memo.id);
    }
  };

  if (editing) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-lg font-semibold text-card-foreground focus:outline-none border-b border-transparent focus:border-border"
          autoFocus
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full resize-none bg-transparent text-card-foreground focus:outline-none text-sm border-b border-transparent focus:border-border"
        />
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => {
              setTitle(memo.title);
              setContent(memo.content);
              setEditing(false);
            }}
            className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90"
          >
            저장
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-card-foreground truncate flex-1">
          {memo.title}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="수정"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="삭제"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
      {memo.content ? (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
          {memo.content}
        </p>
      ) : null}
      <p className="mt-2 text-xs text-muted-foreground">
        {formatDate(memo.updatedAt)}
      </p>
    </div>
  );
}
