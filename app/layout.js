"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./provider";
import { Toaster } from "@/components/ui/toaster"



const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>
        <main>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
