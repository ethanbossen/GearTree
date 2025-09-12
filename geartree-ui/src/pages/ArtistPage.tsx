// src/pages/ArtistPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchArtistById } from "../api";
import type { ArtistDetail } from "../api";
import AmplifierCarousel from "../components/AmplifierCarousel";
import GuitarCarousel from "../components/GuitarCarousel";

function ArtistPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   async function loadArtist() {
      try {
        const data = await fetchArtistById(Number(id));
        setArtist(data);
      } catch (err: any) {
        if (err.message.includes("404")) {
          console.log("Artist not found, redirecting to NotFound page.");
          navigate("/404", { replace: true });
        } else {
          console.error("Unexpected error fetching artist:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) loadArtist();
  }, [id, navigate]);

  if (loading) return <p>Loading...</p>;
  if (!artist) return null; // will redirect on 404 anyway

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold">{artist.name}</h1>
      <p className="text-lg italic text-gray-600">{artist.tagline}</p>
      <img
        src={artist.heroPhotoUrl}
        alt={artist.name}
        className="w-full rounded-lg shadow-md"
      />
      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
        {artist.description}
      </p>
<div className="flex flex-col md:flex-row md:divide-x md:divide-[var(--brand-purple)]">
  {/* Guitars */}
  {artist.guitars.length > 0 && (
    <div className="basis-1/2 w-full min-w-0 md:pr-6">
      <h2 className="text-3xl text-black font-semibold mt-10 mb-4">Guitars:</h2>
      <GuitarCarousel guitars={artist.guitars} />
    </div>
  )}

  {/* Amplifiers */}
  {artist.amplifiers.length > 0 && (
    <div className="basis-1/2 w-full min-w-0 md:pl-6">
      <h2 className="text-3xl text-black font-semibold mt-10 mb-4">Amplifiers:</h2>
      <AmplifierCarousel amplifiers={artist.amplifiers} />
    </div>
  )}
</div>
    </div>
  );
}

export default ArtistPage;
