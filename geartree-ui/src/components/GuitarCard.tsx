// src/components/GuitarCard.tsx
import { Link } from "react-router-dom";

interface GuitarCardProps {
  id: number;
  name: string;
  photoUrl: string;
  summary: string;
  type?: string;
  genres?: string[];
}

function GuitarCard({ id, name, photoUrl, summary, type, genres }: GuitarCardProps) {
  return (
    <Link
      to={`/guitars/${id}`}
      className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      {/* Image */}
      {photoUrl && (
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-56 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        {/* Guitar name */}
        <h3 className="text-xl font-bold mb-2 truncate">{name}</h3>

        {/* Optional type */}
        {type && (
          <p className="text-sm text-gray-500 mb-1">Type: {type}</p>
        )}

        {/* Optional genres */}
        {genres && genres.length > 0 && (
          <p className="text-sm text-gray-500 mb-2">
            Genres: {genres.join(", ")}
          </p>
        )}

        {/* Summary (2 lines max, always fixed height) */}
        <p className="text-gray-700 text-sm line-clamp-2 min-h-[3rem]">
          {summary}
        </p>
      </div>
    </Link>
  );
}

export default GuitarCard;
