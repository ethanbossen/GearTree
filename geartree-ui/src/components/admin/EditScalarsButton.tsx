// src/components/admin/EditScalarsButton.tsx
import { useState } from "react";
import { Button, Modal, TextInput, Textarea, Stack } from "@mantine/core";

interface EditScalarsButtonProps<T> {
  item: T;
  onSave: (updatedItem: T) => Promise<void>;
  scalarFields: (keyof T)[];
  onSaved?: () => void;
}

export function formatTextCapitalizeFirstLetter(str: string) {
  if (!str) return "";
  // insert space before capital letters for camelCase items and capitalizes first 
  // letter of other fields
  const spaced = str.replace(/([A-Z])/g, " $1");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}


export function EditScalarsButton<T extends Record<string, any>>({
  item,
  onSave,
  scalarFields,
  onSaved,
}: EditScalarsButtonProps<T>) {
  const [opened, setOpened] = useState(false);
  const [values, setValues] = useState({ ...item });

  const handleChange = (key: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

const handleSave = async () => {
  // Build a clean PATCH payload with only scalar fields
  const patchPayload: Partial<T> = {};

  scalarFields.forEach((field) => {
    const value = values[field];

    // Include only primitives or array-of-strings
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      (Array.isArray(value) && value.every((v: string) => typeof v === "string"))
    ) {
      patchPayload[field] = value;
    }
  });

  if ("id" in values) {
    (patchPayload as any).id = values["id"];
  }

  await onSave(patchPayload as T);
  setOpened(false);
  if (onSaved) onSaved();
};



  return (
    <>
      <Button className="bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-light)]" size="xs" onClick={() => setOpened(true)}>
        Edit Scalars
      </Button>

      <Modal opened={opened} onClose={() => setOpened(false)} title={<span className="text-2xl font-bold">Edit Scalars</span>}>
        <Stack>
            {scalarFields.map((field) => {
            const value = values[field];

            if (field === "description" || field === "tagline" || field === "summary") {
                return (
        <Textarea
        autosize={true}
          key={String(field)}
          label={formatTextCapitalizeFirstLetter(String(field))}
          value={value}
          onChange={(e) => handleChange(field, e.currentTarget.value)}
        />
      );
            }

    if (Array.isArray(value)) {
      return (
        <TextInput
          key={String(field)}
          label={formatTextCapitalizeFirstLetter(String(field))}
          value={value.join(", ")} // display as comma-separated
          onChange={(e) =>
            handleChange(field, e.currentTarget.value.split(",").map((v) => v.trim()))
          }
        />
      );
    }

    return (
      <TextInput
        key={String(field)}
        label={formatTextCapitalizeFirstLetter(String(field))}
        value={value}
        onChange={(e) => handleChange(field, e.currentTarget.value)}
      />
    );
  })}
  <Button className="bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-light)]"fullWidth onClick={handleSave}>Save</Button>
</Stack>
      </Modal>
    </>
  );
}
