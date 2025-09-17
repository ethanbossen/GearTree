// src/components/AmpCardDetailed.tsx
import { Card, Image, Text, Badge, Group, Stack } from "@mantine/core";
import { Link } from "react-router-dom";
import type { Amplifier } from "../api";

interface AmpCardDetailedProps extends Amplifier {}

function AmpCardDetailed({
  id,
  name,
  photoUrl,
  summary,
  isTube,
  gainStructure,
  yearStart,
  yearEnd,
  wattage,
  speakerConfiguration,
  manufacturer,
  priceStart,
  priceEnd,
}: AmpCardDetailedProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="flex flex-col h-full"
    >
<Card.Section>
  <Link to={`/amplifiers/${id}`}>
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

      <Stack gap="xs" className="flex-1 justify-between mt-4">
        {/* Title */}
        <Link
          to={`/amplifiers/${id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Text fw={700} size="lg" lineClamp={1}>
            {name}
          </Text>
        </Link>

        {/* Badges row */}
        <Group gap="xs" wrap="wrap">
          <Badge color={isTube ? "red" : "blue"} variant="light">
            {isTube ? "Tube" : "Solid-State"}
          </Badge>
          {gainStructure && (
            <Badge color="grape" variant="light">
              {gainStructure}
            </Badge>
          )}
          {wattage > 0 && (
            <Badge color="green" variant="light">
              {wattage}W
            </Badge>
          )}
          {priceStart != null && priceStart> 0 && (
            <Badge color="yellow" variant="light">
              ~${priceStart}
              {priceEnd != null && priceEnd > priceStart ? ` - $${priceEnd}` : ""}
            </Badge>
          )}
        </Group>

        {/* Manufacturer / Years */}
        <Text size="sm" c="dimmed">
          {manufacturer} • {yearStart} - {yearEnd || "Present"}
        </Text>

        {/* Speaker config */}
        {speakerConfiguration && (
          <Text size="sm" c="dimmed">
            {speakerConfiguration}
          </Text>
        )}

        {/* Summary (2-line clamp, fixed height) */}
        <Text size="sm" c="gray.7" lineClamp={2} className="min-h-[2rem]">
          {summary}
        </Text>
      </Stack>
    </Card>
  );
}

export default AmpCardDetailed;
