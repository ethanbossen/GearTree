// src/pages/AmpDetail.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useAmp } from "../api"; 
import type { AmplifierDetail } from "../types";
import { Badge, Group, Text, Loader } from "@mantine/core";
import Carousel from "../components/Carousel";
import EntityCard from "../components/EntityCard";

function AmpDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: amp, isLoading, isError, error } = useAmp(Number(id!));

  if (isLoading) return <Loader className="mx-auto my-10" />;

  if (isError) {
    if ((error as Error).message.includes("404")) {
      navigate("/404", { replace: true });
      return null;
    }
    return <p className="text-red-500">{(error as Error).message}</p>;
  }

  if (!amp) return <p className="text-gray-500">No amp found.</p>;

  const renderMetadata = (amp: AmplifierDetail) => (
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

  const relatedSections = [
    {
      key: "relatedAmps",
      title: "Related Amps:",
      basePath: "amplifiers",
      data: amp.relatedAmps,
    },
    {
      key: "artists",
      title: "Artists Who Use This Amp:",
      basePath: "artists",
      data: amp.artists,
    },
  ];

  return (
    <div className="px-8 max-w-7xl mx-auto py-10">
      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left: Image */}
        <div>
          <img
            src={amp.photoUrl}
            alt={amp.name}
            className="w-full h-[400px] object-cover object-center rounded-xl shadow-lg"
          />
        </div>

        {/* Right: Details */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-4xl font-bold">{amp.name}</h1>
            <p className="text-gray-600 italic">
              {amp.yearStart} – {amp.yearEnd || "Present"}
            </p>

            {/* Custom metadata */}
            {renderMetadata(amp)}

            {/* Description */}
            <p className="text-gray-700 mt-2">{amp.description}</p>
          </div>
        </div>
      </div>

      {/* Related Sections */}
      {relatedSections.map((section) => {
        if (!section.data || section.data.length === 0) return null;

        return (
          <section key={section.key} className="mb-8">
            <h2 className="text-black mt-4 text-2xl">{section.title}</h2>
            <Carousel basePath={section.basePath}>
              {section.data.map((item) => (
                <EntityCard
                  key={item.id}
                  basePath={section.basePath}
                  id={item.id}
                  name={item.name}
                  photoUrl={item.photoUrl ?? ""}
                  summary={item.summary ?? ""}
                />
              ))}
            </Carousel>
          </section>
        );
      })}
    </div>
  );
}

export default AmpDetailPage;
