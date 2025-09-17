// src/components/admin/CreateArtistButton.tsx
import { useState } from "react";
import {
  Button,
  Modal,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { Artists } from "../../api";

const emptyForm = {
  name: "",
  photoName: "",
  heroPhotoName: "",
  tagline: "",
  description: "",
  summary: "",
  bands: [] as string[],
  otherPhotos: [] as string[],
};

interface CreateArtistButtonProps {
  onCreated?: () => void;
}

function CreateArtistButton({ onCreated }: CreateArtistButtonProps) {
  const [opened, setOpened] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        photoUrl: `/images/artists/${form.photoName}.jpg`,
        heroPhotoUrl: `/images/artists/artistCont/${form.heroPhotoName}.jpg`,
      };
      delete (payload as any).photoName;
      delete (payload as any).heroPhotoName;

      console.log("Sending payload:", payload);

      await Artists.create(payload);
      alert("Artist created!");
      setOpened(false);
      setForm({ ...emptyForm });

      if (onCreated) onCreated();
    } catch (err) {
      alert("Failed to create artist: " + (err as Error).message);
    }
  };

  return (
    <>
      <Button onClick={() => setOpened(true)}>Create New Artist</Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create Artist"
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
            placeholder="e.g. zakk-wylde (no path, no extension)"
            value={form.photoName}
            onChange={(e) => handleChange("photoName", e.currentTarget.value)}
          />
          <TextInput
            label="Hero photo filename"
            placeholder="e.g. Zakk/zakk-hero (no path, no extension)"
            value={form.heroPhotoName}
            onChange={(e) => handleChange("heroPhotoName", e.currentTarget.value)}
          />
          <TextInput
            label="Tagline"
            value={form.tagline}
            onChange={(e) => handleChange("tagline", e.currentTarget.value)}
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
            label="Bands (comma-separated)"
            value={form.bands.join(", ")}
            onChange={(e) =>
              handleChange(
                "bands",
                e.currentTarget.value.split(",").map((b) => b.trim())
              )
            }
          />

          <Button onClick={handleSubmit}>Save</Button>
        </Stack>
      </Modal>
    </>
  );
}

export default CreateArtistButton;
