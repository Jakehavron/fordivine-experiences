import type { Metadata } from "next";
import "./globals.css";
import "./site-chrome.css";

export const metadata: Metadata = {
  title: "FORDIVINE Journal",
  description: "Authority-building insights for established female entrepreneurs.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
