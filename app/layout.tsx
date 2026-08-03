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

  return {
    metadataBase: new URL(origin),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: seo.shareImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [seo.shareImageUrl],
    },
    icons: {
      icon: [{url: "/favicon.svg", type: "image/svg+xml"}],
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const {isEnabled} = await draftMode();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
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
