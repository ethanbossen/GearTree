// src/components/GenericDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { Button, Loader, Title } from "@mantine/core";
import Carousel from "./Carousel";
import EntityCard from "./EntityCard";
import ExternalLinkIcon from "../assets/external-link.svg";

interface BaseEntity {
  id: number;
  name: string;
  photoUrl: string;
  description?: string | null;
  yearStart?: number | null;
  yearEnd?: number | null;
  artists?: Array<{
    id: number;
    name: string;
    photoUrl?: string | null;
    summary?: string | null;
  }>;
}

interface RelatedSection {
  key: string;
  title: string;
  basePath: string;
  data?: any[];
}

interface GenericDetailPageProps<T extends BaseEntity> {
  useDetailHook: (id: number) => {
    data: T | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };
  entityName: string; // "guitar", "amplifier", etc.
  reverbSearchName?: (entity: T) => string; // Custom name for Reverb search
  renderMetadata: (entity: T) => React.ReactNode;
  getRelatedSections: (entity: T) => RelatedSection[];
}

function GenericDetailPage<T extends BaseEntity>({
  useDetailHook,
  entityName,
  reverbSearchName,
  renderMetadata,
  getRelatedSections,
}: GenericDetailPageProps<T>) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: entity, isLoading, isError, error } = useDetailHook(Number(id!));

  if (isLoading) return <Loader className="mx-auto my-10" />;
  
  if (isError) {
    if (error?.message.includes("404")) {
      navigate("/404", { replace: true });
      return null;
    }
    return <p className="text-red-500">{error?.message}</p>;
  }
  
  if (!entity) return <p className="text-gray-500">No {entityName} found.</p>;

  const searchName = reverbSearchName ? reverbSearchName(entity) : entity.name;
  const relatedSections = getRelatedSections(entity);

  return (
    <div className="px-8 max-w-7xl mx-auto py-10">
      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left: Image */}
        <div>
          <img
            src={entity.photoUrl}
            alt={entity.name}
            className="w-full h-[400px] object-cover object-center rounded-xl shadow-lg"
          />
        </div>

        {/* Right: Details */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-4xl font-bold">{entity.name}</h1>
            <p className="text-gray-600 italic">
              {entity.yearStart} – {entity.yearEnd || "Present"}
            </p>

            {/* Custom metadata (badges, tags, etc.) */}
            {renderMetadata(entity)}

            {/* Description */}
            <p className="text-gray-700 mt-2">{entity.description}</p>
          </div>

          {/* Reverb Search Button */}
          <Button
            component="a"
            href={`https://reverb.com/marketplace?query=${encodeURIComponent(searchName)}`}
            target="_blank"
            rel="noopener noreferrer"
            color="dark"
            className="w-full"
            rightSection={
              <img 
                src={ExternalLinkIcon} 
                alt="" 
                className="h-4 w-4" 
                style={{ filter: 'invert(1)' }} 
              />
            }
          >
            Search on Reverb
          </Button>
        </div>
      </div>

      {/* Related Sections */}
      {relatedSections.map((section) => {
        if (!section.data || section.data.length === 0) return null;

        return (
          <section key={section.key} className="mb-8">
            <Title order={2} className="text-black mt-4">
              {section.title}
            </Title>
            <Carousel basePath={section.basePath}>
              {section.data.map((item) => (
                <EntityCard
                  key={item.id}
                  basePath={section.basePath}
                  id={item.id}
                  name={item.name}
                  photoUrl={item.photoUrl ?? ""}
                  summary={item.summary ?? ""}
                />
              ))}
            </Carousel>
          </section>
        );
      })}
    </div>
  );
}

export default GenericDetailPage;