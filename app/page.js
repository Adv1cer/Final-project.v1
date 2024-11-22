"use client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import components
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const PatientForm = dynamic(() => import("@/components/PatientForm"), { ssr: false });

const HealthForm = () => {
  return (
    <div className="flex flex-col justify-between h-screen m-0 p-0">
      <Navbar />
      <div className="flex-grow flex justify-center items-center bg-custom">
        <PatientForm />
      </div>
      <Footer />
    </div>
  );
};

export default HealthForm;