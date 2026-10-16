"use client";

import type { ReactNode } from "react";
import { useLegalContentTransition } from "./useLegalContentTransition";

export default function LegalContentTransition({ children }: { children: ReactNode }) {
  const { containerRef } = useLegalContentTransition();

  return (
    <div ref={containerRef} className="opacity-0">
      {children}
    </div>
  );
}
