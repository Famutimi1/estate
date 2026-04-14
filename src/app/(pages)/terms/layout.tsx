import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the Stan Grace Properties LTD Terms and Conditions governing the use of our website, platform, and real estate services.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms & Conditions | Stan Grace Properties LTD",
    url: "/terms",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
