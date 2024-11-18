"use client";

import React, { useState, useEffect } from "react";
import Taskbar from "@/components/Taskbar";
import Report from "@/components/Report";
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

const fetchTickets = async (setTickets, setError) => {
  try {
    const response = await fetch("/api/dashboard");
    const data = await response.json();
    if (response.ok) {
      setTickets(data || []);
    } else {
      setError(data.error || "Failed to fetch tickets");
    }
  } catch (error) {
    setError("Error fetching tickets");
    console.error("Error fetching tickets:", error);
  }
};

const formatDate = (datetime) => {
  const date = new Date(datetime);
  const dateString = date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeString = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateString}\nเวลา ${timeString}`;
};

export default function HistoryComponent() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTickets(setTickets, setError);
  }, []);

  // Filter tickets to show only those with status 0
  const finishedTickets = tickets.filter((ticket) => ticket.status === 0);

  // Filter tickets based on search query
  const filteredTickets = finishedTickets.filter(
    (ticket) =>
      ticket.patient_id.includes(searchQuery) ||
      ticket.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div>
        <Taskbar />
        <Report />
        <div className="min-h-screen bg-gray-100 flex justify-center p-8">
          <div className="w-full max-w-5xl bg-white shadow-md rounded-lg">
            <div className="bg-blue-800 text-white p-4 flex items-center justify-between rounded-t-lg">
              <h1 className="text-xl font-semibold mx-10">ประวัตินักศึกษา</h1>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="search"
                  className="text-black ml-4 px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-center">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="py-2 px-4 border-b text-center">
                    รหัสนักศึกษา
                  </th>
                  <th className="py-2 px-4 border-b text-center">สถานะ</th>
                  <th className="py-2 px-4 border-b text-center">
                    วันที่และเวลา
                  </th>
                  <th className="py-2 px-4 border-b text-center">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.patientrecord_id}
                      className="border bg-green-100 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg"
                    >
                      <td className="py-2 px-4 border-b text-center">
                        {ticket.patient_name}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {ticket.patient_id}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {ticket.role}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {new Date(ticket.datetime).toLocaleString()}
                      </td>
                      <Dialog className="">
                        <DialogTrigger asChild>
                          <td className="py-2 px-4 border-b text-blue-700 cursor-pointer text-center">
                            ดูข้อมูล
                          </td>
                        </DialogTrigger>
                        <DialogContent className="w-full">
                          <DialogHeader>
                            <DialogTitle>Patient Ticket</DialogTitle>
                            <DialogDescription>
                              Status: Finished
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-1">
                            <div>
                              <h3 className="ml-10 text-lg">ชื่อ-นามสกุล</h3>
                              <div className="ml-16">{ticket.patient_name}</div>
                            </div>
                            <div>
                              <h3 className="ml-10 text-lg">รหัสนักศึกษา</h3>
                              <div className="ml-16">{ticket.patient_id}</div>
                            </div>
                            <div>
                              <h3 className="ml-10 text-lg">เวลาเช็คอิน</h3>
                              <div className="ml-16">
                                {formatDate(ticket.datetime)}
                              </div>
                            </div>
                            <br />
                            <h3 className="ml-10 text-lg">อาการของผู้ป่วย</h3>
                            {ticket.symptom_names ? (
                              <div className="ml-10 space-y-2 text-lg">
                                <p className="ml-10">
                                  {ticket.symptom_names
                                    .split(",")
                                    .map((symptom) => symptom.trim())
                                    .join(", ")}
                                </p>
                              </div>
                            ) : (
                              <p className="ml-10 text-lg">
                                ไม่มีอาการที่บันทึกไว้
                              </p>
                            )}
                            {ticket.other_symptoms && (
                              <div className="ml-10 mt-2">
                                <h3>หมายเหตุ</h3>
                                <div className="space-y-2 ml-10">
                                  {ticket.other_symptoms
                                    .split(",")
                                    .map((symptom, index) => (
                                      <p key={index}>{symptom.trim()}</p>
                                    ))}
                                </div>
                              </div>
                            )}

                            {ticket.pill_quantities && (
                              <div className="mt-2">
                                <div className="space-y-2 bg-blue-800">
                                  <table className="border-collapse border mx-auto w-full max-w-4xl">
                                    <thead>
                                      <h3 className="text-xl font-semibold py-2 text-white bg-blue-800 text-center">
                                        บันทึกยา
                                      </h3>
                                      <tr className="border bg-gray-200">
                                        <th className="border px-4 py-2">
                                        ไอดียา
                                        </th>
                                        <th className="border px-4 py-2">
                                          ชื่อยา
                                        </th>
                                        <th className="border px-4 py-2">
                                          จำนวน
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {ticket.pill_quantities
                                        .split(",")
                                        .map((quantity, index) => (
                                          <tr key={index}>
                                            <td className="border px-4 py-2">
                                              {ticket.pillstock_ids
                                                ? ticket.pillstock_ids.split(
                                                    ","
                                                  )[index]
                                                : "Unknown"}
                                            </td>
                                            <td className="border px-4 py-2">
                                              {ticket.pill_names
                                                ? ticket.pill_names.split(",")[
                                                    index
                                                  ]
                                                : "Unknown"}
                                            </td>
                                            <td className="border px-4 py-2">
                                              {quantity.trim()}{" "}
                                              {ticket.unit_type}
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="secondary">
                                ปิด
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No patient listed currently.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}