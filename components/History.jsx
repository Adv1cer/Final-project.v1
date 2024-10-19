"use client";

import React, { useState, useEffect } from "react";
import Taskbar from "@/components/Taskbar";
import Report from "@/components/Report";
export default function HistoryComponent() {
    
    return (
        <div>
            <div>
            <Taskbar />
            <Report />
            <div className="min-h-screen bg-gray-100 flex justify-center  p-8">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg">
        {/* แถวบน: หัวข้อ + ปุ่ม + ช่องค้นหา */}
        <div className="bg-blue-800 text-white p-4 flex items-center justify-between rounded-t-lg">
          {/* หัวข้อ */}
          <h1 className="text-xl font-semibold">ประวัตินักศึกษา</h1>

          {/* ปุ่มและช่องค้นหา */}
          <div className="flex items-center space-x-4">
            <button className="text-white font-semibold hover:underline">
            ผู้ใช้รายวัน
            </button>
            <button className="text-white font-semibold hover:underline">
            ผู้ใช้รายสัปดาห์
            </button>
            <button className="text-white font-semibold hover:underline">
            ผู้ใช้รายเดือน
            </button>

            <input
              type="text"
              placeholder="search"
              className="ml-4 px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="border px-4 py-2">ชื่อ-นามสกุล</th>
                <th className="border px-4 py-2">รหัสนักศึกษา</th>
                <th className="border px-4 py-2">วันที่</th>
                <th className="border px-4 py-2">เวลา</th>
                <th className="border px-4 py-2">ดูรายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, index) => (
                <tr key={index} className="even:bg-gray-100">
                  <td className="border px-4 py-2"></td>
                  <td className="border px-4 py-2"></td>
                  <td className="border px-4 py-2"></td>
                  <td className="border px-4 py-2"></td>
                  <td className="border px-4 py-2"></td>
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