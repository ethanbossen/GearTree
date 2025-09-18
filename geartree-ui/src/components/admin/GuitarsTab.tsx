// src/components/admin/GuitarsTab.tsx
import { useEffect, useState } from "react";
import { Text, Stack, Group, Card } from "@mantine/core";
import { Guitars } from "../../api";
import type { Guitar } from "../../api";
import CreateGuitarButton from "./CreateGuitarButton";
import { EditScalarsButton } from "./EditScalarsButton";
import { EditRelationsButton } from "./EditRelationsButton";

function GuitarsTab() {
  const [guitars, setGuitars] = useState<Guitar[]>([]);
  const [allGuitars, setAllGuitars] = useState<Guitar[]>([]);

  const loadGuitars = async () => {
    try {
      const data = await Guitars.list();
      setGuitars(data);
      setAllGuitars(data); // store full list for relations
    } catch (err) {
      console.error("Failed to load guitars", err);
    }
  };

  useEffect(() => {
    loadGuitars();
  }, []);

  // Patch helper for scalars
  const patchGuitarScalars = async (updatedGuitar: Guitar) => {
    const { id, ...scalars } = updatedGuitar;
    if (!id) throw new Error("Guitar ID is missing");
    await Guitars.patch(id, scalars);
  };

  // Dual edit buttons for a guitar
  function EditGuitarButtons({
    guitar,
  }: {
    guitar: Guitar;
  }) {
    return (
      <div className="flex gap-2">
        <EditScalarsButton
          item={guitar}
          onSave={patchGuitarScalars}
          scalarFields={[
            "name",
            "type",
            "description",
            "summary",
            "yearStart",
            "yearEnd",
            "genres",
            "pickups",
          ]}
          onSaved={loadGuitars}
        />
        <EditRelationsButton
          itemId={guitar.id}
          currentRelations={guitar.relatedGuitars.map((r) => ({
            id: r.id,
            name: r.name,
          }))}
          options={allGuitars
            .filter((g) => g.id !== guitar.id)
            .map((g) => ({ id: g.id, name: g.name }))}
          onAdd={Guitars.addRelated}
          onSaved={loadGuitars}
        />
      </div>
    );
  }

  return (
    <Stack gap="md">
      <Text className="pt-2" size="xl" fw={700}>
        Guitars Admin
      </Text>

      <CreateGuitarButton onCreated={loadGuitars} />

      <Stack>
        {guitars.map((guitar) => (
          <Card key={guitar.id} withBorder shadow="sm" padding="md">
            <Group justify="space-between">
              <div>
                <Text fw={500}>{guitar.name}</Text>
                <Text size="sm" c="dimmed">
                  {guitar.type} • {guitar.yearStart}
                  {guitar.yearEnd ? `–${guitar.yearEnd}` : ""}
                </Text>
              </div>
              <EditGuitarButtons guitar={guitar} />
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

export default GuitarsTab;
