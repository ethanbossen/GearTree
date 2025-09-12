import { Card, Text, Image } from "@mantine/core";
import { Link } from "react-router-dom";

interface ArtistCardProps {
  id: number;
  name: string;
  summary: string | null;
  photoUrl: string | null;
}

export default function ArtistCard({ id, name, summary, photoUrl }: ArtistCardProps) {
  return (
    <Link
      to={`/artists/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card
        shadow="sm"
        radius="md"
        withBorder
        style={{
          height: 400, 
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image wrapper enforces 70% */}
        <div style={{ flex: "0 0 70%", overflow: "hidden" }}>
          <Image
            src={photoUrl}
            alt={name}
            fit="cover"
            style={{ width: "100%", height: "100%", objectPosition: "top" }}
          />
        </div>

        {/* Text wrapper enforces 30% */}
        <div
          style={{
            flex: "0 0 30%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: "0.5rem",
          }}
        >
          <Text fw={700} size="lg" lineClamp={1}>
            {name}
          </Text>

          <Text size="sm" c="dimmed" lineClamp={2}>
            {summary}
          </Text>
        </div>
      </Card>
    </Link>
  );
}
