// src/components/admin/ArtistsTab.tsx
import { useEffect, useState } from "react";
import { Text, Stack, Group, Button, Card } from "@mantine/core";
import { Artists } from "../../api";
import type { Artist } from "../../api";
import CreateArtistButton from "./CreateArtistButton";

// New dual-edit buttons
function EditArtistButtons({ artist }: { artist: Artist }) {
  return (
    <div className="flex gap-2">
      <Button size="xs">Edit Scalars</Button>
      <Button size="xs">Edit Relations</Button>
    </div>
  );
}

function ArtistsTab() {
  const [artists, setArtists] = useState<Artist[]>([]);

  const loadArtists = async () => {
    try {
      const data = await Artists.list();
      setArtists(data);
    } catch (err) {
      console.error("Failed to load artists", err);
    }
  };

  useEffect(() => {
    loadArtists();
  }, []);

  return (
    <Stack gap="md">
      <Text size="xl" fw={700}>
        Artists Admin
      </Text>

      <CreateArtistButton onCreated={loadArtists} />

      <Stack>
        {artists.map((artist) => (
          <Card key={artist.id} withBorder shadow="sm" padding="md">
            <Group justify="space-between">
              <div>
                <Text fw={500}>{artist.name}</Text>
                <Text size="sm" c="dimmed">
                  {artist.bands.join(", ")}
                </Text>
              </div>
              <EditArtistButtons artist={artist} />
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

export default ArtistsTab;
