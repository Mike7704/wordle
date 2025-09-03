import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wordle",
  description: "A Next.js Wordle clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
