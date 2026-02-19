export interface Memo {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  /** 0~5, 추가 시 무작위 지정. 없으면 기존 메모 호환용 id 기반 색상 사용 */
  colorIndex?: number;
  /** 카테고리. 없으면 "미분류"로 취급 */
  category?: string;
}

/** 메모 카테고리 목록 (필터/선택용) */
export const MEMO_CATEGORIES = ["미분류", "업무", "개인", "기타"] as const;
export type MemoCategory = (typeof MEMO_CATEGORIES)[number];

export const DEFAULT_CATEGORY: MemoCategory = "미분류";
