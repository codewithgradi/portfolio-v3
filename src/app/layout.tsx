import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gradi Puata — Software Engineer & Full-Stack Builder",
  description: "The portfolio of Gradi Puata, a product-minded software engineer crafting scalable backends and intuitive digital experiences.",
  keywords: ["software engineer", "full-stack developer", "TypeScript", "Next.js", "portfolio"],
  openGraph: {
    title: "Gradi Puata — Software Engineer",
    description: "Scalable systems. Intuitive experiences. Thoughtful engineering.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#efefeb",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
