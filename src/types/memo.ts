export interface Memo {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  /** 0~5, 추가 시 무작위 지정. 없으면 기존 메모 호환용 id 기반 색상 사용 */
  colorIndex?: number;
}
