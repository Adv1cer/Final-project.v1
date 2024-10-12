"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PatientForm from "@/components/PatientForm";
import Footer from "@/components/Footer";

const HealthForm = () => {

  return (
    <div>
      <Navbar />
      <PatientForm />
      <Footer />
    </div>
    
  );
};

export default HealthForm;
