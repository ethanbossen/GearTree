// src/components/AmpCard.tsx
import { Card, Text, Image } from "@mantine/core";
import { Link } from "react-router-dom";

interface AmpCardProps {
  id: number;
  name: string;
  summary: string;
  photoUrl: string;
}

function AmpCard({ id, name, summary, photoUrl }: AmpCardProps) {
  return (
    <Link
      to={`/amplifiers/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
<Card
  shadow="sm"
  padding="lg"
  radius="md"
  withBorder
  className="flex flex-col h-full w-full" // control overall card ratio
>
  {/* Lock the image section height */}
  <Card.Section className="h-[200px] overflow-hidden">
    <img
      src={photoUrl}
      alt={name}
      className="w-full h-full object-cover" // force-fit inside container
    />
  </Card.Section>

  {/* Text content */}
  <div className="flex flex-col flex-grow mt-3">
    <Text fw={700} size="lg">
      {name}
    </Text>

    <Text size="sm" c="dimmed" lineClamp={4}>
      {summary}
    </Text>
  </div>
</Card>

    </Link>
  );
}

export default AmpCard;
