"use client";

import React from 'react';
import { useSession } from "next-auth/react";

function Footer() {
  const { data: session, status } = useSession();

  return (
    <footer className="w-full bg-gray-100 py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} UTCC Infirmary. All rights reserved.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {status === "loading"
            ? "Loading..."
            : session
            ? `Logged in as: ${session.user.email || session.user.name}`
            : "You are not logged in."}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
