"use client";

import Test from "@/components/Test";
import React from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import HistoryComponent from "@/components/History";
import Taskbar from "@/components/Taskbar";
import Report from "@/components/Report";

function History() {
  const { data: session } = useSession();
  return (
    <main>
      <Navbar session={session} />
      <Taskbar />
      <Report />
    </main>
  );
}

export default History;