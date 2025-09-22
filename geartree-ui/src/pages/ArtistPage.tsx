// src/pages/ArtistPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useArtist } from "../api";
import Carousel from "../components/Carousel";
import type { CarouselItem } from "../types";

function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: artist, isLoading, isError, error } = useArtist(Number(id!));

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    if ((error as Error).message.includes("404")) {
      navigate("/404", { replace: true });
      return null;
    }
    return <p className="text-red-500">{(error as Error).message}</p>;
  }

  if (!artist) return null;

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      <h1 className="text-4xl font-bold">{artist.name}</h1>
      <p className="text-lg italic text-gray-600">{artist.tagline}</p>
      <img
        src={artist.heroPhotoUrl}
        alt={artist.name}
        className="w-full mx-auto max-w-4xl rounded-lg shadow-md"
      />
      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
        {artist.description}
      </p>

      <div className="h-full flex flex-col md:flex-row md:divide-x md:divide-[var(--brand-purple)]">
        {/* Guitars */}
        {artist.guitars.length > 0 && (
          <div className="basis-1/2 min-w-0 md:pr-6">
            <h2 className="text-3xl text-black font-semibold mt-6">Guitars:</h2>
            <Carousel
              basePath="guitars"
              itemsPerPage={1}
              items={artist.guitars.map((guitar): CarouselItem => ({
                id: guitar.id,
                name: guitar.name,
                photoUrl: guitar.photoUrl,
                summary: guitar.summary,
              }))}
            />
          </div>
        )}

        {/* Amplifiers */}
        {artist.amplifiers.length > 0 && (
          <div className="basis-1/2 min-w-0 md:pl-6">
            <h2 className="text-3xl text-black font-semibold mt-6">Amplifiers:</h2>
            <Carousel
              basePath="amplifiers"
              itemsPerPage={1}
              items={artist.amplifiers.map((amp): CarouselItem => ({
                id: amp.id,
                name: amp.name,
                photoUrl: amp.photoUrl,
                summary: amp.summary,
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtistPage;
