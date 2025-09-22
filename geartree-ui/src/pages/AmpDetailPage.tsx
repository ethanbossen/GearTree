// src/pages/AmpDetail.tsx
import { useAmp } from "../api";
import type { AmplifierDetail } from "../types";
import GenericDetailPage from "../components/GenericDetailPage";
import { Badge, Group, Text } from "@mantine/core";

function AmpDetailPage() {
  const renderAmpMetadata = (amp: AmplifierDetail) => (
    <div className="space-y-3">
      {amp.priceStart != null && amp.priceStart > 0 && (
        <Text size="lg" c="dimmed">
          ~${amp.priceStart}
          {amp.priceEnd != null && amp.priceEnd > amp.priceStart
            ? ` – $${amp.priceEnd}`
            : ""}
        </Text>
      )}

      <Group gap="xs" wrap="wrap">
        <Badge color={amp.isTube ? "red" : "blue"} variant="light">
          {amp.isTube ? "Tube" : "Solid-State"}
        </Badge>
        {amp.gainStructure && (
          <Badge color="grape" variant="light">
            {amp.gainStructure}
          </Badge>
        )}
        {amp.wattage > 0 && (
          <Badge color="green" variant="light">
            {amp.wattage}W
          </Badge>
        )}
        {amp.speakerConfiguration && (
          <Badge color="cyan" variant="light">
            {amp.speakerConfiguration}
          </Badge>
        )}
      </Group>
    </div>
  );

  const getAmpRelatedSections = (amp: AmplifierDetail) => [
    {
      key: 'relatedAmps',
      title: 'Related Amps:',
      basePath: 'amplifiers',
      data: amp.relatedAmps
    },
    {
      key: 'artists',
      title: 'Artists Who Use This Amp:',
      basePath: 'artists',
      data: amp.artists
    }
  ];

  return (
    <GenericDetailPage
      useDetailHook={useAmp}
      entityName="guitar"
      renderMetadata={renderAmpMetadata}
      getRelatedSections={getAmpRelatedSections}
    />
  );
}

export default AmpDetailPage;