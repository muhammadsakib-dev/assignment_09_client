import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Assignment 09",
  description: "Assignment 09 Client",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.className}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        <div>
          {children}
        </div>
        
        </body>
    </html>
  );
}
