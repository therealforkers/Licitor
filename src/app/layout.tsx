import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTransition } from "react";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Licitor",
  description: "Auction listings and live bidding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-dvh flex-col overflow-hidden antialiased`}
      >
        <Navbar />
        <ViewTransition>
          <div
            data-app-scroll
            className="mt-[74px] flex h-[calc(100dvh-74px)] min-h-0 flex-col overflow-y-auto"
          >
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ViewTransition>
      </body>
    </html>
  );
}
