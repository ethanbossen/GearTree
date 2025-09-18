// src/components/admin/AmpsTab.tsx
import { useEffect, useState, useCallback } from "react";
import { Text, TextInput, Stack, Group, Card } from "@mantine/core";
import { Amps } from "../../api";
import type { Amplifier } from "../../api";
import CreateAmpButton from "./CreateAmpButton";
import { EditScalarsButton } from "./EditScalarsButton";
import { EditRelationsButton } from "./EditRelationsButton";

// Patch amp scalars helper
const patchAmpScalars = async (updatedAmp: Amplifier) => {
  const { id, ...scalars } = updatedAmp;
  if (!id) throw new Error("Amp ID is missing");
  await Amps.patch(id, scalars);
};

function AmpsTab() {
  const [amps, setAmps] = useState<Amplifier[]>([]);
  const [allAmps, setAllAmps] = useState<Amplifier[]>([]);
  const [search, setSearch] = useState("");

  // Load amps from API
  const loadAmps = useCallback(async () => {
    try {
      const data = await Amps.list();
      setAmps(data);
      setAllAmps(data);
    } catch (err) {
      console.error("Failed to load amps", err);
    }
  }, []);

  useEffect(() => {
    loadAmps();
  }, [loadAmps]);

  const filteredAmps = amps.filter((amp) =>
    amp.name.toLowerCase().includes(search.toLowerCase())
  );

  // Dual edit buttons component
  const EditAmpButtons = ({ amp }: { amp: Amplifier }) => {
    const relationOptions = allAmps
      .filter((a) => a.id !== amp.id)
      .map((a) => ({ id: a.id, name: a.name }));

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
          currentRelations={amp.relatedAmps.map(({ id, name }) => ({ id, name }))}
          options={relationOptions}
          onAdd={Amps.addRelated}
          onSaved={loadAmps}
        />
      </div>
    );
  };

  return (
    <Stack gap="md">
      <Text className="pt-2" size="xl" fw={700}>
        Amplifiers Admin
      </Text>

      <CreateAmpButton onCreated={loadAmps} />

      <TextInput
        placeholder="Search amps..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        className="mb-4"
      />

      <Stack>
        {filteredAmps.map((amp) => (
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
