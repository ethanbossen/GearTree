// src/components/GuitarCard.tsx
import { Link } from "react-router-dom";
import { Card, Image, Text, Badge, Group, Stack } from "@mantine/core";

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
  priceStart?: number;
  priceEnd?: number;
  genres?: string[];
}

export default function GuitarCard({
  id,
  name,
  photoUrl,
  summary,
  type,
  manufacturer,
  yearStart,
  yearEnd,
  pickups,
  priceStart,
  priceEnd,
  genres,
}: GuitarCardProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="flex flex-col h-full"
    >
      {/* Image */}
      <Card.Section>
        <Link to={`/guitars/${id}`}>
          <div className="h-[200px] w-full overflow-hidden">
            <Image
              src={photoUrl}
              alt={name}
              fit="cover"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </Link>
      </Card.Section>

      {/* Content */}
      <Stack gap="xs" className="flex-1 justify-between mt-4">
        {/* Title */}
        <Link
          to={`/guitars/${id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Text fw={700} size="lg" lineClamp={1}>
            {name}
          </Text>
        </Link>

        {/* Type / Years */}
{type && (
  <Text size="sm" c="dimmed">
    {type}
  </Text>
)}

{yearStart && (
  <Text size="sm" c="dimmed">
    {yearStart} – {yearEnd || "Present"}
  </Text>
)}


        {/* Badges row */}
        <Group gap="xs" wrap="wrap">
          {pickups &&
            pickups.map((p, idx) => (
              <Badge key={idx} color="grape" variant="light">
                {p}
              </Badge>
            ))}
          {genres &&
            genres.map((g, idx) => (
              <Badge key={idx} color="blue" variant="light">
                {g}
              </Badge>
            ))}
          {priceStart != null && priceStart > 0 && (
            <Badge color="yellow" variant="light">
              ~${priceStart}
              {priceEnd != null && priceEnd > priceStart
                ? ` - $${priceEnd}`
                : ""}
            </Badge>
          )}
        </Group>

        {/* Summary */}
        {summary && (
          <Text size="sm" c="gray.7" lineClamp={2} className="min-h-[2rem]">
            {summary}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
