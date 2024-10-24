"use client";

import { login, signup } from "@/app/login/actions";
import { EyeIcon, EyeOffIcon, MinusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// Function to validate email format using regex
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Use isValidEmail to validate email format
    if (!isValidEmail(data.email)) {
      toast("FAILED!", {
        description: "Invalid email format.",
      });
      return; // Exit if email is invalid
    }

    // Validate password field
    if (!data.password) {
      toast("FAILED!", {
        description: "Password is required.",
      });
      return; // Exit if password is missing
    }

    try {
      setIsLoading(true);

      const formActionData = new FormData();
      formActionData.append("email", data.email);
      formActionData.append("password", data.password);

      if (isLogin) {
        // Login action
        await login(formActionData);
      } else {
        // Signup action
        await signup(formActionData);
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
      toast("ERROR!", {
        description: isLogin
          ? "Failed to log in. Please try again."
          : "Failed to sign up. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-center'>
        {isLogin ? (
          <Image
            alt='Login'
            priority
            width={120}
            height={120}
            src='/gifs/login.gif'
            className='rounded-full dark:invert shadow-lg'
          />
        ) : (
          <Image
            alt='Signup'
            priority
            width={120}
            height={120}
            src='/gifs/signup.gif'
            className='rounded-full dark:invert shadow-lg'
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='email'>Email:</label>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='Enter your email here'
            required
            className='bg-white dark:bg-slate-800 mt-1'
          />
        </div>

        <div>
          <label htmlFor='password'>Password:</label>
          <div className="flex items-center">
            <Input
              id='password'
              name='password'
              type={showPassword ? "text" : "password"}
              placeholder='Enter your password here'
              required
              className='bg-white dark:bg-slate-800 mt-1'
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='ml-2 border-blue-500 text-white rounded p-2'>
              {showPassword ? (
                <EyeOffIcon className='w-5 h-5 text-red-500' />
              ) : (
                <EyeIcon className='w-5 h-5 text-blue-500' />
              )}
            </button>
          </div>
        </div>

        <Button
          type='submit'
          disabled={isLoading}
          className='w-full text-white bg-blue-500 hover:bg-blue-700'>
          {isLoading ? (
            <MinusIcon className='animate-spin text-white' />
          ) : isLogin ? (
            "Log in"
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      {/* Toggle between Login and Signup */}
      <div className='text-center'>
        {isLogin ? (
          <p>
            Don&apos;t have an account?{" "}
            <button
              type='button'
              onClick={() => setIsLogin(false)}
              className='text-blue-500 underline'>
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              type='button'
              onClick={() => setIsLogin(true)}
              className='text-blue-500 underline'>
              Log in
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
