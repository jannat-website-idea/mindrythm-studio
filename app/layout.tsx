import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const avenirFallback = Manrope({
  variable: "--font-avenir",
  subsets: ["latin"],
});

const editorialAccent = Bodoni_Moda({
  variable: "--font-accent",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "Mind Rhythm — Property, Event & Wedding Photography";
  const description = "Professional photography and films for properties, resorts, events, weddings and brands.";

  return {
    metadataBase: new URL(origin),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/og-final.png", width: 1200, height: 630, alt: "Mind Rhythm — Photography and films with a pulse" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-final.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${avenirFallback.variable} ${editorialAccent.variable}`}>{children}</body>
    </html>
  );
}
