// src/components/EntityCard.tsx
import { Card, Text, Image } from "@mantine/core";
import { Link } from "react-router-dom";

interface EntityCardProps {
  id: number | string;
  name: string;
  summary?: string | null;
  photoUrl?: string | null;
  basePath: string;          // "artists" | "amplifiers" | "guitars"
  height?: number;           // card height, default 400
  imageFlex?: number;        // image height % of card, default 70
  summaryLineClamp?: number; // default 2
}

export default function EntityCard({
  id,
  name,
  summary,
  photoUrl,
  basePath,
  height = 400,
  imageFlex = 70,
  summaryLineClamp = 2,
}: EntityCardProps) {
  const textFlex = 100 - imageFlex;

  return (
    <Link to={`/${basePath}/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <Card
        shadow="sm"
        radius="md"
        withBorder
        style={{
          height,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image section */}
        <div style={{ flex: `0 0 ${imageFlex}%`, overflow: "hidden" }}>
          {photoUrl && (
            <Image
              src={photoUrl}
              alt={name}
              fit="cover"
              style={{ width: "100%", height: "100%", objectPosition: "top" }}
            />
          )}
        </div>

        {/* Text section */}
        <div
          style={{
            flex: `0 0 ${textFlex}%`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: "0.5rem",
          }}
        >
          <Text fw={700} size="xl" lineClamp={1}>
            {name}
          </Text>

          {summary && (
            <Text size="sm" c="dimmed" lineClamp={summaryLineClamp}>
              {summary}
            </Text>
          )}
        </div>
      </Card>
    </Link>
  );
}
