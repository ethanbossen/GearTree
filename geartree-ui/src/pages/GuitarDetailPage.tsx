// src/pages/GuitarDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Guitars } from "../api";  
import type { GuitarDetail } from "../api"; 
import { Button, Loader, Title } from "@mantine/core";
import CardGridContainer from "../components/CardGridContainer";
import GuitarCard from "../components/GuitarCard";
import ArtistCard from "../components/ArtistCard";
import CardGridCarousel from "../components/CardGridCarousel";

function GuitarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [guitar, setGuitar] = useState<GuitarDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Guitars.get(Number(id))
      .then((data) => {
        setGuitar(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loader className="mx-auto my-10" />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!guitar) return <p className="text-gray-500">No guitar found.</p>;

  return (
    <div className="px-8 max-w-7xl mx-auto py-10">
      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left: Image */}
        <div>
          <img
            src={guitar.photoUrl}
            alt={guitar.name}
            className="w-full h-[400px] object-cover object-center rounded-xl shadow-lg"
          />
        </div>

        {/* Right: Details */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-4xl font-bold">{guitar.name}</h1>
            <p className="text-gray-600 italic">
              {guitar.yearStart} – {guitar.yearEnd || "Present"}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 my-3">
              {guitar.type && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {guitar.type}
                </span>
              )}
              {guitar.pickups?.map((p, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {p}
                </span>
              ))}
              {guitar.genres?.map((g, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-gray-700 mt-2">{guitar.description}</p>
          </div>

          {/* Button full width under text */}
          <Button
            component="a"
            href={`https://reverb.com/marketplace?query=${encodeURIComponent(
              guitar.name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            color="dark"
            className="w-full"
          >
            Search on Reverb
          </Button>
        </div>
      </div>

      {/* Related Guitars */}
      {guitar.relatedGuitars && guitar.relatedGuitars.length > 0 && (
        <section className="mb-12">
           <Title order={2} className="mb-6 text-black">
            Related Guitars:
          </Title>
          <CardGridCarousel>
            {guitar.relatedGuitars.map((rg) => (
              <GuitarCard
                key={rg.id}
                id={rg.id}
                name={rg.name}
                photoUrl={rg.photoUrl ?? ""}   
                summary={rg.summary ?? ""}     
              />
            ))}
          </CardGridCarousel>
        </section>
      )}

      {/* Artists */}
      {guitar.artists && guitar.artists.length > 0 && (
        <section className="mb-12">
 <Title order={2} className="mb-6 text-black">
            Artists Who Use This Guitar:
          </Title>
          <CardGridCarousel>
            {guitar.artists.map((artist) => (
              <ArtistCard key={artist.id} {...artist} />
            ))}
          </CardGridCarousel>
        </section>
      )}
    </div>
  );
}

export default GuitarDetailPage;
