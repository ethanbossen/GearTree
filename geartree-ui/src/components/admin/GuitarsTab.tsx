import { Stack, Text, Button } from "@mantine/core";

function GuitarsTab() {
  return (
    <Stack gap="md">
      <Text size="xl" fw={700}>
        Guitars Admin
      </Text>

      {/* Button to create new guitar */}
      <Button>Create New Guitar</Button>

      {/* Placeholder for list/form */}
      <Text>Guitar list or form will go here.</Text>
    </Stack>
  );
}

export default GuitarsTab;
