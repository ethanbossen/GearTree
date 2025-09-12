// src/components/AmpsContainer.tsx
import { useEffect, useState } from "react";
import { fetchAmps } from "../api";
import type { Amplifier } from "../api";
import AmpCard from "./AmpCard";

function AmpsContainer() {
  const [amps, setAmps] = useState<Amplifier[]>([]);

  useEffect(() => {
    fetchAmps().then((data) => {
      // Just grab the first 2
      setAmps(data.slice(0, 4));
    });
  }, []);

  return (
    <section className="px-8 py-12 max-w-7xl mx-auto">
      {/* Section title */}
      <h2 className="text-3xl font-bold border-b-4 inline-block mb-8">
        Featured Amps:
      </h2>

      {/* Card grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {amps.map((amp) => (
          <AmpCard
            key={amp.id}
            id={amp.id}
            name={amp.name}
            summary={amp.summary}
            photoUrl={amp.photoUrl}
            
          />
        ))}
      </div>
    </section>
  );
}

export default AmpsContainer;
