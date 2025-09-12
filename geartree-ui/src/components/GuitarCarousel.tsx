// src/components/GuitarCarousel.tsx
import { useState } from "react";
import { Link } from "react-router-dom"; // ✅ import Link
import type { GuitarBrief } from "../api";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GuitarCarouselProps {
  guitars: GuitarBrief[];
}

function GuitarCarousel({ guitars }: GuitarCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!guitars || guitars.length === 0) {
    return <p className="text-gray-500">No guitars found for this artist.</p>;
  }

  const guitar = guitars[currentIndex];

  const prevGuitar = () => {
    setCurrentIndex((prev) => (prev === 0 ? guitars.length - 1 : prev - 1));
  };

  const nextGuitar = () => {
    setCurrentIndex((prev) => (prev === guitars.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full p-4 group min-w-0">
      {/* Guitar Card */}
      <Link
        to={`/guitars/${guitar.id}`} // ✅ link to guitar detail page
        className="block bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center space-y-4 w-full h-full hover:shadow-xl transition-shadow"
      >
        {guitar.photoUrl && (
          <img
            src={guitar.photoUrl}
            alt={guitar.name}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        )}
        <h2 className="text-2xl font-bold truncate text-center w-full overflow-hidden">
          {guitar.name}
        </h2>
        <p className="text-sm text-gray-600 italic">
          {guitar.yearStart} - {guitar.yearEnd || "Present"}
        </p>
        <p className="text-gray-700 text-center line-clamp-2 min-h-[3rem]">
          {guitar.summary}
        </p>
      </Link>

      {/* Navigation Arrows */}
      {guitars.length > 1 && (
        <>
          <button
            onClick={prevGuitar}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 
              bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700
              opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextGuitar}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 
              bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700
              opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {guitars.length > 1 && (
        <div className="flex justify-center mt-3 space-x-2">
          {guitars.map((_, idx) => (
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

export default GuitarCarousel;
