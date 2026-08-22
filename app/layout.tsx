import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { headers } from "next/headers";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { getSiteContent } from "@/lib/site-content";
import { SanityLive } from "@/lib/sanity/live";
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
  const {seo} = await getSiteContent({stega: false});
  const title = seo.title;
  const description = seo.description;

  const imageUrl = `${origin}/og-final.png?v=3`;

  return {
    metadataBase: new URL(origin),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Mindrythm",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "Mindrythm" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    icons: {
      icon: [
        {url: "/favicon.ico"},
        {url: "/favicon.svg", type: "image/svg+xml"},
        {url: "/favicon-32x32.png", sizes: "32x32", type: "image/png"},
        {url: "/favicon-16x16.png", sizes: "16x16", type: "image/png"},
        {url: "/mindrythm-logomark.png", type: "image/png"},
      ],
      shortcut: ["/favicon.ico"],
      apple: [{url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png"}],
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const {isEnabled} = await draftMode();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <style
          dangerouslySetInnerHTML={{
            __html: "html,body{background:#fbfaf5!important;color-scheme:light}",
          }}
        />
      </head>
      <body className={`${avenirFallback.variable} ${editorialAccent.variable}`}>
        {children}
        <SanityLive />
        {isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
