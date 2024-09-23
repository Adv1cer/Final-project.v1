"use client";
import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const FormLogin = () => {
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);  
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    setLoading(false);  

    if (session) {
      router.push("/dashboard");  
    }
  }, [session, status, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        toast({
          variant: "destructive",
          title: 'Login Failed',
          description: 'อีเมล หรือ รหัสผ่านไม่ถูก',
          duration: 2000,
        });
        return;
      }
      
      toast({
        variant: "success",
        title: 'Successfully Logged In',
        duration: 2000,
      });

      router.push("/dashboard");

    } catch (error) {
      console.log("Error during sign-in:", error);
      setError("An error occurred during sign-in");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Navbar />
      <div className="grid grid-cols-3 grid-row-4">
        <form onSubmit={handleSubmit} className="grid col-start-2">
          <div className="mt-40">
            <label className="block text-gray-700 font-bold">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="อีเมล์"
            />
          </div>
          <div className="pt-6">
            <label className="block text-gray-700 font-bold">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="พาสเวิร์ด"
            />
          </div>
          <div className="flex justify-center pt-6">
            <Button type="submit">Submit</Button>
          </div>
          
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      </div>
    </main>
  );
};

export default FormLogin;
