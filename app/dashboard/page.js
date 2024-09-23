"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Taskbar from "@/components/Taskbar";
import Display from "@/components/Display";
import { DialogDescription } from "@radix-ui/react-dialog";

function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTicket = async (ticket) => {
    if (!ticket || !ticket.ticket_id) {
      console.error("Invalid ticket data:", ticket);
      return;
    }

    const query = new URLSearchParams({
      ticket_id: ticket.ticket_id,
      student_name: ticket.student_name || "Unknown",
      student_id: ticket.student_id || "Unknown",
      datetime: ticket.datetime || new Date().toISOString(),
      symptoms: ticket.symptom_names || "No symptoms recorded",
    }).toString();

    const url = `/ticket/${ticket.ticket_id}?${query}`;
    console.log("Navigating to:", url);
    router.push(url);
  };

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!session) {
      router.push('/');
      return;
    }

    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [session, status, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

  const sortedTickets = tickets.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
  
  const todayTickets = sortedTickets.filter(ticket => {
    const ticketDate = new Date(ticket.datetime);
    return ticketDate >= startOfDay && ticketDate <= endOfDay;
  });

  const activeTickets = todayTickets.filter(ticket => ticket.status === 1);
  const finishedTickets = todayTickets.filter(ticket => ticket.status !== 1);

  return (
    <div>
      <Navbar session={session} />
      <div>
        <Taskbar />
        <Display />
        <div className="flex flex-col items-center h-screen bg-gray-100 text-center">
          <div className="bg-white w-full max-w-3xl rounded shadow-md mt-4">
            <div className="bg-blue-900 text-white text-lg font-semibold p-4 rounded-t-md">
              รายชื่อผู้ป่วย (Active)
            </div>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ชื่อ-นามสกุล</th>
                  <th className="py-2 px-4 border-b">รหัสนักศึกษา</th>
                  <th className="py-2 px-4 border-b">วันที่และเวลา</th>
                  <th className="py-2 px-4 border-b">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {activeTickets.map((ticket) => (
                  <tr key={ticket.ticket_id}>
                    <td className="py-2 px-4 border-b">{ticket.student_name}</td>
                    <td className="py-2 px-4 border-b">{ticket.student_id}</td>
                    <td className="py-2 px-4 border-b">{new Date(ticket.datetime).toLocaleString()}</td>
                    <Dialog>
                      <DialogTrigger asChild>
                        <td className="py-2 px-4 border-b text-blue-700 cursor-pointer">สั่งยา</td>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Patient Ticket</DialogTitle>
                          <DialogDescription>Status: Active</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2 py-1">
                          <h3 className="ml-10">Name: {ticket.student_name}</h3>
                          <h3 className="ml-10">Student ID: {ticket.student_id}</h3>
                          <h3 className="ml-10">
                            Check-in Time:{" "}
                            {new Date(ticket.datetime).toLocaleString("th-TH", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </h3>
                          <br />
                          <h3 className="ml-10">Patient Symptoms</h3>
                          {ticket.symptom_names ? (
                            <div className="ml-10 space-y-2">
                              {ticket.symptom_names.split(",").map((symptom, index) => (
                                <p key={index} className="block">{symptom.trim()}</p>
                              ))}
                            </div>
                          ) : (
                            <p className="ml-10">No symptoms recorded</p>
                          )}
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">Close</Button>
                          </DialogClose>
                          <Button type="submit" onClick={() => handleTicket(ticket)}>สั่งยา</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <td className="py-2 px-4 border-b text-red-500 cursor-pointer">เสร็จสิน</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white w-full max-w-3xl rounded shadow-md mt-4">
            <div className="bg-blue-900 text-white text-lg font-semibold p-4 rounded-t-md">
              รายชื่อผู้ป่วย (Finished)
            </div>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ชื่อ-นามสกุล</th>
                  <th className="py-2 px-4 border-b">รหัสนักศึกษา</th>
                  <th className="py-2 px-4 border-b">วันที่และเวลา</th>
                  <th className="py-2 px-4 border-b">ดูรายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                {finishedTickets.map((ticket) => (
                  <tr key={ticket.ticket_id}>
                    <td className="py-2 px-4 border-b">{ticket.student_name}</td>
                    <td className="py-2 px-4 border-b">{ticket.student_id}</td>
                    <td className="py-2 px-4 border-b">{new Date(ticket.datetime).toLocaleString()}</td>

                    <Dialog>
                      <DialogTrigger asChild>
                        <td className="py-2 px-4 border-b text-blue-700 cursor-pointer">ดูรายละเอียด</td>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Patient Ticket</DialogTitle>
                          <DialogDescription>Status: Finished</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2 py-1">
                          <h3 className="ml-10">Name: {ticket.student_name}</h3>
                          <h3 className="ml-10">Student ID: {ticket.student_id}</h3>
                          <h3 className="ml-10">
                            Check-in Time:{" "}
                            {new Date(ticket.datetime).toLocaleString("th-TH", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </h3>
                          <br />
                          <h3 className="ml-10">Patient Symptoms</h3>
                          {ticket.symptom_names ? (
                            <div className="ml-10 space-y-2">
                              {ticket.symptom_names.split(",").map((symptom, index) => (
                                <p key={index} className="block">{symptom.trim()}</p>
                              ))}
                            </div>
                          ) : (
                            <p className="ml-10">No symptoms recorded</p>
                          )}
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;