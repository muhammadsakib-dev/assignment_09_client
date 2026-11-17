import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/header/header";
import HeaderWrapper from "@/components/header/header-wrapper";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WedPlan | Wedding Planning Platform",
  description:
    "Plan, book, and celebrate your dream wedding with premier vendors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
