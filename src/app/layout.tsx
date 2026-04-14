import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from '@/contexts/SettingsContext';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://stangraceproperties.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Stan Grace Properties LTD - Find Your Perfect Home in Nigeria",
    template: "%s | Stan Grace Properties LTD",
  },
  description: "Find your perfect home in Nigeria with Stan Grace Properties LTD. Browse verified houses, apartments, and commercial properties for sale and rent across Lagos, Abuja, and beyond.",
  keywords: [
    "real estate Nigeria",
    "properties for sale Nigeria",
    "houses for rent Lagos",
    "houses for rent Abeokuta",
    "houses for rent Ibadan",
    "houses for rent Ogun State",
    "houses for rent Oyo",
    "apartments Abuja",
    "Stan Grace Properties",
    "buy land Nigeria",
    "property investment Nigeria",
    "real estate Lagos",
  ],
  authors: [{ name: "Stan Grace Properties LTD", url: BASE_URL }],
  creator: "Stan Grace Properties LTD",
  publisher: "Stan Grace Properties LTD",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: BASE_URL,
    siteName: "Stan Grace Properties LTD",
    title: "Stan Grace Properties LTD - Find Your Perfect Home in Nigeria",
    description: "Find your perfect home in Nigeria with Stan Grace Properties LTD. Browse verified houses, apartments, and commercial properties for sale and rent.",
    images: [
      {
        url: "/company_logo/company_logo.png",
        width: 1200,
        height: 630,
        alt: "Stan Grace Properties LTD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stan Grace Properties LTD - Find Your Perfect Home in Nigeria",
    description: "Find your perfect home in Nigeria with Stan Grace Properties LTD.",
    images: ["/company_logo/company_logo.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/company_logo/company_logo.png",
    shortcut: "/company_logo/company_logo.png",
    apple: "/company_logo/company_logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Stan Grace",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <meta name="theme-color" content="#15803d" />
        <link rel="apple-touch-icon" href="/company_logo/company_logo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "Stan Grace Properties LTD",
              url: BASE_URL,
              logo: `${BASE_URL}/company_logo/company_logo.png`,
              image: `${BASE_URL}/company_logo/company_logo.png`,
              description: "Nigeria's trusted real estate agency helping buyers, sellers, and investors find verified properties.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "NG",
              },
              sameAs: [],
            }),
          }}
        />
        <SettingsProvider>
          {children}
          <PWAInstallPrompt />
        </SettingsProvider>
      </body>
    </html>
  );
}
