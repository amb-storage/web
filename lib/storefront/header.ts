export type HeaderScrollState = "expanded" | "compact";

export function getHeaderScrollState(scrollY: number): HeaderScrollState {
  return scrollY > 64 ? "compact" : "expanded";
}
