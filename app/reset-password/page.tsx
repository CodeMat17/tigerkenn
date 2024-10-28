"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function validateEmail(email: string) {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}

const RestPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = async () => {
    setError(false);

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError(true);
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(true);
        toast.success(
          "Reset email sent successfully. Please check your inbox."
        );
      } else {
        // Handle specific error messages from the server
        if (result.error) {
          toast.error(result.error); // Show specific error from server
          setErrMsg(result.error)
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("ERROR!", { description: `${error}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-4 py-32 w-full max-w-md mx-auto'>
      <h2 className='text-center font-semibold text-3xl'>Reset Password</h2>

      {success && (
        <div className='bg-green-200 text-green-800 p-4 text-center mt-4 rounded-xl overflow-hidden'>
          Reset process initiated. Check your email to complete the process.
        </div>
      )}

      {errMsg && (
        <div className='bg-red-200 text-red-800 p-4 text-center mt-4 rounded-xl overflow-hidden'>
          {errMsg}
        </div>
      )}

      <Input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value.trim())}
        placeholder='Enter your email'
        className='mt-6 bg-gray-50 dark:bg-gray-800'
      />
      {error && (
        <span className='text-sm text-red-500 ml-3'>Invalid email</span>
      )}
      <Button onClick={reset} className='mt-4 w-full'>
        {loading ? <MinusIcon className='animate-spin' /> : "Reset"}
      </Button>
    </div>
  );
};

export default RestPassword;
