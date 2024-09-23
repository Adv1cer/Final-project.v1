"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useSession } from "next-auth/react";

export default function TicketPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    const ticket_id = pathname.split('/').pop();

    useEffect(() => {
        if (!ticket_id) {
            router.push('/dashboard');
            return;
        }

        if (status === 'loading') {
            return;
          }
      
          if (!session) {
            router.push('/');
            return;
          }

        async function fetchTicket() {
            try {
                const response = await fetch(`/api/ticket/${ticket_id}`);

                if (!response.ok) {
                    const text = await response.text();
                    if (text.includes('<!DOCTYPE html>')) {
                        console.error('Received HTML response:', text);
                        throw new Error('Received HTML response, possibly a 404 or error page.');
                    }
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setTicket(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchTicket();
    }, [ticket_id, router, session, status]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!ticket) {
        return <div>No ticket found.</div>;
    }

    return (
        <main>
            <Navbar session={session} />
            <div>
                <div className="flex min-h-screen bg-gray-100">
                    <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full m-auto">
                        <h1 className="flex justify-center content-center text-xl">Ticket Details</h1>
                        <p>Ticket ID: {ticket.ticket_id}</p>
                        <p>Date and Time: {new Date(ticket.datetime).toLocaleString()}</p>
                        <p>Student Name: {ticket.student_name}</p>
                        <h2>Symptoms</h2>
                        {ticket.symptoms.length > 0 ? (
                            <ul>
                                {ticket.symptoms.map((symptom, index) => (
                                    <li key={symptom.symptomrecord_id || index}>
                                        {symptom.symptom_name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No symptoms recorded.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
