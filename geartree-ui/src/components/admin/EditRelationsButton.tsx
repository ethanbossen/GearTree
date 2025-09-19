import { useState } from "react";
import { Button, Modal, MultiSelect, Stack, Text, Group, Badge } from "@mantine/core";

export interface Relation {
  id: number;
  name: string;
}

export interface RelationGroup {
  label: string;                    
  current: Relation[];            
  options: Relation[];           
  onAdd: (itemId: number, relatedId: number) => Promise<any>;
}

interface EditRelationsButtonProps {
  itemId: number;
  groups: RelationGroup[];       
  title?: string;
}

export function EditRelationsButton({
  itemId,
  groups,
  title = "Edit Relations",
}: EditRelationsButtonProps) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const handleSave = async () => {
    for (const group of groups) {
      const ids = selected[group.label] ?? [];
      for (const idStr of ids) {
        await group.onAdd(itemId, parseInt(idStr));
      }
    }
    setOpened(false);
    setSelected({});
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
          {groups.map((group) => (
            <div key={group.label}>
              <Text className="text-[var(--brand-purple)] font-bold mb-2">
                {group.label}
              </Text>
              <Group wrap="wrap" className="mb-2">
                {group.current.length === 0 && (
                  <Text className="text-gray-400">None</Text>
                )}
                {group.current.map((r) => (
                  <Badge
                    key={r.id}
                    className="bg-purple-100 text-[var(--brand-purple)]"
                    variant="light"
                  >
                    {r.name}
                  </Badge>
                ))}
              </Group>
              <MultiSelect
                label={`Add ${group.label}`}
                placeholder={`Select ${group.label.toLowerCase()}...`}
                data={group.options
                  .filter((opt) => !group.current.some((c) => c.id === opt.id))
                  .map((opt) => ({ value: opt.id.toString(), label: opt.name }))}
                value={selected[group.label] ?? []}
                onChange={(vals) =>
                  setSelected((prev) => ({ ...prev, [group.label]: vals }))
                }
                searchable
                nothingFoundMessage="No matches"
              />
            </div>
          ))}

          <Button
            fullWidth
            className="bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-light)] text-white font-semibold"
            onClick={handleSave}
          >
            Save
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
