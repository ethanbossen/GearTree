import { useAmps } from "../api";
import type { AmplifierBrief } from "../types";
import EntityCard from "./EntityCard";

export default function AmpsContainer() {
  const { data: amps = [] } = useAmps();
  const featuredAmps: AmplifierBrief[] = amps.slice(0, 4);

  return (
    <section className="px-8 py-12 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold border-b-4 inline-block mb-8">
        Featured Amps:
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        {featuredAmps.map((amp) => (
          <EntityCard
            key={amp.id}
            basePath="amplifiers"
            id={amp.id}
            name={amp.name}
            summary={amp.summary ?? ""}
            photoUrl={amp.photoUrl ?? ""}
          />
        ))}
      </div>
    </section>
  );
}
