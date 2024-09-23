"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import Taskbar from "@/components/Taskbar";



export default function Medicine() {
    const { data: session, status } = useSession();
    return (
        <main>
            <Navbar session={session} />
            <Taskbar />
            


        </main>
    )
}