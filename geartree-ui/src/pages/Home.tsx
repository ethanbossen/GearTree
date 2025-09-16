import { useState, useEffect } from "react";
import { LandingSection } from "../components/LandingSection";
import ArtistsContainer from "../components/ArtistsContainer";
import AmpsContainer from "../components/AmpsContainer";
import AmplifierCarousel from "../components/AmplifierCarousel";
import ArtistCarousel from "../components/ArtistsCarousel";
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
          <ArtistCarousel artists={artists} />

          <h2 className="m-10 text-3xl font-bold border-b-4 inline-block mb-8">
            Featured Amps:
          </h2>
          <AmplifierCarousel amplifiers={amps} />
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
