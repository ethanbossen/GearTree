// src/pages/GuitarDetail.tsx
import { Guitars } from "../api";
import type { GuitarDetail } from "../types";
import GenericDetailPage from "../components/GenericDetailPage";

function GuitarDetailPage() {
  const renderGuitarMetadata = (guitar: GuitarDetail) => (
    <div className="flex flex-wrap gap-2 my-3">
      {guitar.type && (
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
          {guitar.type}
        </span>
      )}
      {guitar.pickups?.map((p, idx) => (
        <span
          key={idx}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
        >
          {p}
        </span>
      ))}
      {guitar.genres?.map((g, idx) => (
        <span
          key={idx}
          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
        >
          {g}
        </span>
      ))}
    </div>
  );

  const getGuitarRelatedSections = (guitar: GuitarDetail) => [
    {
      key: 'relatedGuitars',
      title: 'Related Guitars:',
      basePath: 'guitars',
      data: guitar.relatedGuitars
    },
    {
      key: 'artists',
      title: 'Artists Who Use This Guitar:',
      basePath: 'artists',
      data: guitar.artists
    }
  ];

  return (
    <GenericDetailPage
      apiService={Guitars}
      entityName="guitar"
      renderMetadata={renderGuitarMetadata}
      getRelatedSections={getGuitarRelatedSections}
    />
  );
}

export default GuitarDetailPage;