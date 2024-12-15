"use client";

import { User } from "@supabase/supabase-js";
import { PowerOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

const SignoutComponent = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize the router
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (user) {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, [user]);

  const handleSignout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/auth/signout`, {
        method: "POST",
      });

      if (response.ok) {
        router.refresh();
        setShowLogin(true);
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
    <>
      {showLogin ? (
        <Button
          asChild
          aria-label='Open mobile menu'
          aria-expanded='false'
          aria-controls='mobile-menu'
          className='rounded-full'>
          <Link aria-label='Open mobile menu' href='/login'>
            Login | Sign Up
          </Link>
        </Button>
      ) : (
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
      )}
    </>
  );
};

export default SignoutComponent;
