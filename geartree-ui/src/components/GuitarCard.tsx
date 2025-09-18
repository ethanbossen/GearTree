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

  const items: string[] = [
    ...pickups,
    ...genres,
    PriceStart != null && PriceStart > 0
      ? `~$${PriceStart}${PriceEnd != null && PriceEnd > PriceStart ? ` - $${PriceEnd}` : ""}`
      : null,
  ].filter((i): i is string => i !== null); // type guard

  // Measure after render
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    let widthUsed = 0;
    let lastVisibleIndex = -1;
    const containerWidth = container.offsetWidth;

    children.forEach((child, idx) => {
      const style = getComputedStyle(child);
      const marginRight = parseFloat(style.marginRight);
      const childWidth = child.offsetWidth + marginRight;
      widthUsed += childWidth;
      if (widthUsed <= containerWidth) lastVisibleIndex = idx;
    });

    setVisibleCount(lastVisibleIndex + 1);
  }, [items]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => setVisibleCount(0); // trigger re-measure
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: "inline-flex",
        gap: "0.5rem",
        overflow: "hidden",
        marginTop: "0.2rem",
        marginBottom: "0.4rem",
      }}
    >
      {items.map((item, idx) => (
        <Badge
          key={item?.toString() ?? idx}
          color={pickups.includes(item) ? "grape" : genres.includes(item) ? "blue" : "yellow"}
          variant="light"
          style={{ display: idx < visibleCount ? "inline-block" : "none" }}
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
                : "0.5rem", // add top padding only if no badges
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
                    : "0.1rem", // tighter spacing if no badges
              }}
            >
              {type && <span>{type}</span>}
              {type && yearStart && " • "}
              {yearStart && <span>{yearStart}{yearEnd ? `–${yearEnd}` : " - Present"}</span>}
            </Text>
          )}

          {/* One-line dynamic badges */}
          {(pickups?.length || genres?.length || (PriceStart != null && PriceStart > 0)) && (
            <OneLineBadges
              pickups={pickups}
              genres={genres}
              PriceStart={PriceStart}
              PriceEnd={PriceEnd}
            />
          )}

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
                    : "0", // tighter gap if no badges
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
