import { useState, useEffect } from "react";
import { LandingSection } from "../components/LandingSection";
import AmpsContainer from "../components/HomePageAmpsContainer";
import Carousel from "../components/Carousel";
import { Amps, Artists } from "../api";
import type { AmplifierBrief, Artist, CarouselItem } from "../types";

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
  const isMobile = width < 768; 

  const [amps, setAmps] = useState<AmplifierBrief[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  // Fetch amps
  useEffect(() => {
    Amps.list()
      .then((data) => setAmps(data.slice(0, 4))) 
      .catch(console.error);
  }, []);

  // Fetch artists
  useEffect(() => {
    Artists.list()
      .then((data) => setArtists(data.slice(0, 3))) 
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
          <Carousel basePath="artists" itemsPerPage={1}   items={artists.map((artist): CarouselItem => ({
    id: artist.id,
    name: artist.name,
    photoUrl: artist.photoUrl ?? undefined,
    summary: artist.summary ?? undefined,
  }))} />

          <h2 className="m-10 text-3xl font-bold border-b-4 inline-block mb-8">
            Featured Amps:
          </h2>
          <Carousel
          basePath="amplifiers"
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
          <section className="px-8 max-w-7xl mx-auto">
           <h2 className="text-3xl font-bold border-b-4 inline-block">
        Featured Artists:
      </h2>
          <Carousel basePath="artists"   items={artists.map((artist): CarouselItem => ({
    id: artist.id,
    name: artist.name,
    photoUrl: artist.photoUrl ?? undefined,
    summary: artist.summary ?? undefined,
  }))} />
          </section>
          <AmpsContainer />
        </div>
      )}
    </div>
  );
}
