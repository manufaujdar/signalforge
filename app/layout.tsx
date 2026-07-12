import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  return {
    title: "SignalForge — Content Intelligence",
    description: "Evaluate, enhance, and learn from social media content with transparent signals and human approval.",
    icons: { icon: "/favicon.svg" },
    openGraph: { title: "SignalForge", description: "Turn a good post into a stronger one.", images: [image] },
    twitter: { card: "summary_large_image", title: "SignalForge", description: "Transparent signals. Human approval.", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
