import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import MuteButton from "@/components/MuteButton";

export const metadata: Metadata = {
  title: "Karley's Quiz Practice",
  description: "Quiz Bowl Flash Cards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <NavBar />
        <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
        <MuteButton />
      </body>
    </html>
  );
}
