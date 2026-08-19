export function getScrollVideoProgress(scrollY: number, sectionTop: number, scrollSpan: number) {
  if (!Number.isFinite(scrollSpan) || scrollSpan <= 0) return 0;
  return Math.min(Math.max((scrollY - sectionTop) / scrollSpan, 0), 1);
}

export function getScrollVideoTime(duration: number, progress: number) {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  return duration * Math.min(Math.max(progress, 0), 1);
}
