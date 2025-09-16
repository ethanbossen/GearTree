import { useState } from "react";
import { Link } from "react-router-dom";
import type { Artist } from "../api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ArtistCarouselProps {
  artists: Artist[];
}

function ArtistCarousel({ artists }: ArtistCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!artists || artists.length === 0) {
    return <p className="text-gray-500">No artists found.</p>;
  }

  const prevArtist = () => {
    setCurrentIndex((prev) => (prev === 0 ? artists.length - 1 : prev - 1));
  };

  const nextArtist = () => {
    setCurrentIndex((prev) => (prev === artists.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full p-4 min-w-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={artists[currentIndex].id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          {/* Artist Card */}
          <Link
            to={`/artists/${artists[currentIndex].id}`}
            className="block bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center space-y-4 w-full h-full hover:shadow-xl transition-shadow"
          >
            {artists[currentIndex].photoUrl && (
              <img
                src={artists[currentIndex].photoUrl}
                alt={artists[currentIndex].name}
                className="w-full h-64 object-cover object-top rounded-lg shadow-md"
              />
            )}
            <h2 className="text-2xl font-bold w-full overflow-hidden text-center">
              {artists[currentIndex].name}
            </h2>
            {artists[currentIndex].tagline && (
              <p className="text-gray-700 text-center line-clamp-2 min-h-[3rem]">
                {artists[currentIndex].tagline}
              </p>
            )}
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {artists.length > 1 && (
        <>
          <button
            onClick={prevArtist}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 
              bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700
              opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextArtist}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 
              bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700
              opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {artists.length > 1 && (
        <div className="flex justify-center mt-3 space-x-2">
          {artists.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === currentIndex ? "bg-gray-800" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtistCarousel;
