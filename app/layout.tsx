import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Title face — PetrovSans (local, bundled in app/fonts)
const petrov = localFont({
  variable: "--font-petrov",
  display: "swap",
  src: [
    { path: "./fonts/PetrovSans-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/PetrovSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/PetrovSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/PetrovSans-Bold.ttf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Temis — Selected Work",
  description: "A coverflow showcase of selected creative work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${petrov.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
