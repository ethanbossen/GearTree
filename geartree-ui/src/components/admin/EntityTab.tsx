// src/components/admin/EntityTab.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Text, TextInput, Stack, Group, Card } from "@mantine/core";

interface EntityTabProps<T extends { id: number }> {
  title: string;
  listFn: () => Promise<T[]>;
  patchFn: (item: T) => Promise<void>; 
  createButton: React.ReactNode;
  searchField: keyof T;
  renderButtons: (item: T, handleSave: (item: T) => Promise<void>) => React.ReactNode;
}

export default function EntityTab<T extends { id: number }>({
  title,
  listFn,
  patchFn,
  createButton,
  searchField,
  renderButtons,
}: EntityTabProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [search, setSearch] = useState("");

  const loadItems = useCallback(async () => {
    try {
      const data = await listFn();
      setItems(data);
    } catch (err) {
      console.error(`Failed to load ${title}`, err);
    }
  }, [listFn, title]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSave = async (item: T) => {
    try {
      await patchFn(item);
      await loadItems();
    } catch (err) {
      console.error(`Failed to save ${title} item`, err);
    }
  };

  const filteredItems = items.filter((item) =>
    String(item[searchField]).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack gap="md">
      <Text className="pt-2" size="xl" fw={700}>
        {title} Admin
      </Text>

      {createButton}

      <TextInput
        placeholder={`Search ${title.toLowerCase()}...`}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        className="mb-4"
      />

      <Stack>
        {filteredItems.map((item) => (
          <Card key={item.id} withBorder shadow="sm" padding="md">
            <Group justify="space-between">
              <Text fw={500}>{String(item[searchField])}</Text>
              {renderButtons(item, handleSave)} {/* pass generic handleSave */}
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
