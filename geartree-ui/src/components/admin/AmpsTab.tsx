// src/components/admin/AmpsTab.tsx
import { useEffect, useState } from "react";
import { Text, Stack, Group, Card } from "@mantine/core";
import { Amps } from "../../api";
import type { Amplifier } from "../../api";
import CreateAmpButton from "./CreateAmpButton";
import { EditScalarsButton } from "./EditScalarsButton";
import { EditRelationsButton } from "./EditRelationsButton";

function AmpsTab() {
  const [amps, setAmps] = useState<Amplifier[]>([]);
  const [allAmps, setAllAmps] = useState<Amplifier[]>([]);

  const loadAmps = async () => {
    try {
      const data = await Amps.list();
      setAmps(data);
      setAllAmps(data); // store full list for relations
    } catch (err) {
      console.error("Failed to load amps", err);
    }
  };

  useEffect(() => {
    loadAmps();
  }, []);

  // Patch helper for scalars
  const patchAmpScalars = async (updatedAmp: Amplifier): Promise<void> => {
    const { id, ...scalars } = updatedAmp;
    if (!id) throw new Error("Amp ID is missing");
    await Amps.patch(id, scalars);
  };

  // Dual edit buttons for an amp
  function EditAmpButtons({ amp }: { amp: Amplifier }) {
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
          onSaved={loadAmps}
        />
        <EditRelationsButton
          itemId={amp.id}
          currentRelations={amp.relatedAmps.map((r) => ({ id: r.id, name: r.name }))}
          options={allAmps
            .filter((a) => a.id !== amp.id)
            .map((a) => ({ id: a.id, name: a.name }))}
          onAdd={Amps.addRelated}
          onSaved={loadAmps}
        />
      </div>
    );
  }

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
              <EditAmpButtons amp={amp} />
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

export default AmpsTab;
