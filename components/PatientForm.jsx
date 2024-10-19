"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function PatientForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (session) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [otherSymptom, setOtherSymptom] = useState("");
  const [isOtherChecked, setIsOtherChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    const id = event.target.id;
    if (id === "12") {
      setIsOtherChecked(event.target.checked);
    }

    if (event.target.checked) {
      setSelectedSymptoms((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedSymptoms((prevSelected) =>
        prevSelected.filter((symptomId) => symptomId !== id)
      );
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const symptomLabels = {
      1: "ปวดหัวเป็นไข้",
      2: "ปวดท้อง",
      3: "ท้องเสีย",
      4: "ปวดรอบเดือน",
      5: "เป็นหวัด",
      6: "ปวดฟัน",
      7: "เป็นแผล",
      8: "เป็นลม",
      9: "ตาเจ็บ",
      10: "ผื่นคัน",
      11: "นอนพัก",
      12: "อื่นๆ",
    };

    const sortedSymptoms = selectedSymptoms.sort((a, b) => a - b);
    const selectedSymptomLabels = sortedSymptoms
      .map((id) => symptomLabels[id] || "Unknown")
      .join(", ");

    const confirmMessage = `
            ยืนยันข้อมูล:
            ชื่อ-นามสกุล: ${studentName}
            รหัสนักศึกษา: ${studentId}
            อาการ: ${selectedSymptomLabels}
            ${isOtherChecked ? `หมายเหต: ${otherSymptom}` : ""}
        `;

    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) {
      return;
    }

    if (!studentId || !studentName || selectedSymptoms.length === 0) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description:
          "Please fill in all fields and select at least one symptom.",
        duration: 2000,
      });
      return;
    }

    const formData = {
      student_id: studentId,
      student_name: studentName,
      symptom_ids: selectedSymptoms,
      other_symptom: isOtherChecked ? otherSymptom : "",
    };

    try {
      const response = await fetch("/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Data Submitted",
          description: `รหัสนักศึกษา ${studentId} ชื่อ-นามสกุล ${studentName} อาการ ${selectedSymptomLabels} ${
            isOtherChecked ? ` ${otherSymptom}` : ""
          }`,
          duration: 2000,
        });
        console.log(formData);
      } else {
        console.log("Failed to submit data");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-custom">
        <div className="bg-zinc-100 shadow-md p-8 max-w-lg w-full mb-20 form-border ">
          <div className="text-center text-2xl font-bold mb-6 text-gray-700">
            <h1>แบบฟอร์มนักศึกษาที่มาใช้ห้องพยาบาล</h1>
          </div>
          <form onSubmit={onSubmit} className="mx-8 mt-8 mb-2">
            <div className="mb-4">
              <label className="block text-gray-700 text-center  font-bold text-lg">
                ชื่อ-นามสกุล
              </label>
              <input
  type="text"
  id="student_name"
  value={studentName}
  onChange={(e) => setStudentName(e.target.value)}
  className="mt-1 block w-full p-2 border border-black input-border pl-4"
  placeholder="ชื่อ-นามสกุล"
  style={{ borderColor: 'black' }}
/>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-center font-bold text-lg">
                เลขนักศึกษา
              </label>
              <input
    type="text"
    id="student_id"
    value={studentId}
    onChange={(e) => setStudentId(e.target.value)}
    className="mt-1 block w-full p-2 border border-black input-border pl-4"
    placeholder="เลขนักศึกษา"
    style={{ borderColor: 'black' }}
  />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-center font-bold text-lg">
                อาการ
              </label>
              <div className="mt-2 grid grid-cols-4 gap-4 whitespace-nowrap">
                {[
                  { label: "ปวดหัวเป็นไข้", id: "1" },
                  { label: "ปวดท้อง", id: "2" },
                  { label: "ท้องเสีย", id: "3" },
                  { label: "ปวดรอบเดือน", id: "4" },
                  { label: "เป็นหวัด", id: "5" },
                  { label: "ปวดฟัน", id: "6" },
                  { label: "เป็นแผล", id: "7" },
                  { label: "เป็นลม", id: "8" },
                  { label: "ตาเจ็บ", id: "9" },
                  { label: "ผื่นคัน", id: "10" },
                  { label: "นอนพัก", id: "11" },
                  { label: "อื่นๆ", id: "12" },
                ].map((item) => (
                  <div key={item.id}>
                    <input
                      type="checkbox"
                      id={item.id}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor={item.id} className="ml-2 text-gray-700">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
              {isOtherChecked && (
                <div className="mt-4">
                  <label className="block text-gray-700 font-bold text-lg">
                    โปรดระบุอาการอื่นๆ
                  </label>
                  <input
                    type="text"
                    value={otherSymptom}
                    onChange={(e) => setOtherSymptom(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="ระบุอาการอื่นๆ"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <Button className="bg-blue-700 hover:bg-blue-400" type="submit">
                ยืนยัน
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
