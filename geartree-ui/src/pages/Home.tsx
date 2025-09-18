import { useState, useEffect } from "react";
import { LandingSection } from "../components/LandingSection";
import ArtistsContainer from "../components/ArtistsContainer";
import AmpsContainer from "../components/AmpsContainer";
import Carousel from "../components/Carousel";
import type { CarouselItem } from "../components/Carousel";
import { Amps, Artists } from "../api";
import type { AmplifierBrief, Artist } from "../api";

// Custom hook to track window width
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default function Home() {
  const width = useWindowWidth();
  const isMobile = width < 768; // md breakpoint

  const [amps, setAmps] = useState<AmplifierBrief[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  // Fetch amps
  useEffect(() => {
    Amps.list()
      .then((data) => setAmps(data.slice(0, 4))) // first 4 for carousel
      .catch(console.error);
  }, []);

  // Fetch artists
  useEffect(() => {
    Artists.list()
      .then((data) => setArtists(data.slice(0, 4))) // first 4 for carousel
      .catch(console.error);
  }, []);

  return (
    <div>
      <LandingSection />

      {isMobile ? (
        <div>
          <h2 className="m-10 text-3xl font-bold border-b-4 inline-block mb-8">
            Featured Artists:
          </h2>
          <Carousel itemsPerPage={1 }items={artists} />

          <h2 className="m-10 text-3xl font-bold border-b-4 inline-block mb-8">
            Featured Amps:
          </h2>
          <Carousel
  itemsPerPage={1}
  items={amps.map((amp): CarouselItem => ({
    id: amp.id,
    name: amp.name,
    photoUrl: amp.photoUrl,
    summary: amp.summary,
  }))}
/>
        </div>
      ) : (
        <div>
          <ArtistsContainer />
          <AmpsContainer />
        </div>
      )}
    </div>
  );
}
