"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface MemoFormProps {
  onSubmit: (title: string, content: string) => void;
}

export function MemoForm({ onSubmit }: MemoFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    onSubmit(title, content);
    setTitle("");
    setContent("");
    setExpanded(false);
  };

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex items-center justify-center gap-2 w-full min-h-[120px] rounded-xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:bg-muted/50 hover:text-foreground transition-colors"
      >
        <Plus className="size-5" />
        <span>새 메모 추가</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        className="w-full bg-transparent text-lg font-semibold text-card-foreground placeholder:text-muted-foreground focus:outline-none"
        autoFocus
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용을 입력하세요..."
        rows={4}
        className="w-full resize-none bg-transparent text-card-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
      />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => {
            setExpanded(false);
            setTitle("");
            setContent("");
          }}
          className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90"
        >
          저장
        </button>
      </div>
    </form>
  );
}
