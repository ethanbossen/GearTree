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
    for (const idStr of selectedGuitars) await onAddGuitar(artistId, parseInt(idStr));
    for (const idStr of selectedAmps) await onAddAmp(artistId, parseInt(idStr));
    setOpened(false);
    setSelectedGuitars([]);
    setSelectedAmps([]);
    onSaved();
  };

  return (
    <>
      <Button
        size="xs"
        className="bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-light)] text-white font-semibold"
        onClick={() => setOpened(true)}
      >
        Edit Relations
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Text className="text-2xl font-bold">{title}</Text>}
        size="lg"
      >
        <Stack>
          {/* Guitars Section */}
          <div>
            <Text className="text-[var(--brand-purple)] font-bold mb-2">Guitars</Text>
            <Group wrap="wrap" className="mb-2">
              {currentGuitars.length === 0 && <Text className="text-gray-400">None</Text>}
              {currentGuitars.map((g) => (
                <Badge
                  key={g.id}
                  className="bg-purple-100 text-[var(--brand-purple)]"
                  variant="light"
                >
                  {g.name}
                </Badge>
              ))}
            </Group>
            <MultiSelect
              label="Add Guitars"
              placeholder="Select guitars..."
              data={allGuitars
                .filter((g) => !currentGuitars.some((c) => c.id === g.id))
                .map((g) => ({ value: g.id.toString(), label: g.name }))}
              value={selectedGuitars}
              onChange={setSelectedGuitars}
              searchable
              nothingFoundMessage="No matches"
            />
          </div>

          {/* Amps Section */}
          <div>
            <Text className="text-[var(--brand-purple)] font-bold mb-2">Amplifiers</Text>
            <Group wrap="wrap" className="mb-2">
              {currentAmps.length === 0 && <Text className="text-gray-400">None</Text>}
              {currentAmps.map((a) => (
                <Badge
                  key={a.id}
                  className="bg-purple-100 text-[var(--brand-purple)]"
                  variant="light"
                >
                  {a.name}
                </Badge>
              ))}
            </Group>
            <MultiSelect
              label="Add Amps"
              placeholder="Select amplifiers..."
              data={allAmps
                .filter((a) => !currentAmps.some((c) => c.id === a.id))
                .map((a) => ({ value: a.id.toString(), label: a.name }))}
              value={selectedAmps}
              onChange={setSelectedAmps}
              searchable
              nothingFoundMessage="No matches"
            />
          </div>

          <Button
            fullWidth
            className="bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-light)] text-white font-semibold"
            onClick={handleSave}
          >
            Save
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
