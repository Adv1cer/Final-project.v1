import { toast } from "@/hooks/use-toast";

const handlepatientFormSubmit = ({
  studentName,
  studentId,
  role,
  selectedSymptoms,
  otherSymptom,
  options,
}) => {
  const onSubmit = async (event) => {
    event.preventDefault();

    const confirmMessage = `
      ยืนยันข้อมูล:
      ชื่อ-นามสกุล: ${studentName}
      รหัสนักศึกษา: ${studentId}
      สถานะ: ${role}
      อาการ: ${selectedSymptoms
        .map((symptom) => options.find((option) => option.value === symptom)?.label)
        .join(", ")}
      ${
        selectedSymptoms.includes(12)
          ? `หมายเหตุ: ${otherSymptom}`
          : ""
      }
    `;

    if (!window.confirm(confirmMessage)) return;

    const formData = {
      student_id: studentId,
      student_name: studentName,
      role,
      symptom_ids: selectedSymptoms,
      other_symptom: selectedSymptoms.includes(12) ? otherSymptom : "",
    };

    try {
      const response = await fetch("/api/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({ variant: "success", title: "บันทึกข้อมูลสำเร็จ" });
        location.reload();
      } else {
        toast({ variant: "destructive", title: "ไม่สามารถบันทึกข้อมูลได้" });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast({ variant: "destructive", title: "เกิดข้อผิดพลาด" });
    }
  };

  return onSubmit;
};

export default handlepatientFormSubmit;