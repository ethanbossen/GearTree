// src/components/shared/ProductCard.tsx
import { Link } from "react-router-dom";
import { Card, Image, Text } from "@mantine/core";
import { OneLineBadges } from "./OneLineBadges";
import type { BadgeItem } from "./OneLineBadges";

export interface ProductCardProps {
  id: number;
  name: string;
  photoUrl: string;
  summary?: string;
  type?: string;
  manufacturer?: string;
  yearStart?: number;
  yearEnd?: number | null;
  priceStart?: number;
  priceEnd?: number;
  badges: BadgeItem[];
  linkPrefix: string; // e.g., "guitars" or "amplifiers"
  height?: number; // Card height in pixels, defaults to 400
  imageRatio?: number; // Image section ratio (flex basis), defaults to 7
  contentRatio?: number; // Content section ratio (flex basis), defaults to 3
  additionalInfo?: string; // Extra info line (like speaker config for amps)
}

function ProductCard({
  id,
  name,
  photoUrl,
  summary,
  type,
  manufacturer,
  yearStart,
  yearEnd,
  badges,
  linkPrefix,
  height = 400,
  imageRatio = 7,
  contentRatio = 3,
  additionalInfo,
}: ProductCardProps) {

  return (
    <Link
      to={`/${linkPrefix}/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card
        shadow="sm"
        radius="md"
        withBorder
        style={{
          display: "flex",
          flexDirection: "column",
          height,
        }}
      >
        {/* Image wrapper */}
        <div style={{ flex: `${imageRatio} 1 0%`, overflow: "hidden" }}>
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
            flex: `${contentRatio} 1 0%`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            minWidth: 0,
          }}
        >
          {/* Title */}
          <Text fw={700} size="xl" lineClamp={1}>
            {name}
          </Text>

{/* Type/Manufacturer, Year, and Additional Info */}
{(type || manufacturer || yearStart || additionalInfo) && (
  <Text
    size="sm"
    c="dimmed"
    style={{
      marginTop: "0.2rem",
    }}
  >
    {(type || manufacturer) && <span>{type || manufacturer}</span>}
    {(type || manufacturer) && yearStart && " • "}
    {yearStart && (
      <span>
        {yearStart}
        {yearEnd ? `–${yearEnd}` : " - Present"}
      </span>
    )}

    {(type || manufacturer || yearStart) && additionalInfo && " • "}

    {additionalInfo && <span>{additionalInfo}</span>}
  </Text>
)}

          {badges.length > 0 && <OneLineBadges items={badges} />}

          {/* Summary */}
          {summary && (
            <Text
              size="sm"
              c="gray.7"
              lineClamp={2}
              style={{
                marginTop: "0.25rem",
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

export default ProductCard;
