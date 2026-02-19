"use client";

import { useState, useEffect, useCallback } from "react";
import type { Memo } from "@/types/memo";

const STORAGE_KEY = "sticker-memo-app-memos";

function loadMemos(): Memo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Memo[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMemos(memos: Memo[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}

export function useMemos() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMemos(loadMemos());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveMemos(memos);
  }, [memos, hydrated]);

  const addMemo = useCallback((title: string, content: string) => {
    const now = Date.now();
    const newMemo: Memo = {
      id: crypto.randomUUID(),
      title: title.trim() || "제목 없음",
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    };
    setMemos((prev) => [newMemo, ...prev]);
    return newMemo.id;
  }, []);

  const updateMemo = useCallback(
    (id: string, updates: { title?: string; content?: string }) => {
      const now = Date.now();
      setMemos((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                ...updates,
                title: (updates.title ?? m.title).trim() || m.title,
                content: (updates.content ?? m.content).trim() ?? m.content,
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

  return { memos, addMemo, updateMemo, deleteMemo, hydrated };
}
