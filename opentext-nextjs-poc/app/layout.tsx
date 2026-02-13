import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
export const metadata: Metadata = { title: "OpenText WebCMS Console", description: "Next.js 14 + LSCS/TeamSite Integration PoC" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="max-w-7xl mx-auto min-h-screen p-4 md:p-8 flex flex-col gap-6">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}