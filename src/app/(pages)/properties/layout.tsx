import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Browse our full listings of houses, apartments, land, and commercial properties for sale and rent across Nigeria. Updated listings with verified details.",
  openGraph: {
    title: "Properties for Sale & Rent in Nigeria | Stan Grace Properties LTD",
    description:
      "Browse verified houses, apartments, and commercial properties for sale and rent across Nigeria.",
    url: "/properties",
  },
  twitter: {
    title: "Properties for Sale & Rent in Nigeria | Stan Grace Properties LTD",
    description:
      "Browse verified houses, apartments, and commercial properties for sale and rent across Nigeria.",
  },
};

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
