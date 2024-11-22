"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

import LoginForm from "@/components/Login";
import Footer from "@/components/Footer";

export default function() {

  return (
    <div className="flex flex-col justify-between h-screen m-0 p-0">
      <Navbar />
      <div className="flex-grow flex justify-center items-center bg-custom">
        <LoginForm />
      </div>
      <Footer />
    </div>
  );
};


