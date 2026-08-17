export function getBoundedPptPageIndex(index: number, totalPages: number): number {
  if (!Number.isFinite(totalPages) || totalPages <= 0) return 0;
  const normalized = Number.isFinite(index) ? Math.trunc(index) : 0;
  return Math.min(Math.max(normalized, 0), totalPages - 1);
}

export type PptPageLoadState = "loading" | "ready" | "error";

export function initializePptPageLoadStates(
  currentStates: Record<number, PptPageLoadState>,
  totalPages: number,
): Record<number, PptPageLoadState> {
  const states = { ...currentStates };
  if (!Number.isFinite(totalPages) || totalPages <= 0) return states;

  for (let index = 0; index < totalPages; index += 1) {
    if (!states[index]) states[index] = "loading";
  }

  return states;
}
