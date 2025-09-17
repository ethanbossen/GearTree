// src/components/admin/AmpsTab.tsx
import { useEffect, useState } from "react";
import { Text, Stack, Group, Button, Card } from "@mantine/core";
import { Amps } from "../../api";
import type { Amplifier } from "../../api";
import CreateAmpButton from "./CreateAmpButton";
import { EditScalarsButton } from "./EditScalarsButton";

const patchAmpScalars = async (updatedAmp: Amplifier): Promise<void> => {
  const { id, ...scalars } = updatedAmp;
  if (!id) throw new Error("Amp ID is missing");
  await Amps.patch(id, scalars);
};

// Placeholder for edit button component
function EditAmpButtons({
  amp,
  onSaved,
}: {
  amp: Amplifier;
  onSaved: () => void;
}) {
  return (
    <div className="flex gap-2">
      <EditScalarsButton
        item={amp}
        onSave={patchAmpScalars}
        scalarFields={[
          "name",
          "manufacturer",
          "description",
          "summary",
          "isTube",
          "gainStructure",
          "yearStart",
          "yearEnd",
          "priceStart",
          "priceEnd",
          "wattage",
          "speakerConfiguration",
        ]}
        onSaved={onSaved} 
      />
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
              <EditAmpButtons amp={amp} onSaved={loadAmps} />
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

export default AmpsTab;
