import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import NextTopLoader from "nextjs-toploader"

const urbanist = Urbanist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecommerce-shoes",
  description: "Welcome to the best ecommerce-shoes in the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="en">
  <body className={urbanist.className}>
    <ThemeProvider attribute="class" defaultTheme="system">
      <NextTopLoader
      color="rgba(34, 153, 221, 1)"
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={true}
      easing="ease"
      speed={200}
      shadow="0 0 10px rgba(34, 153, 221, 1,0 0 5px rgba(34, 153, 221, 1"/>
      <Navbar />
      {children}
      <Toaster/>
      <Footer />
    </ThemeProvider>
  </body>
</html>
  );
}
