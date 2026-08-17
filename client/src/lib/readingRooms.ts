export const readingRooms = [
  {
    id: "herb",
    order: 1,
    title: "药研笔记",
    target: "#path",
  },
  {
    id: "ai",
    order: 2,
    title: "AI 工坊",
    target: "#ai-work",
  },
  {
    id: "editorial",
    order: 3,
    title: "表达与策展",
    target: "#ppt-archive",
  },
] as const;

export function isReadingRoomTarget(target: string): boolean {
  return /^#[a-z][a-z0-9-]*$/i.test(target);
}
