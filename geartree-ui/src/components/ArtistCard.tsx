import { Card, Text, Image } from "@mantine/core";
import { Link } from "react-router-dom";

interface ArtistCardProps {
  id: number;
  name: string;
  summary: string;
  photoUrl: string;
}

export default function ArtistCard({ id, name, summary, photoUrl }: ArtistCardProps) {
  return (
    <Link to={`/artists/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{
          height: "100%",         
          minHeight: 380,          
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card.Section>
          <Image src={photoUrl} alt={name} height={200} fit="cover" />
        </Card.Section>

        <Text fw={700} size="lg" mt="md">
          {name}
        </Text>

        <Text
          size="sm"
          c="dimmed"
          lineClamp={3}
          style={{ flexGrow: 1 }} 
        >
          {summary}
        </Text>
      </Card>
    </Link>
  );
}
