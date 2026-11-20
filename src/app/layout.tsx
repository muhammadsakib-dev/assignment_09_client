import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer, FooterWrapper } from "@/components/footer";
import { Header, HeaderWrapper } from "@/components/header";
import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/ui/toast";
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <Toaster>
            <HeaderWrapper>
              <Header />
            </HeaderWrapper>
            <main className="flex-1">{children}</main>
            <FooterWrapper>
              <Footer />
            </FooterWrapper>
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
