import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const editorial = Bodoni_Moda({
  variable: "--font-editorial",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "Mind Rhythm — Image, Motion & Identity";
  const description = "An independent creative studio making images with a pulse.";

  return {
    metadataBase: new URL(origin),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/og-editorial.png", width: 1200, height: 630, alt: "Mind Rhythm — Images with a pulse" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-editorial.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={editorial.variable}>{children}</body>
    </html>
  );
}
