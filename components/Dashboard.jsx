"use client";

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
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Taskbar from "@/components/Taskbar";
import Display from "@/components/Display";

export default function DashboardComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentActiveTodayPage, setCurrentActiveTodayPage] = useState(1);
  const [currentFinishedPage, setCurrentFinishedPage] = useState(1);
  const itemsPerPage = 10;

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
      other_symptom: ticket.other_symptom || "No other symptoms",
    }).toString();

    const url = `/ticket/${ticket.ticket_id}?${query}`;
    console.log("Navigating to:", url);
    router.push(url);
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ticket_id) => {
    try {
      const res = await fetch(`/api/ticket/${ticket_id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.ticket_id !== ticket_id)
      );
    } catch (error) {
      console.error("Error deleting ticket:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      router.push("/");
      return;
    }

    fetchTickets();

    const intervalId = setInterval(fetchTickets, 5000);

    return () => clearInterval(intervalId);
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        No tickets found.
      </div>
    );
  }

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0,
    0
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );

  const sortedTickets = tickets.sort(
    (a, b) => new Date(b.datetime) - new Date(a.datetime)
  );

  const todayTickets = sortedTickets.filter((ticket) => {
    const ticketDate = new Date(ticket.datetime);
    return ticketDate >= startOfDay && ticketDate <= endOfDay;
  });

  const activeTickets = todayTickets.filter((ticket) => ticket.status === 1);
  const finishedTickets = todayTickets.filter((ticket) => ticket.status !== 1);

  // Pagination Logic for Active Today
  const totalActiveTodayPages = Math.ceil(activeTickets.length / itemsPerPage);
  const indexActiveTodayLast = currentActiveTodayPage * itemsPerPage;
  const indexActiveTodayFirst = indexActiveTodayLast - itemsPerPage;
  const currentActiveTodayTickets = activeTickets.slice(
    indexActiveTodayFirst,
    indexActiveTodayLast
  );

  // Pagination Logic for Finished Tickets
  const totalFinishedPages = Math.ceil(finishedTickets.length / itemsPerPage);
  const indexFinishedLast = currentFinishedPage * itemsPerPage;
  const indexFinishedFirst = indexFinishedLast - itemsPerPage;
  const currentFinishedTickets = finishedTickets.slice(
    indexFinishedFirst,
    indexFinishedLast
  );

  const handleActiveTodayPageChange = (pageNumber) => {
    setCurrentActiveTodayPage(pageNumber);
  };

  const handleFinishedPageChange = (pageNumber) => {
    setCurrentFinishedPage(pageNumber);
  };

  return (
    <div>
      <div>
        <Taskbar />
        <Display />
        <div className="flex flex-col items-center bg-gray-100 text-center overflow-y-auto min-h-screen p-4">
          <div className="bg-white w-full max-w-4xl rounded shadow-md mt-4">
            <div className="bg-blue-900 text-white text-lg font-semibold p-4 rounded-t-md">
              รายชื่อผู้ป่วย (Active Today)
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
                {currentActiveTodayTickets.map((ticket) => (
                  <tr
                    key={ticket.ticket_id}
                    className="border bg-blue-100 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg"
                  >
                    <td className="py-2 px-4 border-b">
                      {ticket.student_name}
                    </td>
                    <td className="py-2 px-4 border-b">{ticket.student_id}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(ticket.datetime).toLocaleString()}
                    </td>
                    <Dialog>
                      <DialogTrigger asChild>
                        <td className="py-2 px-4 border-b text-blue-700 cursor-pointer">
                          สั่งยา
                        </td>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Patient Ticket</DialogTitle>
                          <DialogDescription>Status: Active</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2 py-1">
                          <h3 className="ml-10">
                            Name: {ticket.student_name}
                          </h3>
                          <h3 className="ml-10">
                            Student ID: {ticket.student_id}
                          </h3>
                          <h3 className="ml-10">
                            Check-in Time:{" "}
                            {new Date(ticket.datetime).toLocaleString()}
                          </h3>
                          <br />
                          <h3 className="ml-10">Patient Symptoms</h3>
                          {ticket.symptom_names ? (
                            <div className="ml-10 space-y-2">
                              {ticket.symptom_names
                                .split(",")
                                .map((symptom, index) => (
                                  <p key={index} className="block">
                                    {symptom.trim()}
                                  </p>
                                ))}
                            </div>
                          ) : (
                            <p className="ml-10">No symptoms recorded</p>
                          )}
                          {ticket.other_symptom && (
                            <div className="ml-10 mt-2">
                              <h3>Other Symptoms:</h3>
                              <p>{ticket.other_symptom}</p>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                          <Button
                            type="button"
                            onClick={() => handleTicket(ticket)}
                          >
                            สั่งยา
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <td
                      className="py-2 px-4 border-b text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                      onClick={() => handleDelete(ticket.ticket_id)}
                    >
                      ลบ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalActiveTodayPages > 1 && (
              <div className="flex justify-center my-2">
                {Array.from({ length: totalActiveTodayPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handleActiveTodayPageChange(index + 1)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentActiveTodayPage === index + 1
                          ? "bg-blue-500 text-white hover:bg-blue-700"
                          : "bg-gray-300 hover:bg-gray-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white w-full max-w-4xl rounded shadow-md mt-4">
            <div className="bg-green-900 text-white text-lg font-semibold p-4 rounded-t-md">
              รายชื่อผู้ป่วย (Finished)
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
                {currentFinishedTickets.map((ticket) => (
                  <tr
                    key={ticket.ticket_id}
                    className="border bg-green-100 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg"
                  >
                    <td className="py-2 px-4 border-b">
                      {ticket.student_name}
                    </td>
                    <td className="py-2 px-4 border-b">{ticket.student_id}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(ticket.datetime).toLocaleString()}
                    </td>
                    <Dialog>
                      <DialogTrigger asChild>
                        <td className="py-2 px-4 border-b text-blue-700 cursor-pointer">
                          ดูข้อมูล
                        </td>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Patient Ticket</DialogTitle>
                          <DialogDescription>Status: Finished</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2 py-1">
                          <h3 className="ml-10">
                            Name: {ticket.student_name}
                          </h3>
                          <h3 className="ml-10">
                            Student ID: {ticket.student_id}
                          </h3>
                          <h3 className="ml-10">
                            Check-in Time:{" "}
                            {new Date(ticket.datetime).toLocaleString()}
                          </h3>
                          <br />
                          <h3 className="ml-10">Patient Symptoms</h3>
                          {ticket.symptom_names ? (
                            <div className="ml-10 space-y-2">
                              {ticket.symptom_names
                                .split(",")
                                .map((symptom, index) => (
                                  <p key={index} className="block">
                                    {symptom.trim()}
                                  </p>
                                ))}
                            </div>
                          ) : (
                            <p className="ml-10">No symptoms recorded</p>
                          )}
                          {ticket.other_symptom && (
                            <div className="ml-10 mt-2">
                              <h3>Other Symptoms:</h3>
                              <p>{ticket.other_symptom}</p>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                          <Button
                            type="button"
                            onClick={() => handleTicket(ticket)}
                          >
                            ดูข้อมูล
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalFinishedPages > 1 && (
              <div className="flex justify-center my-2">
                {Array.from({ length: totalFinishedPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handleFinishedPageChange(index + 1)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentFinishedPage === index + 1
                          ? "bg-blue-500 text-white hover:bg-blue-700"
                          : "bg-gray-300 hover:bg-gray-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}