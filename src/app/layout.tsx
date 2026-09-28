import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@/styles/globals.css";
export const metadata: Metadata = {
  title: "Jeny Wrapped 2026",
  description: "uma retrospectiva completamente imparcial",
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#123df5",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
