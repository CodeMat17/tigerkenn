"use client";

import { PowerOffIcon } from "lucide-react";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import React, { useState } from "react";
import { Button } from "./ui/button";

const SignoutComponent = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize the router

  const handleSignout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/auth/signout`, {
        method: "POST",
      });

      if (response.ok) {
        router.refresh();
        router.push("/"); // Redirect to the home page on success
      } else {
        console.error("Failed to sign out:", response.statusText);
      }
    } catch (error) {
      console.error("Error during signout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignout}
      // action='/auth/signout' method='post'
    >
      <Button
        aria-label='sign out'
        type='submit'
        className='text-red-500 rounded-full'>
        <PowerOffIcon
          className={`w-4 h-4 ${loading ? "animate-bounce" : ""}`}
        />
        <span className='hidden ml-3 md:block'>Signout</span>
      </Button>
    </form>
  );
};

export default SignoutComponent;
