// This is a SERVER component — exports generateMetadata for per-listing SEO.
// The actual UI is in PropertyDetailClient.tsx (use client).
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PropertyDetailClient from "./PropertyDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let property: {
    title: string;
    description: string | null;
    address: string;
    city: string | null;
    state: string | null;
    price: { toNumber: () => number } | number;
    propertyType: string;
    propertyStatus: string;
    bedrooms: number;
    bathrooms: number;
    images: string[];
    imageUrl: string | null;
  } | null = null;

  try {
    property = await prisma.property.findUnique({
      where: { id: slug },
      select: {
        title: true,
        description: true,
        address: true,
        city: true,
        state: true,
        price: true,
        propertyType: true,
        propertyStatus: true,
        bedrooms: true,
        bathrooms: true,
        images: true,
        imageUrl: true,
      },
    });
  } catch {
    // Fall back to defaults if DB is unreachable at build time
  }

  if (!property) {
    return {
      title: "Property Listing",
      description: "View property details on Stan Grace Properties LTD.",
    };
  }

  const title = `${property.title} — ${property.propertyType} in ${property.city ?? ""}, ${property.state ?? "Nigeria"}`;
  const statusLabel = property.propertyStatus === "for_sale" ? "For Sale" : "For Rent";
  const priceNum = typeof property.price === "object" ? property.price.toNumber() : property.price;
  const description = `${statusLabel}: ${property.bedrooms}-bed, ${property.bathrooms}-bath ${property.propertyType} at ${property.address}. Price: NGN ${priceNum.toLocaleString()}. ${(property.description ?? "").slice(0, 100)}`.trim();
  const image = property.images?.[0] ?? property.imageUrl ?? "/company_logo/company_logo.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/properties/${slug}`,
      type: "website",
      images: [{ url: image, alt: property.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function PropertyDetailPage() {
  return <PropertyDetailClient />;
}
