import { jenyWrapped } from "@/data/jeny";
import { publicAsset } from "@/lib/assets.mjs";
import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@/styles/globals.css";
export const metadata: Metadata = {
  title: `${jenyWrapped.person.nickname} Wrapped ${jenyWrapped.year}`,
  description: jenyWrapped.intro,
  icons: { icon: publicAsset("/icon.svg") },
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
