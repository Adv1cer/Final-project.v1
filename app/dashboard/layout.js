"use client"
import { Inter } from "next/font/google";
import "../globals.css";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { AuthProvider } from "../provider";
import IdleTimer from "../IdleTimeout";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({ children }) {
    return (

        <section className={inter.className}>
            <header>

            </header>
            <AuthProvider>
            <IdleTimer />
                {children}
            </AuthProvider>
        </section>

    )
}
