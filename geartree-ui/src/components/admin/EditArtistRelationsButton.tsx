// src/components/admin/EditArtistRelationsButton.tsx
import { useState } from "react";
import { Button, Modal, MultiSelect, Stack, Text, Group, Badge } from "@mantine/core";
import type { Relation } from "./EditRelationsButton"; // reuse the interface

interface EditArtistRelationsButtonProps {
  artistId: number;
  currentGuitars: Relation[];
  currentAmps: Relation[];
  allGuitars: Relation[];
  allAmps: Relation[];
  onAddGuitar: (artistId: number, guitarId: number) => Promise<any>;
  onAddAmp: (artistId: number, ampId: number) => Promise<any>;
  onSaved: () => void;
  title?: string;
}

export function EditArtistRelationsButton({
  artistId,
  currentGuitars,
  currentAmps,
  allGuitars,
  allAmps,
  onAddGuitar,
  onAddAmp,
  onSaved,
  title = "Edit Artist Relations",
}: EditArtistRelationsButtonProps) {
  const [opened, setOpened] = useState(false);
  const [selectedGuitars, setSelectedGuitars] = useState<string[]>([]);
  const [selectedAmps, setSelectedAmps] = useState<string[]>([]);

  const handleSave = async () => {
    // Add guitars
    for (const idStr of selectedGuitars) {
      await onAddGuitar(artistId, parseInt(idStr));
    }
    // Add amps
    for (const idStr of selectedAmps) {
      await onAddAmp(artistId, parseInt(idStr));
    }
    setOpened(false);
    setSelectedGuitars([]);
    setSelectedAmps([]);
    onSaved();
  };

  return (
    <>
      <Button size="xs" onClick={() => setOpened(true)}>
        Edit Relations
      </Button>

      <Modal opened={opened} onClose={() => setOpened(false)} title={title} size="lg">
        <Stack>
          {/* Guitars Section */}
          <div>
            <Text fw={500} mb={4}>Guitars</Text>
            <Group wrap="wrap">
              {currentGuitars.length === 0 && <Text c="dimmed">None</Text>}
              {currentGuitars.map((g) => (
                <Badge key={g.id} color="green" variant="light">{g.name}</Badge>
              ))}
            </Group>
            <MultiSelect
              label="Add Guitars"
              placeholder="Select guitars..."
              data={allGuitars
                .filter(g => !currentGuitars.some(c => c.id === g.id))
                .map(g => ({ value: g.id.toString(), label: g.name }))}
              value={selectedGuitars}
              onChange={setSelectedGuitars}
              searchable
              nothingFoundMessage="No matches"
            />
          </div>

          {/* Amps Section */}
          <div>
            <Text fw={500} mb={4}>Amplifiers</Text>
            <Group wrap="wrap">
              {currentAmps.length === 0 && <Text c="dimmed">None</Text>}
              {currentAmps.map((a) => (
                <Badge key={a.id} color="blue" variant="light">{a.name}</Badge>
              ))}
            </Group>
            <MultiSelect
              label="Add Amps"
              placeholder="Select amplifiers..."
              data={allAmps
                .filter(a => !currentAmps.some(c => c.id === a.id))
                .map(a => ({ value: a.id.toString(), label: a.name }))}
              value={selectedAmps}
              onChange={setSelectedAmps}
              searchable
              nothingFound="No matches"
            />
          </div>

          <Button fullWidth onClick={handleSave}>Save</Button>
        </Stack>
      </Modal>
    </>
  );
}
