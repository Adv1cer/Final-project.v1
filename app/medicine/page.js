"use client";

import Footer from '@/components/Footer';
import MedicineComponent from '@/components/Medicine';
import React, { useEffect, useState } from 'react';


function Medicine() {

    return (
        <main>
            <MedicineComponent />
            <Footer />
        </main>
    );
}

export default Medicine;
