import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about buying, selling, renting, and investing in properties with Stan Grace Properties LTD in Nigeria.",
  openGraph: {
    title: "FAQ | Stan Grace Properties LTD",
    description:
      "Answers to the most common questions about property buying, selling, renting, and investing in Nigeria.",
    url: "/faq",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I buy a property in Nigeria?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Browse our verified listings, contact the agent or owner directly through the listing, arrange a viewing, carry out due diligence on title documents, and complete the transaction with a registered lawyer.",
      },
    },
    {
      "@type": "Question",
      name: "Are the properties on Stan Grace verified?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Stan Grace Properties LTD verifies all listings before they go live to protect buyers from land fraud and misrepresentation.",
      },
    },
    {
      "@type": "Question",
      name: "How do I list my property on Stan Grace?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Create an account, go to your dashboard, click 'Add Property', fill in all details including photos and price, and submit for review. Your listing will be live once approved.",
      },
    },
    {
      "@type": "Question",
      name: "Can I negotiate property prices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, most property prices are negotiable. You can communicate with sellers or agents through our messaging system to discuss pricing.",
      },
    },
  ],
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}

