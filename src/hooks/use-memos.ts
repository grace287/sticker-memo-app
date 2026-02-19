"use client";

import { useState, useEffect, useCallback } from "react";
import type { Memo } from "@/types/memo";
import { DEFAULT_CATEGORY, MEMO_CATEGORIES } from "@/types/memo";
import { POSTIT_COLORS } from "@/lib/postit-colors";

/** 로컬 스토리지에 저장할 때 사용하는 키 (앱 껐다 켜도 이 키로 읽음) */
const STORAGE_KEY = "sticker-memo-app-memos";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** 로컬 스토리지에서 읽은 객체를 Memo로 정규화(마이그레이션). 필수 필드 검증·보정, 구버전/깨진 데이터 복구 */
function migrateToMemo(raw: Record<string, unknown>): Memo {
  const id =
    typeof raw.id === "string" && raw.id.length > 0
      ? raw.id
      : crypto.randomUUID();
  const title =
    typeof raw.title === "string" ? raw.title.trim() || "제목 없음" : "제목 없음";
  const content = typeof raw.content === "string" ? raw.content : "";
  const now = Date.now();
  const createdAt =
    typeof raw.createdAt === "number" && !Number.isNaN(raw.createdAt)
      ? raw.createdAt
      : now;
  const updatedAt =
    typeof raw.updatedAt === "number" && !Number.isNaN(raw.updatedAt)
      ? raw.updatedAt
      : now;

  let colorIndex: number | undefined;
  if (typeof raw.colorIndex === "number" && !Number.isNaN(raw.colorIndex)) {
    const n = Math.floor(raw.colorIndex);
    if (n >= 0 && n < POSTIT_COLORS.length) colorIndex = n;
  }

  const category =
    typeof raw.category === "string" && raw.category.trim() && (MEMO_CATEGORIES as readonly string[]).includes(raw.category)
      ? raw.category
      : DEFAULT_CATEGORY;

  return {
    id,
    title,
    content,
    createdAt,
    updatedAt,
    category,
    ...(colorIndex !== undefined && { colorIndex }),
  };
}

/**
 * 앱 시작 시 로컬 스토리지에서 메모 목록을 읽어옵니다.
 * 스키마 검증 후 복구 가능한 항목만 마이그레이션해 반환하고, 복구 불가 항목은 제외합니다.
 * 서버 렌더링(SSR)에서는 window가 없으므로 빈 배열을 반환합니다.
 */
function loadMemos(): Memo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const result: Memo[] = [];
    for (const item of parsed) {
      if (!isRecord(item)) continue;
      result.push(migrateToMemo(item));
    }
    return result;
  } catch {
    return [];
  }
}

/**
 * 메모 목록을 로컬 스토리지에 저장합니다.
 * 추가/수정/삭제/순서 변경 시 memos 상태가 바뀌고, useEffect에서 이 함수가 호출됩니다.
 */
function saveMemos(memos: Memo[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}

export function useMemos() {
  const [memos, setMemos] = useState<Memo[]>([]);
  /** SSR 후 클라이언트에서 스토리지를 읽었는지 여부 (로딩 완료 후에만 저장 실행) */
  const [hydrated, setHydrated] = useState(false);

  // 1) 앱/페이지 로드 시: 로컬 스토리지에서 불러오기 (한 번만 실행)
  useEffect(() => {
    setMemos(loadMemos());
    setHydrated(true);
  }, []);

  // 2) memos가 바뀔 때마다: 로컬 스토리지에 저장 (추가/수정/삭제/순서 변경 모두 반영)
  useEffect(() => {
    if (!hydrated) return;
    saveMemos(memos);
  }, [memos, hydrated]);

  const addMemo = useCallback(
    (title: string, content: string, category: string = DEFAULT_CATEGORY) => {
      const now = Date.now();
      const colorIndex = Math.floor(Math.random() * POSTIT_COLORS.length);
      const newMemo: Memo = {
        id: crypto.randomUUID(),
        title: title.trim() || "제목 없음",
        content: content.trim(),
        createdAt: now,
        updatedAt: now,
        colorIndex,
        category: category || DEFAULT_CATEGORY,
      };
      setMemos((prev) => [newMemo, ...prev]);
      return newMemo.id;
    },
    []
  );

  const updateMemo = useCallback(
    (
      id: string,
      updates: { title?: string; content?: string; category?: string }
    ) => {
      const now = Date.now();
      setMemos((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                ...updates,
                title: (updates.title ?? m.title).trim() || m.title,
                content: (updates.content ?? m.content).trim() ?? m.content,
                category: updates.category ?? m.category,
                updatedAt: now,
              }
            : m
        )
      );
    },
    []
  );

  const deleteMemo = useCallback((id: string) => {
    setMemos((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const reorderMemos = useCallback((sourceIndex: number, destinationIndex: number) => {
    setMemos((prev) => {
      const next = [...prev];
      const [removed] = next.splice(sourceIndex, 1);
      next.splice(destinationIndex, 0, removed);
      return next;
    });
  }, []);

  return { memos, addMemo, updateMemo, deleteMemo, reorderMemos, hydrated };
}
