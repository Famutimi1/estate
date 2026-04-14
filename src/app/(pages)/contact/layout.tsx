import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Stan Grace Properties LTD. Whether you want to buy, sell, or rent a property in Nigeria, our team is ready to help you.",
  openGraph: {
    title: "Contact Stan Grace Properties LTD",
    description:
      "Reach out to Stan Grace Properties LTD for enquiries about buying, selling, or renting properties in Nigeria.",
    url: "/contact",
  },
  twitter: {
    title: "Contact Stan Grace Properties LTD",
    description:
      "Reach out to Stan Grace Properties LTD for enquiries about buying, selling, or renting properties in Nigeria.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
