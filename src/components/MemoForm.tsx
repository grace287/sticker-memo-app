"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <Card className="border-2 border-dashed border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/30 transition-colors cursor-pointer">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center justify-center gap-2 w-full min-h-[140px] text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-6" />
          <span className="font-medium">새 메모 추가</span>
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full bg-transparent text-lg font-semibold text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 border-b border-border focus:border-primary/50 pb-1"
            autoFocus
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요..."
            rows={4}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setExpanded(false);
                setTitle("");
                setContent("");
              }}
            >
              취소
            </Button>
            <Button type="submit">저장</Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
