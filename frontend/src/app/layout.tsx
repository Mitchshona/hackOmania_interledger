import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "well",
  description: "Build Healthy Habits, One Step at a Time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bricolageGrotesque.className}>
      <body>
        <Navbar />
        <main className={bricolageGrotesque.className}>
          {children}
        </main>
      </body>
    </html>
  );
}
