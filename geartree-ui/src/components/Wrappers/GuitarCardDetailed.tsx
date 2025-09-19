
// src/components/GuitarCard.tsx
import ProductCard from "../ProductCard";
import type { ProductCardProps } from "../ProductCard";
import type { BadgeItem } from "../OneLineBadges";

interface GuitarCardProps {
  id: number;
  name: string;
  photoUrl: string;
  summary?: string;
  type?: string;
  manufacturer?: string;
  yearStart?: number;
  yearEnd?: number | null;
  pickups?: string[];
  PriceStart?: number;
  PriceEnd?: number;
  genres?: string[];
}

export default function GuitarCard(props: GuitarCardProps) {
  // Build badges array
  const badges: BadgeItem[] = [
    ...(props.pickups || []).map(pickup => ({ text: pickup, color: "grape" as const })),
    ...(props.genres || []).map(genre => ({ text: genre, color: "blue" as const })),
  ];

  // Add price badge if present
  if (props.PriceStart != null && props.PriceStart > 0) {
    const priceText = `~$${props.PriceStart}${
      props.PriceEnd != null && props.PriceEnd > props.PriceStart 
        ? ` - $${props.PriceEnd}` 
        : ""
    }`;
    badges.push({ text: priceText, color: "yellow" });
  }

  // Convert to ProductCard props
  const productCardProps: ProductCardProps = {
    id: props.id,
    name: props.name,
    photoUrl: props.photoUrl,
    summary: props.summary,
    type: props.type,
    manufacturer: props.manufacturer,
    yearStart: props.yearStart,
    yearEnd: props.yearEnd,
    priceStart: props.PriceStart,
    priceEnd: props.PriceEnd,
    badges,
    linkPrefix: "guitars",
  };

  return <ProductCard {...productCardProps} />;
}
