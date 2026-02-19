/** 포스트잇 스타일 색상 팔레트 (알록다록) */
export const POSTIT_COLORS = [
  { bg: "#fef08a", text: "#713f12", shadow: "rgba(113,63,18,0.25)" }, // 노랑
  { bg: "#fecdd3", text: "#9f1239", shadow: "rgba(159,18,57,0.2)" },   // 핑크
  { bg: "#bbf7d0", text: "#14532d", shadow: "rgba(20,83,45,0.2)" },   // 민트
  { bg: "#ddd6fe", text: "#4c1d95", shadow: "rgba(76,29,149,0.2)" },  // 라벤더
  { bg: "#fed7aa", text: "#9a3412", shadow: "rgba(154,52,18,0.2)" },  // 피치
  { bg: "#bae6fd", text: "#0c4a6e", shadow: "rgba(12,74,110,0.2)" },  // 스카이
] as const;

export function getPostitStyle(memoId: string, index: number) {
  const hash = [...memoId].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const colorIndex = Math.abs(hash) % POSTIT_COLORS.length;
  const color = POSTIT_COLORS[colorIndex];
  const rotations = [-1.2, 0.8, -0.6, 1.4, -0.9, 0.5];
  const rotation = rotations[index % rotations.length];
  return {
    backgroundColor: color.bg,
    color: color.text,
    boxShadow: `4px 4px 12px ${color.shadow}`,
    transform: `rotate(${rotation}deg)`,
  };
}
