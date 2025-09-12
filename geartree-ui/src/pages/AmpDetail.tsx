// src/pages/AmpDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAmpById } from "../api";
import type { AmplifierDetail } from "../api";
import { Badge, Button, Group, Stack, Text, Title } from "@mantine/core";
import AmpCardDetailed from "../components/AmpCardDetailed";
import ArtistCard from "../components/ArtistCard"; // assuming you already have one

function AmpDetail() {
  const { id } = useParams();
  const [amp, setAmp] = useState<AmplifierDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchAmpById(Number(id))
      .then((data) => setAmp(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!amp) return <div className="p-8">Amplifier not found.</div>;

  const reverbSearchUrl = `https://reverb.com/marketplace?query=${encodeURIComponent(
    amp.name
  )}`;

  return (
    <div className="px-8 max-w-7xl mx-auto">
      {/* Top split: image + info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div>
          <img
            src={amp.photoUrl}
            alt={amp.name}
            className="w-full h-[400px] object-cover object-top rounded-lg shadow"
          />
        </div>

        {/* Info */}
        <Stack gap="sm">
          <Title order={1}>{amp.name}</Title>
          <Text size="lg" c="dimmed">
            {amp.yearStart} – {amp.yearEnd || "Present"}
          </Text>

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

          {/* Price */}
          {amp.priceStart > 0 && (
            <Text size="md" fw={500}>
              ~${amp.priceStart}
              {amp.priceEnd > amp.priceStart ? ` – $${amp.priceEnd}` : ""}
            </Text>
          )}

          {/* Reverb Button */}
          <Button
            component="a"
            href={reverbSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="orange"
          >
            Search on Reverb
          </Button>
        </Stack>
      </div>

      {/* Description */}
      <section className="mb-16 prose max-w-none">
        <p>{amp.description}</p>
      </section>

      {/* Related Amps */}
      {amp.relatedAmps && amp.relatedAmps.length > 0 && (
        <section className="mb-16">
          <Title order={2} className="mb-6">
            Related Amps
          </Title>
          <div className="grid gap-8 md:grid-cols-3">
            {amp.relatedAmps.map((ra) => (
              <AmpCardDetailed key={ra.id} {...ra} />
            ))}
          </div>
        </section>
      )}

      {/* Artists */}
      {amp.artists && amp.artists.length > 0 && (
        <section className="mb-16">
          <Title order={2} className="mb-6">
            Artists Who Use This Amp
          </Title>
          <div className="grid gap-8 md:grid-cols-3">
            {amp.artists.map((artist) => (
              <ArtistCard key={artist.id} {...artist} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default AmpDetail;
