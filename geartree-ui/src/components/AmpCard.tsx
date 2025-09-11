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
        className="flex flex-col h-[50%] min-h-[380px]"
      >
        <Card.Section>
          <Image src={photoUrl} alt={name} height={200} fit="cover" />
        </Card.Section>

        <Text fw={700} size="lg" mt="md">
          {name}
        </Text>

        <Text size="sm" c="dimmed" lineClamp={3} className="min-h-60px">
          {summary}
        </Text>
      </Card>
    </Link>
  );
}

export default AmpCard;
