// src/pages/AmpDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Amps} from "../api";
import type { Amplifier } from "../api";
import { Badge, Button, Group, Stack, Text, Title } from "@mantine/core";
import EntityCard from "../components/EntityCard";
import Carousel from "../components/Carousel";

function AmpDetailPage() {
  const { id } = useParams();
  const [amp, setAmp] = useState<Amplifier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Amps.get(Number(id))
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
    <div className="px-8 pt-5 max-w-7xl mx-auto">
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
  {amp.priceStart != null && amp.priceStart > 0 && (
    <> • ~${amp.priceStart}{amp.priceEnd != null && amp.priceEnd > amp.priceStart ? ` – $${amp.priceEnd}` : ""}</>
  )}
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

            {/* Description */}
      <section className="prose max-w-none">
        <p>{amp.description}</p>
      </section>


          {/* Reverb Search */}
          <Button
            component="a"
            href={reverbSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="dark"
          >
            Search on Reverb
          </Button>
        </Stack>
      </div>

    
      {/* Related Amps */}
      {amp.relatedAmps && amp.relatedAmps.length > 0 && (
        <section className="mb-16">
          <Title order={2} className="mb-6 text-black">
            Related Amps:
          </Title>
          <Carousel basePath="amplifiers">
            {amp.relatedAmps.map((ra) => (
              <EntityCard
                key={ra.id}
                basePath="amplifiers"
                id={ra.id}
                name={ra.name}
                photoUrl={ra.photoUrl ?? ""}
                summary={ra.summary ?? ""}
              />
            ))}
          </Carousel>
        </section>
      )}

      {/* Artists */}
      {amp.artists && amp.artists.length > 0 && (
        <section className="mb-16">
          <Title order={2} className="mb-6 text-black">
            Artists Who Use This Amp:
          </Title>
          <Carousel basePath="artists">
            {amp.artists.map((artist) => (
              <EntityCard basePath="artists" key={artist.id} {...artist} />
            ))}
          </Carousel>
        </section>
      )}
    </div>
  );
}

export default AmpDetailPage;
