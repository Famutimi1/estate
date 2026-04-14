import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Stan Grace Properties LTD — Nigeria's trusted real estate agency helping buyers, sellers, and investors secure verified land and properties since our founding.",
  openGraph: {
    title: "About Stan Grace Properties LTD",
    description:
      "Stan Grace Properties LTD was founded to solve land fraud and insecure property transactions in Nigeria. Discover our story, team, and mission.",
    url: "/about",
  },
  twitter: {
    title: "About Stan Grace Properties LTD",
    description:
      "Stan Grace Properties LTD was founded to solve land fraud and insecure property transactions in Nigeria.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
