import { toast } from "@/hooks/use-toast";

const handleCheckStudent = async ({
  studentId,
  setStudentName,
  setRole,
  setIsStudentExists,
  setLoading,
}) => {
  if (!studentId.trim()) {
    toast({
      variant: "destructive",
      title: "ข้อผิดพลาด",
      description: "กรุณากรอกรหัสนักศึกษา",
    });
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(`/api/check_id?patient_id=${studentId}`);
    const data = await response.json();
    console.log(data);

    if (data.exists) {
      setStudentName(data.patient_name);
      setRole(data.role);
      setIsStudentExists(true);
    } else {
      setIsStudentExists(false);
      setStudentName("");
      setRole("");
    }
  } catch (error) {
    console.error("Error checking student:", error);
    toast({
      variant: "destructive",
      title: "ข้อผิดพลาด",
      description: "ไม่สามารถตรวจสอบข้อมูลได้",
    });
  } finally {
    setLoading(false);
  }
};

export default handleCheckStudent;