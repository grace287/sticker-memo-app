"use client";

import { useState, useEffect, useCallback } from "react";
import { Pin, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { POSTIT_COLORS } from "@/lib/postit-colors";
import { cn } from "@/lib/utils";

const GUIDELINE_CHECKS_KEY = "sticker-memo-app-guideline-checks";

const POSTIT_STYLE = {
  backgroundColor: POSTIT_COLORS[0].bg,
  color: POSTIT_COLORS[0].text,
  boxShadow: `4px 4px 12px ${POSTIT_COLORS[0].shadow}`,
  transform: "rotate(-0.8deg)",
};

const TODO_ITEMS = [
  "「새 메모 추가」로 제목·내용·카테고리 입력 후 저장",
  "카드에 마우스를 올려 핀으로 상단 고정",
  "검색창에 단어 입력 시 제목·내용 실시간 필터",
  "드롭다운으로 카테고리별 보기",
  "카드를 드래그해 순서 변경 (자동 저장)",
  "오른쪽 상단 버튼으로 다크 모드 전환",
] as const;

const LIST_ITEMS = [
  "포스트잇 색상은 메모마다 랜덤 적용",
  "수정·삭제는 카드 호버 시 버튼으로",
  "데이터는 브라우저에 저장되어 유지",
] as const;

function loadCheckedSet(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(GUIDELINE_CHECKS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as number[];
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

function saveCheckedSet(set: Set<number>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUIDELINE_CHECKS_KEY, JSON.stringify([...set]));
}

export function MemoGuideline({ onDismiss }: { onDismiss: () => void }) {
  const [checkedSet, setCheckedSet] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCheckedSet(loadCheckedSet());
    setHydrated(true);
  }, []);

  const toggleCheck = useCallback((index: number) => {
    setCheckedSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      saveCheckedSet(next);
      return next;
    });
  }, []);

  return (
    <Card
      className={cn(
        "border-0 overflow-hidden flex flex-col min-h-[180px] sm:min-h-[200px]",
        "cursor-default select-none relative"
      )}
      style={POSTIT_STYLE}
    >
      <CardHeader className="p-3 sm:p-4 pb-1 flex flex-row items-center gap-2 pr-10">
        <Pin className="size-4 shrink-0 opacity-80" aria-hidden />
        <h2 className="text-base sm:text-lg font-semibold truncate leading-tight">
          메모 가이드라인
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute top-2 right-2 h-8 w-8 min-h-[44px] min-w-[44px] sm:h-8 sm:w-8 sm:min-h-0 sm:min-w-0 rounded-full opacity-70 hover:opacity-100 hover:bg-black/10 text-current"
          aria-label="가이드라인 삭제"
        >
          <X className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-2 flex-1 flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm">
        <div>
          <p className="font-medium opacity-90 mb-1 sm:mb-1.5">할 일</p>
          <ul className="space-y-0.5 sm:space-y-1 list-none" role="list">
            {TODO_ITEMS.map((item, i) => (
              <li key={i} className="flex gap-2 items-start">
                <button
                  type="button"
                  onClick={() => hydrated && toggleCheck(i)}
                  className={cn(
                    "mt-0.5 h-4 w-4 sm:h-3.5 sm:w-3.5 shrink-0 rounded-sm border-2 flex items-center justify-center transition-colors",
                    "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current/50",
                    checkedSet.has(i) ? "bg-current opacity-90" : "border-current opacity-70"
                  )}
                  aria-label={checkedSet.has(i) ? `체크 해제: ${item}` : `체크: ${item}`}
                >
                  {checkedSet.has(i) && <Check className="size-2.5 sm:size-2 text-[#fef08a]" strokeWidth={3} />}
                </button>
                <span
                  className={cn(
                    "leading-snug flex-1",
                    checkedSet.has(i) ? "opacity-60 line-through" : "opacity-90"
                  )}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium opacity-90 mb-0.5 sm:mb-1.5">참고</p>
          <ul className="space-y-0.5 list-disc list-inside opacity-90 text-[11px] sm:text-xs leading-relaxed">
            {LIST_ITEMS.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export const MEMO_GUIDELINE_DRAGGABLE_ID = "__memo_guideline__";

export const GUIDELINE_HIDDEN_KEY = "sticker-memo-app-guideline-hidden";
