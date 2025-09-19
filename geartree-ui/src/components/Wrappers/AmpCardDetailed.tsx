
// src/components/AmpCardDetailed.tsx
import ProductCard from "../ProductCard";
import type { ProductCardProps } from "../ProductCard";
import type{ BadgeItem } from "../OneLineBadges";
import type { Amplifier } from "../../types";

interface AmpCardDetailedProps extends Amplifier {}

export default function AmpCardDetailed(props: AmpCardDetailedProps) {
  // Build badges array
  const badges: BadgeItem[] = [
    { text: props.isTube ? "Tube" : "Solid-State", color: props.isTube ? "red" : "blue" },
  ];

  if (props.gainStructure) {
    badges.push({ text: props.gainStructure, color: "grape" });
  }

  if (props.wattage > 0) {
    badges.push({ text: `${props.wattage}W`, color: "green" });
  }

  // Add price badge if present
  if (props.priceStart != null && props.priceStart > 0) {
    const priceText = `~$${props.priceStart}${
      props.priceEnd != null && props.priceEnd > props.priceStart 
        ? ` - $${props.priceEnd}` 
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
    manufacturer: props.manufacturer,
    yearStart: props.yearStart,
    yearEnd: props.yearEnd,
    priceStart: props.priceStart ?? undefined,
    priceEnd: props.priceEnd ?? undefined,
    badges,
    linkPrefix: "amplifiers",
    height: 400, // You can adjust this to match your original detailed card height
    additionalInfo: props.speakerConfiguration,
  };

  return <ProductCard {...productCardProps} />;
}
