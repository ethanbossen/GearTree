// src/components/admin/AmpsTab.tsx
import { useEffect, useState } from "react";
import { Text, Stack, Group, Button, Card } from "@mantine/core";
import { Amps } from "../../api";
import type { Amplifier } from "../../api";
import CreateAmpButton from "./CreateAmpButton";

// Placeholder for edit button component
function EditAmpButton({ amp }: { amp: Amplifier }) {
  return (
  <div className="flex gap-2">
    <Button size="xs">Edit Scalars</Button>
    <Button size="xs">Edit Relations</Button>
  </div>  
    );
}

function AmpsTab() {
  const [amps, setAmps] = useState<Amplifier[]>([]);

  const loadAmps = async () => {
    try {
      const data = await Amps.list();
      setAmps(data);
    } catch (err) {
      console.error("Failed to load amps", err);
    }
  };

  useEffect(() => {
    loadAmps();
  }, []);

  return (
    <Stack gap="md">
      <Text size="xl" fw={700}>
        Amplifiers Admin
      </Text>

      <CreateAmpButton onCreated={loadAmps} />

      <Stack>
        {amps.map((amp) => (
          <Card key={amp.id} withBorder shadow="sm" padding="md">
            <Group justify="space-between">
              <div>
                <Text fw={500}>{amp.name}</Text>
                <Text size="sm" c="dimmed">
                  {amp.manufacturer} • {amp.yearStart}
                  {amp.yearEnd ? `–${amp.yearEnd}` : ""}
                </Text>
              </div>
              <EditAmpButton amp={amp} />
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

export default AmpsTab;
