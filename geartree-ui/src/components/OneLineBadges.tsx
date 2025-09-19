// src/components/OneLineBadges.tsx
import { Badge } from "@mantine/core";
import { useRef, useState, useEffect } from "react";

export interface BadgeItem {
  text: string;
  color: "grape" | "blue" | "yellow" | "red" | "green";
}

interface OneLineBadgesProps {
  items: BadgeItem[];
}

export function OneLineBadges({ items }: OneLineBadgesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Create a shared canvas for text measurement (more efficient than DOM)
  const getCanvas = () => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    return canvasRef.current;
  };

  const measureTextWidth = (text: string, fontSize: string = '14px', fontFamily: string = 'system-ui, sans-serif') => {
    const canvas = getCanvas();
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    
    ctx.font = `${fontSize} ${fontFamily}`;
    return ctx.measureText(text).width;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) {
      setVisibleCount(items.length);
      return;
    }

    const calculateVisibleBadges = () => {
      const containerWidth = container.offsetWidth;
      if (containerWidth === 0) return;

      let totalWidth = 0;
      let count = 0;
      const gap = 8; // 0.5rem gap
      const badgePadding = 16; // Approximate badge padding (8px each side)
      const badgeBorderRadius = 4; // Additional space for rounded corners

      for (let i = 0; i < items.length; i++) {
        const textWidth = measureTextWidth(items[i].text);
        const badgeWidth = textWidth + badgePadding + badgeBorderRadius;
        const proposedWidth = totalWidth + badgeWidth + (i > 0 ? gap : 0);

        if (proposedWidth <= containerWidth) {
          totalWidth = proposedWidth;
          count = i + 1;
        } else {
          break;
        }
      }

      setVisibleCount(count);
    };

    // Debounced calculation to avoid excessive calls
    let timeoutId: NodeJS.Timeout;
    const debouncedCalculate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateVisibleBadges, 50);
    };

    // Initial calculation
    calculateVisibleBadges();

    // Use ResizeObserver for container size changes
    const resizeObserver = new ResizeObserver(debouncedCalculate);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        gap: "0.5rem",
        overflow: "hidden",
        marginTop: "0.2rem",
        marginBottom: "0.4rem",
        width: "100%",
      }}
    >
      {items.slice(0, visibleCount).map((item, idx) => (
        <Badge
          key={`${item.text}-${idx}`}
          color={item.color}
          variant="light"
          style={{ 
            flexShrink: 0,
            whiteSpace: "nowrap"
          }}
        >
          {item.text}
        </Badge>
      ))}
    </div>
  );
}