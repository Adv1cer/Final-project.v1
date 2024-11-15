"use client";
import "./globals.css";
import { AuthProvider } from "./provider";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import { Suspense } from "react";

const inter = IBM_Plex_Sans_Thai({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({ children }) {
  return (
    <html>
      <head></head>

      <body className={`${inter.className} bg-wave`}>
        <main>
          <Suspense fallback={<div>Loading...</div>}>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
