"use client";

import { useState } from "react";
import type { Memo } from "@/types/memo";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPostitStyle } from "@/lib/postit-colors";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MemoCardProps {
  memo: Memo;
  index: number;
  justAdded?: boolean;
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

export function MemoCard({
  memo,
  index,
  justAdded = false,
  onUpdate,
  onDelete,
}: MemoCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(memo.title);
  const [content, setContent] = useState(memo.content);

  const postitStyle = getPostitStyle(memo, index);

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
      <Card
        className="border-0 shadow-md"
        style={{
          ...postitStyle,
          minHeight: "200px",
        }}
      >
        <CardHeader className="p-4 pb-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-lg font-semibold focus:outline-none border-b border-current/30 focus:border-current/60 placeholder:opacity-70"
            placeholder="제목"
            style={{ color: postitStyle.color }}
            autoFocus
          />
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full resize-none bg-transparent text-sm focus:outline-none border-b border-current/30 focus:border-current/60 placeholder:opacity-70"
            placeholder="내용"
            style={{ color: postitStyle.color }}
          />
          <div className="flex gap-2 justify-end pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setTitle(memo.title);
                setContent(memo.content);
                setEditing(false);
              }}
            >
              취소
            </Button>
            <Button type="button" size="sm" onClick={handleSave}>
              저장
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
        className={cn(
          "transition-[transform,box-shadow] duration-300 ease-out",
          "hover:scale-[1.03] hover:shadow-xl hover:shadow-black/15",
          justAdded && "animate-stick"
        )}
      >
      <Card
        className={cn(
          "group border-0 overflow-hidden flex flex-col min-h-[180px]"
        )}
        style={postitStyle}
      >
      <CardHeader className="p-4 pb-1 flex flex-row items-start justify-between gap-2">
        <h3 className="text-lg font-semibold truncate flex-1 leading-tight">
          {memo.title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0 translate-y-1 group-hover:translate-y-0 transition-transform duration-200 ease-out">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setEditing(true)}
            className={cn(
              "h-8 w-8 rounded-full text-current opacity-0 group-hover:opacity-100",
              "transition-[opacity,transform,box-shadow] duration-200 ease-out",
              "hover:scale-110 hover:bg-black/12 active:scale-95",
              "hover:shadow-md focus-visible:ring-2 focus-visible:ring-current/30"
            )}
            aria-label="수정"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className={cn(
              "h-8 w-8 rounded-full text-current opacity-0 group-hover:opacity-100",
              "transition-[opacity,transform,box-shadow] duration-200 ease-out delay-75",
              "hover:scale-110 hover:bg-red-500/20 hover:text-red-700 active:scale-95",
              "hover:shadow-md hover:shadow-red-900/10 focus-visible:ring-2 focus-visible:ring-red-500/40"
            )}
            aria-label="삭제"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
        {memo.content ? (
          <p className="text-sm line-clamp-4 whitespace-pre-wrap flex-1 opacity-90">
            {memo.content}
          </p>
        ) : (
          <p className="text-sm opacity-60 italic flex-1">내용 없음</p>
        )}
        <p className="text-xs mt-2 opacity-75">{formatDate(memo.updatedAt)}</p>
      </CardContent>
    </Card>
    </div>
  );
}
