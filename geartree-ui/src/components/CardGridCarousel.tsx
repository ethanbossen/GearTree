// src/components/CardGridCarousel.tsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CardGridContainer from "./CardGridContainer";

interface CardGridCarouselProps {
  children: React.ReactNode[];
}

function CardGridCarousel({ children }: CardGridCarouselProps) {
  if (!children || children.length === 0) {
    return <p className="text-gray-500">No items found.</p>;
  }

  const [itemsPerPage, setItemsPerPage] = useState(3);
    const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Update itemsPerPage responsively
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1); // mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2); // tablet
      } else {
        setItemsPerPage(3); // desktop
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // ✅ Only fallback on desktop + ≤3 items
  if (itemsPerPage === 3 && children.length <= 3) {
    return <CardGridContainer>{children}</CardGridContainer>;
  }

  const totalPages = Math.ceil(children.length / itemsPerPage);

  const prevPage = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const nextPage = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const start = currentIndex * itemsPerPage;
  const visibleItems = children.slice(start, start + itemsPerPage);

  return (
    <div className="relative w-full p-4 min-w-0 overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentIndex}-${itemsPerPage}`} // re-render on resize too
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25 }}
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibleItems}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {totalPages > 1 && (
        <>
          <button
            onClick={prevPage}
            className="absolute top-1/2 left-2 -translate-y-1/2 
              bg-gray-800 text-white p-2 rounded-full shadow 
              hover:bg-gray-700 transition-opacity
              opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextPage}
            className="absolute top-1/2 right-2 -translate-y-1/2 
              bg-gray-800 text-white p-2 rounded-full shadow 
              hover:bg-gray-700 transition-opacity
              opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
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

export default CardGridCarousel;
