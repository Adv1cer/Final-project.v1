"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import handlepatientFormSubmit from "@/components/service/patient_form/handleSubmit";
import handleCheckStudent from "@/components/service/patient_form/handleCheckStudent";
import options from "@/components/service/patient_form/symptomOption";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function PatientForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [role, setRole] = useState("");
  const [isStudentExists, setIsStudentExists] = useState(null); 
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [otherSymptom, setOtherSymptom] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSymptomChange = (selectedOptions) => {
    setSelectedSymptoms(selectedOptions.map((option) => option.value));
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const onSubmit = handlepatientFormSubmit({
    studentName,
    studentId,
    role,
    selectedSymptoms,
    otherSymptom,
    options,
  });

  
  const handleCheckStudentClick = () => {
    handleCheckStudent({
      studentId,
      setStudentName,
      setRole,
      setIsStudentExists,
      setLoading,
    });
  };
  

  return (
    <div className="flex justify-center items-center max-w-lg w-full">
      <div className="bg-zinc-100 shadow-md p-8 max-w-lg w-full mb-20 form-border">
        <h1 className="text-center text-2xl font-bold mb-6 text-gray-700">
          แบบฟอร์มนักศึกษาที่มาใช้ห้องพยาบาล
        </h1>
        <form onSubmit={onSubmit} className="mx-8 mt-8 mb-2">
          <div className="mb-4">
            <label className="block text-gray-700 text-center font-bold text-lg">
              รหัสประจำตัว
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="mt-1 block w-full p-2 border border-black input-border pl-4"
                placeholder="รหัสประจำตัว"
                style={{ borderColor: "black" }}
              />
              <Button
                type="button"
                className="bg-blue-700 hover:bg-blue-400"
                onClick={handleCheckStudentClick}
                disabled={loading}
              >
                ตรวจสอบ
              </Button>
            </div>
          </div>
          {isStudentExists !== null && !isStudentExists && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-center font-bold text-lg">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-black input-border pl-4"
                  placeholder="ชื่อ-นามสกุล"
                  style={{ borderColor: "black" }}
                />
              </div>
              <div className="flex justify-center gap-1 my-5">
                <div className="mx-2">
                <input
                  type="radio"
                  id="student"
                  name="role"
                  value="นักศึกษา"
                  className="mx-2"
                  onChange={handleRoleChange}
                />
                <label htmlFor="student">นักศึกษา</label>
                </div>
                <div className="mx-2">
                <input
                  type="radio"
                  id="staff"
                  name="role"
                  value="บุคลากร"
                  className="mx-2"
                  onChange={handleRoleChange}
                />
                <label htmlFor="staff">บุคลากร</label>
                </div>
                <div className="mx-2">
                <input
                  type="radio"
                  id="outsider"
                  name="role"
                  value="บุคคลภายนอก"
                  className="mx-2"
                  onChange={handleRoleChange}
                />
                <label htmlFor="outsider">บุคคลภายนอก</label>
                </div>
              </div>
            </>
          )}
          {isStudentExists && (
            <div className="mb-4">
              <p className="text-gray-700 font-bold text-center">
                ข้อมูล: ชื่อ {studentName}, สถานะ {role}
              </p>
            </div>
          )}
          <div className="flex w-full flex-col gap-1">
            <label className="block text-center font-bold text-lg">อาการ</label>
            <Select
              options={options}
              placeholder="เลือกอาการ"
              isMulti
              value={options.filter((option) =>
                selectedSymptoms.includes(option.value)
              )}
              onChange={handleSymptomChange}
            />
            {selectedSymptoms.includes(12) && (
              <div className="mt-4">
                <label className="block text-gray-700 font-bold text-lg">
                  โปรดระบุอาการอื่นๆ
                </label>
                <input
                  type="text"
                  value={otherSymptom}
                  onChange={(e) => setOtherSymptom(e.target.value)}
                  className="mt-1 block w-full p-2 border border-black input-border pl-4"
                  placeholder="ระบุอาการอื่นๆ"
                />
              </div>
            )}
          </div>
          <div className="flex justify-center mt-4">
            <Button
              className="bg-blue-700 hover:bg-blue-400"
              type="submit"
              disabled={loading}
            >
              ยืนยัน
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
