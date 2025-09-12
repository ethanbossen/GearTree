import { useEffect, useState } from "react";
import { Artists } from "../api";
import type { Artist } from "../api";
import ArtistCard from "./ArtistCard";

function ArtistsContainer() {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    Artists.list().then((data) => {
      // Just grab the first 3 for now
      setArtists(data.slice(0, 3));
    });
  }, []);

  return (
    <section className="px-8 max-w-7xl mx-auto">
      {/* Section title */}
      <h2 className="text-3xl font-bold border-b-4 inline-block mb-8">
        Featured Artists:
      </h2>

      {/* Card grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            id= {artist.id}
            name={artist.name}
            summary={artist.summary}
            photoUrl={artist.photoUrl}
          />
        ))}
      </div>
    </section>
  );
}

export default ArtistsContainer;
