// src/components/admin/CreateAmpButton.tsx
import { useState } from "react";
import {
  Button,
  Modal,
  Stack,
  TextInput,
  NumberInput,
  Checkbox,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Amps } from "../../api";

const emptyForm = {
  name: "",
  photoName: "",
  description: "",
  summary: "",
  isTube: false,
  gainStructure: "",
  yearStart: undefined as number | undefined,
  yearEnd: undefined as number | undefined,
  PriceStart: undefined as number | undefined,
  PriceEnd: undefined as number | undefined,
  wattage: undefined as number | undefined,
  speakerConfiguration: "",
  manufacturer: "",
  otherPhotos: [] as string[],
};

interface CreateAmpButtonProps {
    onCreated?: () => void;
}

function CreateAmpButton({ onCreated }: CreateAmpButtonProps) {
  const [opened, setOpened] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        photoUrl: `/images/amps/${form.photoName}`,
      };
      delete (payload as any).photoName;

      await Amps.create(payload);
      setOpened(false);
      setForm({ ...emptyForm });

      if (onCreated) onCreated();
    } catch (err) {
        notifications.show({
            title: "Error",
            message: `Failed to create amplifer: ${(err as Error).message}`,
            color: "red",
        });
    }
  };

  return (
    <>
      <Button className="bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-light)]" onClick={() => setOpened(true)}>Create New Amplifier</Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create Amplifier"
        size="lg"
      >
        <Stack>
          <TextInput
            label="Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.currentTarget.value)}
          />
          <TextInput
            label="Photo filename"
            placeholder="e.g. fender-twin.jpg (no path)"
            value={form.photoName}
            onChange={(e) => handleChange("photoName", e.currentTarget.value)}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.currentTarget.value)}
          />
          <Textarea
            label="Summary"
            value={form.summary}
            onChange={(e) => handleChange("summary", e.currentTarget.value)}
          />
          <Checkbox
            label="Tube amplifier"
            checked={form.isTube}
            onChange={(e) => handleChange("isTube", e.currentTarget.checked)}
          />
          <TextInput
            label="Gain Structure"
            value={form.gainStructure}
            onChange={(e) => handleChange("gainStructure", e.currentTarget.value)}
          />
          <NumberInput
            label="Year Start"
            value={form.yearStart}
            onChange={(val) => handleChange("yearStart", val ?? undefined)}
          />
          <NumberInput
            label="Year End (optional)"
            value={form.yearEnd}
            onChange={(val) => handleChange("yearEnd", val ?? undefined)}
          />
          <NumberInput
            label="Price Start"
            value={form.PriceStart}
            onChange={(val) => handleChange("PriceStart", val ?? undefined)}
          />
          <NumberInput
            label="Price End"
            value={form.PriceEnd}
            onChange={(val) => handleChange("PriceEnd", val ?? undefined)}
          />
          <NumberInput
            label="Wattage"
            value={form.wattage}
            onChange={(val) => handleChange("wattage", val ?? undefined)}
          />
          <TextInput
            label="Speaker Configuration"
            value={form.speakerConfiguration}
            onChange={(e) =>
              handleChange("speakerConfiguration", e.currentTarget.value)
            }
          />
          <TextInput
            label="Manufacturer"
            value={form.manufacturer}
            onChange={(e) => handleChange("manufacturer", e.currentTarget.value)}
          />

          <Button onClick={handleSubmit}>Save</Button>
        </Stack>
      </Modal>
    </>
  );
}

export default CreateAmpButton;
