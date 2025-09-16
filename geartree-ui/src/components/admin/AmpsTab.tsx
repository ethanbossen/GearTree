// src/components/Admin/AmpsTab.tsx
import { Text, Button, Stack } from "@mantine/core";


function AmpsTab () {
  return (
    <Stack gap="md">
      <Text size="xl" fw={700}>
        Amplifiers Admin
      </Text>
         {/* Button to create new Amp */}
      <Button>Create New Guitar</Button>

      {/* Placeholder for list/form */}
      <Text>Amp list or form will go here.</Text>
    </Stack>
  );
};

export default AmpsTab;
