import { useState, useEffect } from "react";
import { LandingSection } from "../components/LandingSection";
import AmpsContainer from "../components/HomePageAmpsContainer";
import Carousel from "../components/Carousel";
import { useAmps, useArtists } from "../api";
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

  const { data: amps = [] } = useAmps();
  const { data: artists = [] } = useArtists();

  const featuredAmps: AmplifierBrief[] = amps.slice(0, 4);
  const featuredArtists: Artist[] = artists.slice(0, 3);

  const mapToCarouselItem = (item: Artist | AmplifierBrief): CarouselItem => ({
    id: item.id,
    name: item.name,
    photoUrl: item.photoUrl ?? undefined,
    summary: item.summary ?? undefined,
  });

  return (
    <div>
      <LandingSection />

      <div className="bg-gradient-to-b from-black via-[#0d0a14] to-[#151020] pb-24">
        {isMobile ? (
          <div className="pt-12">
            <h2 className="m-10 mb-8 inline-block border-b-4 border-[#B78BE6] text-3xl font-bold text-[#B78BE6]">
              Featured Artists:
            </h2>
            <Carousel
              basePath="artists"
              itemsPerPage={1}
              items={featuredArtists.map(mapToCarouselItem)}
            />

            <h2 className="m-10 mb-8 inline-block border-b-4 border-[#B78BE6] text-3xl font-bold text-[#B78BE6]">
              Featured Amps:
            </h2>
            <Carousel
              basePath="amplifiers"
              itemsPerPage={1}
              items={featuredAmps.map(mapToCarouselItem)}
            />
          </div>
        ) : (
          <div>
            <section className="px-8 max-w-7xl mx-auto pt-20">
              <h2 className="inline-block border-b-4 border-[#B78BE6] text-3xl font-bold text-[#B78BE6]">
                Featured Artists:
              </h2>
              <Carousel
                basePath="artists"
                items={featuredArtists.map(mapToCarouselItem)}
              />
            </section>
            <AmpsContainer />
          </div>
        )}
      </div>
    </div>
  );
}
