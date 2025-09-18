// src/components/admin/ArtistsTab.tsx
import { useEffect, useState } from "react";
import { Text, TextInput, Stack, Group, Card } from "@mantine/core";
import { Artists, Guitars, Amps } from "../../api";
import type { Artist, Guitar, Amplifier } from "../../api";
import CreateArtistButton from "./CreateArtistButton";
import { EditScalarsButton } from "./EditScalarsButton";
import { EditArtistRelationsButton } from "./EditArtistRelationsButton";

const patchArtistScalars = async (updatedArtist: Artist): Promise<void> => {
  const { id, ...scalars } = updatedArtist;
  if (!id) throw new Error("Artist ID is missing");
  await Artists.patch(id, scalars);
};

interface EditArtistButtonsProps {
  artist: Artist;
  onSaved: () => void;
  allGuitars: Guitar[];
  allAmps: Amplifier[];
}

function EditArtistButtons({
  artist,
  onSaved,
  allGuitars,
  allAmps,
}: EditArtistButtonsProps) {
  return (
    <div className="flex gap-2">
      <EditScalarsButton
        item={artist}
        onSave={patchArtistScalars}
        scalarFields={["name", "tagline", "description", "summary", "bands"]}
        onSaved={onSaved} 
      />
      <EditArtistRelationsButton
        artistId={artist.id}
        currentGuitars={artist.guitars.map(g => ({ id: g.id, name: g.name }))}
        currentAmps={artist.amplifiers.map(a => ({ id: a.id, name: a.name }))}
        allGuitars={allGuitars.map(g => ({ id: g.id, name: g.name }))}
        allAmps={allAmps.map(a => ({ id: a.id, name: a.name }))}
        onAddGuitar={Artists.addGuitar}
        onAddAmp={Artists.addAmp}
        onSaved={onSaved}
        title="Edit Artist Relations"
      />
    </div>
  );
}

function ArtistsTab() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [allGuitars, setAllGuitars] = useState<Guitar[]>([]);
  const [allAmps, setAllAmps] = useState<Amplifier[]>([]);
  const [search, setSearch] = useState("");

  const loadArtists = async () => {
    try {
      const data = await Artists.list();
      setArtists(data);
    } catch (err) {
      console.error("Failed to load artists", err);
    }
  };

  const loadAllGuitars = async () => {
    try {
      const data = await Guitars.list();
      setAllGuitars(data);
    } catch (err) {
      console.error("Failed to load guitars", err);
    }
  };

  const loadAllAmps = async () => {
    try {
      const data = await Amps.list();
      setAllAmps(data);
    } catch (err) {
      console.error("Failed to load amps", err);
    }
  };

  useEffect(() => {
    loadArtists();
    loadAllGuitars();
    loadAllAmps();
  }, []);

const filteredArtists = artists.filter((artist) =>
  artist.name.toLowerCase().includes(search.toLowerCase())
);

  return (
    <Stack gap="md">
      <Text className="pt-2" size="xl" fw={700}>
        Artists Admin
      </Text>

      <CreateArtistButton onCreated={loadArtists} />

      <TextInput
        placeholder="Search artists..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        className="mb-4"
      />

      <Stack>
        {filteredArtists.map((artist) => (
          <Card key={artist.id} withBorder shadow="sm" padding="md">
            <Group justify="space-between">
              <div>
                <Text fw={500}>{artist.name}</Text>
                <Text size="sm" c="dimmed">{artist.bands.join(", ")}</Text>
              </div>
              <EditArtistButtons
                artist={artist}
                onSaved={loadArtists}
                allGuitars={allGuitars}
                allAmps={allAmps}
              />
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

export default ArtistsTab;
