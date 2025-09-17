// src/components/admin/EditRelationsButton.tsx
import { useState } from "react";
import { Button, Modal, MultiSelect, Stack, Text, Group, Badge } from "@mantine/core";

interface Relation {
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
      <Button size="xs" onClick={() => setOpened(true)}>
        Edit Relations
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<h2 className="text-lg font-semibold">{title}</h2>}
        size="lg"
      >
        <Stack>
          <div>
            <Text fw={500} mb={4}>
              Current Relations:
            </Text>
            <Group wrap="wrap">
              {currentRelations.length === 0 && <Text c="dimmed">None</Text>}
              {currentRelations.map((r) => (
                <Badge key={r.id} color="grape" variant="light">
                  {r.name}
                </Badge>
              ))}
            </Group>
          </div>

          <MultiSelect
            label="Add New Relations"
            placeholder="Select items..."
            data={options.map((opt) => ({ value: opt.id.toString(), label: opt.name }))}
            value={selected}
            onChange={setSelected}
            searchable
            nothingFoundMessage="No matches"
          />

          <Button fullWidth onClick={handleAdd} className="bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-light)]">
            Add Selected
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
