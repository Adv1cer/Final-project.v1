"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicineComponent from "@/components/Medicine";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Taskbar from "@/components/Taskbar";

function Medicine() {
  const { data: session, status } = useSession();
  return (
    <div>
      <div>
      <Navbar session={session} />
      <Taskbar />
      </div>
      <main>
        <MedicineComponent />
      </main>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default Medicine;
