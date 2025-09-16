import { Stack, Text, Button } from "@mantine/core";

function ArtistsTab() {
  return (
    <Stack gap="md">
      <Text size="xl" fw={700}>
        Artists Admin
      </Text>

      {/* Button to create new artist */}
      <Button>Create New Artist</Button>

      {/* Placeholder for list/form */}
      <Text color="dimmed">Artist list or form will go here.</Text>
    </Stack>
  );
}

export default ArtistsTab;
