// src/components/GenericCarousel.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CarouselItem } from "../types";

interface GenericCarouselProps {
  children?: React.ReactNode[];
  items?: CarouselItem[];
  basePath: string;
  itemsPerPage?: number | { [breakpoint: number]: number }; // e.g. 3 or {640:1,1024:2,1440:4}
  emptyMessage?: string;
}

function Carousel({
  children,
  items,
  basePath = "",
  itemsPerPage = { 640: 1, 768: 2, 1024: 3 }, // Default responsive breakpoints
  emptyMessage = "No items found.",
}: GenericCarouselProps) {
  const hasChildren = !!children && children.length > 0;
  const hasItems = !!items && items.length > 0;

  if (!hasChildren && !hasItems) {
    return <p className="text-gray-500">{emptyMessage}</p>;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPageState, setItemsPerPageState] = useState(1);

  // Reset carousel when items or children change
useEffect(() => {
  setCurrentIndex(0);
}, [children, items]);


  // Responsive logic
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (typeof itemsPerPage === "number") {
        setItemsPerPageState(itemsPerPage);
      } else {
        // Sort breakpoints ascending
        const sorted = Object.entries(itemsPerPage)
          .map(([k, v]) => [parseInt(k), v])
          .sort((a, b) => a[0] - b[0]);

        // Start with the smallest value (mobile first)
        let itemCount = sorted[0][1];
        
        // Find the appropriate breakpoint
        for (let [width, count] of sorted) {
          if (window.innerWidth >= width) {
            itemCount = count;
          }
        }
        
        setItemsPerPageState(itemCount);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, [itemsPerPage]);

  const sourceArray = hasChildren ? children! : items!;
  const totalPages = Math.ceil(sourceArray.length / itemsPerPageState);

  const prev = () =>
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  const next = () =>
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));

  const start = currentIndex * itemsPerPageState;
  const visibleItems = sourceArray.slice(start, start + itemsPerPageState);

  // Always convert to ReactNode[]
  let elementsToRender: React.ReactNode[];
  if (hasChildren) {
    elementsToRender = visibleItems as React.ReactNode[];
  } else if (hasItems) {
    elementsToRender = (visibleItems as CarouselItem[]).map((item) => (
      <Link
        key={item.id}
        to={`/${basePath}/${item.id}`}
        className="block bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center space-y-2 w-full h-full hover:shadow-xl transition-shadow"
      >
        {item.photoUrl && (
          <img
            src={item.photoUrl}
            alt={item.name}
            className="w-full h-64 object-cover object-top rounded-lg shadow-md"
          />
        )}
        <h2 className="text-2xl text-black font-bold text-center w-full truncate">
          {item.name}
        </h2>
        {(item.yearStart || item.yearEnd) && (
          <p className="text-sm text-gray-600 italic">
            {item.yearStart} – {item.yearEnd || "Present"}
          </p>
        )}
        {(item.summary || item.tagline) && (
          <p className="text-gray-700 text-center line-clamp-2 min-h-[3rem]">
            {item.summary || item.tagline}
          </p>
        )}
      </Link>
    ));
  } else {
    elementsToRender = [];
  }

  // Generate dynamic grid classes based on current items per page
  const getGridClasses = () => {
    switch (itemsPerPageState) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        // For 5+ items, use a more flexible approach
        return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
    }
  };

  return (
    <div className="relative w-full p-4 overflow-hidden min-w-0 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentIndex}-${itemsPerPageState}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25 }}
          className={`grid gap-6 ${getGridClasses()}`}
        >
          {elementsToRender}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {totalPages > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots */}
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

export default Carousel;