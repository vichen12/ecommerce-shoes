import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { ThemeProvider } from "@/components/ui/theme-provider";

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
      <Navbar />
      {children}
      <Footer />
    </ThemeProvider>
  </body>
</html>
  );
}
