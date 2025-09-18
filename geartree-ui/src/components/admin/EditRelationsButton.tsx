// src/components/admin/EditRelationsButton.tsx
import { useState } from "react";
import { Button, Modal, MultiSelect, Stack, Text, Group, Badge } from "@mantine/core";

export interface Relation {
  id: number;
  name: string;
}

interface EditRelationsButtonProps {
  itemId: number;
  currentRelations: Relation[];
  options: Relation[]; // all possible items to add
  onAdd: (id: number, relatedId: number) => Promise<any>;
  onSaved: () => void;
  title?: string;
}

export function EditRelationsButton({
  itemId,
  currentRelations,
  options,
  onAdd,
  onSaved,
  title = "Edit Relations",
}: EditRelationsButtonProps) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const handleAdd = async () => {
    for (const idStr of selected) {
      const id = parseInt(idStr);
      await onAdd(itemId, id);
    }
    setOpened(false);
    setSelected([]);
    onSaved();
  };

  return (
    <>
      <Button
        size="xs"
        className="bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-light)] text-white font-semibold"
        onClick={() => setOpened(true)}
      >
        Edit Relations
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Text className="text-2xl font-bold">{title}</Text>}
        size="lg"
      >
        <Stack>
          {/* Current Relations */}
          <div>
            <Text className="font-bold mb-2">Current Relations</Text>
            <Group wrap="wrap" className="mb-2">
              {currentRelations.length === 0 && <Text className="text-gray-400">None</Text>}
              {currentRelations.map((r) => (
                <Badge
                  key={r.id}
                  className="bg-purple-100 text-[var(--brand-purple)]"
                  variant="light"
                >
                  {r.name}
                </Badge>
              ))}
            </Group>
          </div>

          {/* MultiSelect to add new relations */}
          <MultiSelect
            label="Add New Relations"
            placeholder="Select items..."
            data={options.map((opt) => ({ value: opt.id.toString(), label: opt.name }))}
            value={selected}
            onChange={setSelected}
            searchable
            nothingFoundMessage="No matches"
            className="mb-4"
          />

          <Button
            fullWidth
            className="bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-light)] text-white font-semibold"
            onClick={handleAdd}
          >
            Add Selected
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
