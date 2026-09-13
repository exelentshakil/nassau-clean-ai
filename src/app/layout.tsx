import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NassauClean AI — Residential Cleaning Booking & Dispatch System",
  description: "AI-Powered Online Booking, Dynamic Pricing & Multi-Team Scheduling for Nassau County, NY (Massapequa, Garden City, Syosset).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          {/* Central Demo Traffic Pixel */}
          <img
            src="https://demo-traffic.vercel.app/api/px?p=nassau-clean-ai"
            alt=""
            width={1}
            height={1}
            style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
