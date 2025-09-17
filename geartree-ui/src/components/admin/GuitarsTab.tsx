// src/components/admin/GuitarsTab.tsx
import { useEffect, useState } from "react";
import { Text, Stack, Group, Button, Card } from "@mantine/core";
import { Guitars } from "../../api";
import type { Guitar } from "../../api";
import CreateGuitarButton from "./CreateGuitarButton";

// Dual edit buttons for each guitar
function EditGuitarButtons({ guitar }: { guitar: Guitar }) {
  return (
    <div className="flex gap-2">
      <Button size="xs">Edit Scalars</Button>
      <Button size="xs">Edit Relations</Button>
    </div>
  );
}

function GuitarsTab() {
  const [guitars, setGuitars] = useState<Guitar[]>([]);

  const loadGuitars = async () => {
    try {
      const data = await Guitars.list();
      setGuitars(data);
    } catch (err) {
      console.error("Failed to load guitars", err);
    }
  };

  useEffect(() => {
    loadGuitars();
  }, []);

  return (
    <Stack gap="md">
      <Text size="xl" fw={700}>
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
