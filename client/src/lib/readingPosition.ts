/**
 * 将保存的阅读位置限制在当前页面可滚动范围内，避免内容高度变化后恢复到无效位置。
 */
export function getRestoredReadingPosition(
  savedPosition: number,
  documentHeight: number,
  viewportHeight: number,
) {
  const maxPosition = Math.max(documentHeight - viewportHeight, 0);
  if (!Number.isFinite(savedPosition)) return 0;
  return Math.min(Math.max(savedPosition, 0), maxPosition);
}
