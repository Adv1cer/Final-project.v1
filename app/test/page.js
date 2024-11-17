"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Test() {
  const [pillList, setPillList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pillstocklist, setpillstocklist] = useState([]);
  const [selectedPillId, setSelectedPillId] = useState(null);

  useEffect(() => {
    const fetchPills = async () => {
      try {
        const response = await fetch("/api/medicine/pill");
        const data = await response.json();
        setPillList(data);
      } catch (error) {
        console.error("Error fetching pills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPills();
  }, []);

  useEffect(() => {
    const fetchpillstocklist = async (pillId) => {
      try {
        const response = await fetch(`/api/pillstock?p=${pillId}`);
        const data = await response.json();
        setpillstocklist(data);
      } catch (error) {
        console.error("Error fetching pills:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedPillId) {
      fetchpillstocklist(selectedPillId);
    }
  }, [selectedPillId]);

  const handleRowClick = (pillId) => {
    setSelectedPillId(selectedPillId === pillId ? null : pillId);
  };


  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700">
        <div className="flex items-center justify-center">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="height-screen">
      <Navbar />
      <div className="flex-grow flex justify-center items-center bg-custom">
        <div className="w-full max-w-7xl bg-white shadow-md table-rounded">
          <div className="bg-blue-800 text-white p-4 flex items-center justify-between table-rounded">
            <h1 className="text-xl font-semibold">รายชื่อยาในระบบ</h1>
          </div>
          <table className="border-collapse border mx-auto w-full max-w-7xl">
            <thead>
              <tr className="border bg-gray-200">
                <th className="border px-4 py-2">Pill Id</th>
                <th className="border px-4 py-2">Pill Name</th>
                <th className="border px-4 py-2">Dose</th>
                <th className="border px-4 py-2">Type Name</th>
                <th className="border px-4 py-2">Unit Type</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(pillList) && pillList.length > 0 ? (
                pillList.map((pill, index) => (
                  <React.Fragment key={`${pill.pill_id}-${index}`}>
                    <tr
                      className="cursor-pointer"
                      onClick={() => handleRowClick(pill.pill_id)}
                    >
                      <td className="border px-4 py-2">{pill.pill_id}</td>
                      <td className="border px-4 py-2">{pill.pill_name}</td>
                      <td className="border px-4 py-2">{pill.dose}</td>
                      <td className="border px-4 py-2">{pill.type_name}</td>
                      <td className="border px-4 py-2">{pill.unit_type}</td>
                      <td className="border px-4 py-2">
                        <button className="bg-yellow-400 text-white rounded px-2 py-1">
                          Edit
                        </button>
                      </td>
                    </tr>
                    {selectedPillId === pill.pill_id && (
                      <tr>
                        <td colSpan="6">
                          <table className="border-collapse border mx-auto w-full max-w-7xl mt-2">
                            <thead>
                              <tr className="border bg-gray-200">
                                <th className="border px-4 py-2">Lot Id</th>
                                <th className="border px-4 py-2">Pill Name</th>
                                <th className="border px-4 py-2">Dose</th>
                                <th className="border px-4 py-2">Type Name</th>
                                <th className="border px-4 py-2">Expire Date</th>
                                <th className="border px-4 py-2">Total</th>
                                <th className="border px-4 py-2">Unit Type</th>
                                <th className="border px-4 py-2">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pillstocklist?.map((item) => (
                                <tr
                                  key={item.pillstock_id}
                                  className={`border ${
                                    Number(item.total) <= 100
                                      ? "bg-red-500 text-red-500"
                                      : "bg-blue-100 text-black"
                                  }`}
                                >
                                  <td className="border px-4 py-2">
                                    {item.pillstock_id}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {item.pill_name}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {item.dose}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {item.type_name}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {item.expire
                                      ? new Date(item.expire).toLocaleDateString()
                                      : "N/A"}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {item.total}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {item.unit_type}
                                  </td>
                                  <td className="border px-4 py-2 flex justify-center">
                                    <button className="bg-yellow-400 text-white rounded px-2 py-1">
                                      Edit
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    currently no pill in stock
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}