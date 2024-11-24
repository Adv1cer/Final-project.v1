"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useSession } from "next-auth/react";
import 'react-toastify/dist/ReactToastify.css';
import Footer from "@/components/Footer";
import Prescription from '@/components/Prescription';
import Taskbar from '@/components/Taskbar';

export default function TicketPage() {
    const { data: session } = useSession();
    return (

        <div>
            <div>
                <Navbar session={session} />
                <Taskbar />
            </div>
            <div>
                <Prescription />
            </div>
            <div>
            <Footer />
            </div>
        </div>
    );
}