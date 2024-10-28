"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, MinusIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// function isValidEmail(email: string): boolean {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

const UpdatePassword = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  // const [invalidEmail, setInvalidEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = async () => {
    // if (!isValidEmail(email)) {
    //   setInvalidEmail(true);
    //   return;
    // }

    if (!password || !confirmPassword) {
      toast.error("Please enter the required data");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!code) {
      setErrMsg("Access token missing.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`api/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  password, code }),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(true);
        toast.success("Password updated successfully!");
      } else {
        setErrMsg(result.errors || "Password update failed.");
        toast.error("ERROR!", {
          description: `${result.errors || "Password update failed."}`,
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("ERROR!", { description: `${error}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-4 py-32 w-full max-w-md mx-auto'>
      <h2 className='text-center font-semibold text-3xl'>Update Password</h2>
      {success && (
        <div className='bg-green-200 text-green-800 p-4 text-center mt-4 rounded-xl overflow-hidden'>
          DONE! Your password has been updated.
        </div>
      )}
      {errMsg && (
        <div className='bg-red-200 text-red-800 p-4 text-center mt-4 rounded-xl overflow-hidden'>
          {errMsg}
        </div>
      )}
   
      <Input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Enter your new password'
        className='mt-4 bg-gray-50 dark:bg-gray-800'
      />
      <div className='flex items-center gap-2 mt-4'>
        <Input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder='Confirm your new password'
          className=' bg-gray-50 dark:bg-gray-800'
        />
        <Button
          onClick={() => setShowPassword(!showPassword)}
          aria-label='password toggle'
          variant='ghost'
          size='icon'
          className='border'>
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
      <Button
        aria-label='update password'
        onClick={update}
        disabled={loading}
        className='mt-4 w-full'>
        {loading ? <MinusIcon className='animate-spin' /> : "Update"}
      </Button>
    </div>
  );
};

export default UpdatePassword;
