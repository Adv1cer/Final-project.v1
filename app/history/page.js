"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import HistoryComponent from "@/components/History"; // ตรวจสอบเส้นทาง
import Footer from "@/components/Footer";

function History() {
  const { data: session } = useSession();

  return (
    <main>
      <Navbar session={session} />
      <HistoryComponent />
      <Footer />
    </main>
  );
}

export default History;