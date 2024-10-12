import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Taskbar from "@/components/Taskbar";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function MedicineComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pillStock, setPillStock] = useState([]);
  const [error, setError] = useState(null);

  const [pillName, setPillName] = useState("");
  const [dose, setDose] = useState("");
  const [typeName, setTypeName] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [total, setTotal] = useState("");
  const [unit, setUnit] = useState("");
  const [types, setTypes] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch("/api/medicine", { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPillStock(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, [session, status, router]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("/api/medicine_type", { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTypes(data);
      } catch (err) {
        console.error("Error fetching types:", err);
      }
    };

    const fetchUnits = async () => {
      try {
        const response = await fetch("/api/unit_type", { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUnits(data);
      } catch (err) {
        console.error("Error fetching units:", err);
      }
    };

    fetchTypes();
    fetchUnits();
  }, []);

  const handleSaveChanges = async () => {
    const formPill = {
      pillName,
      dose,
      typeName,
      expireDate,
      total,
      unit,
    };

    try {
      const response = await fetch("/api/save_medicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formPill),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data saved successfully:", data);
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  if (status === "loading") {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }
  return (
    <div>
      <Navbar session={session} />
      <Taskbar />
      <div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="">
                Add pill
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Pill Name
                  </Label>
                  <Input
                    id="name"
                    value={pillName}
                    onChange={(e) => setPillName(e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dose" className="text-right">
                    Dose
                  </Label>
                  <Input
                    id="dose"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="typeName" className="text-right">
                    Type Name
                  </Label>
                  <select
                    id="typeName"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                    className="col-span-3 border rounded px-2 py-1"
                  >
                    <option value="">Select Type</option>
                    {types.map((type) => (
                      <option key={type.type_id} value={type.type_id}>
                        {type.type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit" className="text-right">
                    Unit
                  </Label>
                  <select
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="col-span-3 border rounded px-2 py-1"
                  >
                    <option value="">Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit.unit_id} value={unit.unit_id}>
                        {unit.unit_type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="total" className="text-right">
                    Total
                  </Label>
                  <Input
                    id="total"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label htmlFor="expire" className="text-right">
                    Expire Date
                  </Label>
                  <input
                    type="date"
                    id="expire"
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    className="col-span-3 border rounded px-2 py-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleSaveChanges}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <div className="flex justify-center items-center mx-5 mt-20">
            <div className="w-full">
              <table className="border-collapse border mx-auto w-4/6">
                <thead>
                  <tr className="border">
                    <th className="border px-4 py-2">Lot Id</th>
                    <th className="border px-4 py-2">Pill Name</th>
                    <th className="border px-4 py-2">Dose</th>
                    <th className="border px-4 py-2">Type Name</th>
                    <th className="border px-4 py-2">Expire Date</th>
                    <th className="border px-4 py-2">Total</th>
                    <th className="border px-4 py-2">Unit Type</th>
                  </tr>
                </thead>
                <tbody>
                  {pillStock.map((item) => (
                    <tr key={item.pillstock_id} className="border bg-blue-100">
                      <td className="border px-4 py-2">{item.pillstock_id}</td>
                      <td className="border px-4 py-2">{item.pill_name}</td>
                      <td className="border px-4 py-2">{item.dose}</td>
                      <td className="border px-4 py-2">{item.type_name}</td>
                      <td className="border px-4 py-2">{item.expire_date}</td>
                      <td className="border px-4 py-2">{item.total}</td>
                      <td className="border px-4 py-2">{item.unit_type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
