// src/components/CardGridContainer.tsx
import { ReactNode } from "react";
import React from "react";

interface CardGridContainerProps {
  children: ReactNode;
  columns?: number; // default 3, but flexible
}

export default function CardGridContainer({
  children,
  columns = 3,
}: CardGridContainerProps) {
  return (
    <div className={`grid gap-6 md:grid-cols-${columns} auto-rows-fr`}>
      {children}
    </div>
  );
}
    