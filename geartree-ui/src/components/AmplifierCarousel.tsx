import { useState } from "react";
import type { Amplifier } from "../api";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AmplifierCarouselProps {
  amplifiers: Amplifier[];
}

function AmplifierCarousel({ amplifiers }: AmplifierCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!amplifiers || amplifiers.length === 0) {
    return <p className="text-gray-500">No amplifiers found for this artist.</p>;
  }

  const amp = amplifiers[currentIndex];

  const prevAmp = () => {
    setCurrentIndex((prev) => (prev === 0 ? amplifiers.length - 1 : prev - 1));
  };

  const nextAmp = () => {
    setCurrentIndex((prev) => (prev === amplifiers.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full p-4 group min-w-0">
      {/* Amp Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center space-y-4 w-full h-full">
        {amp.photoUrl && (
          <img
            src={amp.photoUrl}
            alt={amp.name}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        )}
        <h2 className="text-2xl font-bold w-full overflow-hidden">{amp.name}</h2>
        <p className="text-sm text-gray-600 italic">
          {amp.yearStart} - {amp.yearEnd || "Present"}
        </p>
        <p className="text-gray-700 text-center line-clamp-2 min-h-[3rem]">{amp.summary}</p>
      </div>

      {/* Navigation Arrows */}
      {amplifiers.length > 1 && (
        <>
          <button
            onClick={prevAmp}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 
              bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700
              opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextAmp}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 
              bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700
              opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {amplifiers.length > 1 && (
        <div className="flex justify-center mt-3 space-x-2">
          {amplifiers.map((_, idx) => (
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

export default AmplifierCarousel;
