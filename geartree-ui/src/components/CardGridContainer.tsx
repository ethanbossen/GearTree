// src/components/CardGridContainer.tsx
import type { ReactNode } from "react";

interface CardGridContainerProps {
  children: ReactNode;
}

export default function CardGridContainer({ children }: CardGridContainerProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3 auto-rows-fr">
      {children}
    </div>
  );
}
