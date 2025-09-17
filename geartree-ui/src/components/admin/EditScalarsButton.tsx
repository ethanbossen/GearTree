// src/components/admin/EditScalarsButton.tsx
import { useState } from "react";
import { Button, Modal, TextInput, Textarea, Stack } from "@mantine/core";

interface EditScalarsButtonProps<T> {
  item: T;
  onSave: (updatedItem: T) => Promise<void>;
  scalarFields: (keyof T)[];
  onSaved?: () => void;
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
    await onSave(values as T);
    setOpened(false);
    if (onSaved) {
        onSaved();
    }
  };

  return (
    <>
      <Button size="xs" onClick={() => setOpened(true)}>
        Edit Scalars
      </Button>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Edit Scalars">
        <Stack>
            {scalarFields.map((field) => {
            const value = values[field];

            if (field === "description") {
                return (
        <Textarea
        autosize={true}
          key={String(field)}
          label={String(field)}
          value={value}
          onChange={(e) => handleChange(field, e.currentTarget.value)}
        />
      );
            }

    if (Array.isArray(value)) {
      return (
        <TextInput
          key={String(field)}
          label={String(field)}
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
        label={String(field)}
        value={value}
        onChange={(e) => handleChange(field, e.currentTarget.value)}
      />
    );
  })}
  <Button fullWidth onClick={handleSave}>Save</Button>
</Stack>
      </Modal>
    </>
  );
}
