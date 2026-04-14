import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Stan Grace Properties LTD Privacy Policy to understand how we collect, use, and protect your personal information.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy | Stan Grace Properties LTD",
    url: "/privacy",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
