// src/components/admin/CreateGuitarButton.tsx
import { useState } from "react";
import {
  Button,
  Modal,
  Stack,
  TextInput,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { Guitars } from "../../api";

const emptyForm = {
  name: "",
  photoName: "",
  description: "",
  summary: "",
  type: "",
  genres: [] as string[],
  pickups: [] as string[],
  yearStart: undefined as number | undefined,
  yearEnd: undefined as number | undefined,
  otherPhotos: [] as string[],
};

interface CreateGuitarButtonProps {
  onCreated?: () => void;
}

function CreateGuitarButton({ onCreated }: CreateGuitarButtonProps) {
  const [opened, setOpened] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        photoUrl: `/images/guitars/${form.photoName}.jpg`,
      };
      delete (payload as any).photoName;

      await Guitars.create(payload);
      alert("Guitar created!");
      setOpened(false);
      setForm({ ...emptyForm });

      if (onCreated) onCreated();
    } catch (err) {
      alert("Failed to create guitar: " + (err as Error).message);
    }
  };

  return (
    <>
      <Button className="bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-light)]" onClick={() => setOpened(true)}>Create New Guitar</Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create Guitar"
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
            placeholder="e.g. stratocaster (no path, no extension)"
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
          <TextInput
            label="Type"
            value={form.type}
            onChange={(e) => handleChange("type", e.currentTarget.value)}
          />
          <TextInput
            label="Genres (comma-separated)"
            value={form.genres.join(", ")}
            onChange={(e) =>
              handleChange(
                "genres",
                e.currentTarget.value.split(",").map((g) => g.trim())
              )
            }
          />
          <TextInput
            label="Pickups (comma-separated)"
            value={form.pickups.join(", ")}
            onChange={(e) =>
              handleChange(
                "pickups",
                e.currentTarget.value.split(",").map((p) => p.trim())
              )
            }
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

          <Button onClick={handleSubmit}>Save</Button>
        </Stack>
      </Modal>
    </>
  );
}

export default CreateGuitarButton;
