"use client";

import { PowerOffIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";

const SignoutComponent = () => {
  const [loading, setLoading] = useState(false);
  const handleSignout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`/auth/signout`, {
      method: "POST",
    });
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSignout}
      // action='/auth/signout' method='post'
    >
      <Button type='submit' className='text-red-500 rounded-full'>
        <PowerOffIcon
          className={`w-4 h-4 ${loading ? "animate-bounce" : ""}`}
        />
        <span className='hidden ml-3 md:block'>Signout</span>
      </Button>
    </form>
  );
};

export default SignoutComponent;
