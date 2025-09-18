// src/components/GuitarCard.tsx
import { Link } from "react-router-dom";
import { Card, Image, Text, Badge, Group } from "@mantine/core";

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
        {/* Image wrapper (flexible 70%) */}
        <div style={{ flex: "7 1 0%", overflow: "hidden" }}>
          <Image
            src={photoUrl}
            alt={name}
            fit="cover"
            style={{ width: "100%", height: "100%", objectPosition: "center" }}
          />
        </div>

        {/* Content wrapper (flexible 30%) */}
        <div
          style={{
            flex: "3 1 0%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem"
          }}
        >
          {/* Top section */}
          <div>
            <Text fw={700} size="xl" lineClamp={1}>
              {name}
            </Text>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.2rem" }}>
              {type && <Text size="sm" c="dimmed">{type}</Text>}
              {yearStart && <Text size="sm" c="dimmed">{yearStart} – {yearEnd || "Present"}</Text>}
            </div>

            <Group gap="xs" wrap="wrap" style={{ marginTop: "0.2rem", marginBottom:"0.4em" }}>
              {pickups?.map((p, idx) => <Badge key={idx} color="grape" variant="light">{p}</Badge>)}
              {genres?.map((g, idx) => <Badge key={idx} color="blue" variant="light">{g}</Badge>)}
              {PriceStart != null && PriceStart > 0 && (
                <Badge color="yellow" variant="light">
                  ~${PriceStart}{PriceEnd != null && PriceEnd > PriceStart ? ` - $${PriceEnd}` : ""}
                </Badge>
              )}
            </Group>
          </div>

          {/* Bottom summary */}
          {summary && (
            <Text size="sm" c="gray.7" lineClamp={2}>
              {summary}
            </Text>
          )}
        </div>
      </Card>
    </Link>
  );
}
