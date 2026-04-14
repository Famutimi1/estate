import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stangraceproperties.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/properties`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic property pages (published only)
  let propertyPages: MetadataRoute.Sitemap = [];
  try {
    const properties = await prisma.property.findMany({
      select: { id: true, createdAt: true },
      where: { status: "publish" },
    });
    propertyPages = properties.map((p) => ({
      url: `${baseUrl}/properties/${p.id}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Silently skip dynamic pages if DB unreachable at build time
  }

  return [...staticPages, ...propertyPages];
}

