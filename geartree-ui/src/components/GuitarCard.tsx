// src/components/GuitarCard.tsx
import { Link } from "react-router-dom";
import { Card, Image, Text, Badge } from "@mantine/core";
import { useRef, useState, useEffect } from "react";

interface GuitarCardProps {
  id: number;
  name: string;
  photoUrl: string;
  summary?: string;
  type?: string;
  manufacturer?: string;
  yearStart?: number;
  yearEnd?: number | null;
  pickups?: string[];
  PriceStart?: number;
  PriceEnd?: number;
  genres?: string[];
}

// --- OneLineBadges component ---
function OneLineBadges({
  pickups = [],
  genres = [],
  PriceStart,
  PriceEnd,
}: {
  pickups?: string[];
  genres?: string[];
  PriceStart?: number;
  PriceEnd?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const items: string[] = [
    ...pickups,
    ...genres,
    PriceStart != null && PriceStart > 0
      ? `~$${PriceStart}${PriceEnd != null && PriceEnd > PriceStart ? ` - $${PriceEnd}` : ""}`
      : null,
  ].filter((i): i is string => i !== null);

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
        const textWidth = measureTextWidth(items[i]);
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
          key={`${item}-${idx}`}
          color={pickups.includes(item) ? "grape" : genres.includes(item) ? "blue" : "yellow"}
          variant="light"
          style={{ 
            flexShrink: 0,
            whiteSpace: "nowrap"
          }}
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}

// --- GuitarCard component ---
export default function GuitarCard({
  id,
  name,
  photoUrl,
  summary,
  type,
  yearStart,
  yearEnd,
  pickups,
  PriceStart,
  PriceEnd,
  genres,
}: GuitarCardProps) {
  return (
    <Link
      to={`/guitars/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card
        shadow="sm"
        radius="md"
        withBorder
        style={{
          display: "flex",
          flexDirection: "column",
          height: 400,
        }}
      >
        {/* Image wrapper */}
        <div style={{ flex: "7 1 0%", overflow: "hidden" }}>
          <Image
            src={photoUrl}
            alt={name}
            fit="cover"
            style={{ width: "100%", height: "100%", objectPosition: "center" }}
          />
        </div>

        {/* Content wrapper */}
        <div
          style={{
            flex: "3 1 0%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            paddingTop:
              pickups?.length || genres?.length || (PriceStart != null && PriceStart > 0)
                ? "0"
                : "0.5rem",
            minWidth: 0,
          }}
        >
          {/* Title */}
          <Text fw={700} size="xl" lineClamp={1}>
            {name}
          </Text>

          {/* Type and Year on same line with dot separator */}
          {(type || yearStart) && (
            <Text
              size="sm"
              c="dimmed"
              style={{
                marginTop:
                  pickups?.length || genres?.length || (PriceStart != null && PriceStart > 0)
                    ? "0.2rem"
                    : "0.1rem",
              }}
            >
              {type && <span>{type}</span>}
              {type && yearStart && " • "}
              {yearStart && <span>{yearStart}{yearEnd ? `–${yearEnd}` : " - Present"}</span>}
            </Text>
          )}

          {/* One-line dynamic badges */}
          <OneLineBadges
            pickups={pickups}
            genres={genres}
            PriceStart={PriceStart}
            PriceEnd={PriceEnd}
          />

          {/* Summary */}
          {summary && (
            <Text
              size="sm"
              c="gray.7"
              lineClamp={2}
              style={{
                marginTop:
                  pickups?.length || genres?.length || (PriceStart != null && PriceStart > 0)
                    ? "0.25rem"
                    : "0",
              }}
            >
              {summary}
            </Text>
          )}
        </div>
      </Card>
    </Link>
  );
}