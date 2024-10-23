"use client";

import { login, signup } from "@/app/login/actions";
import { MinusIcon } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // true for login, false for signup
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent form default submission

    // Validate input fields
    if (!email || !password) {
      toast.error("ERROR!", { description: "Please fill in all fields." });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("ERROR!", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    if (password.length < 6) {
      toast.error("ERROR!", {
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formActionData = new FormData();
      formActionData.append("email", email);
      formActionData.append("password", password);

      if (isLogin) {
        await login(formActionData); // login action
      } else {
        await signup(formActionData); // signup action
      }

      //   toast.success(
      //     isLogin ? "Logged in successfully!" : "Signed up successfully!"
      //   );
    } catch (error) {
      toast.error("ERROR!", {
        description: `Authentication failed: ${error}`,
      });
      console.error("Error during authentication:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=' space-y-4'>
      <div className='flex justify-center'>
        {isLogin ? (
          <Image
            alt=''
            priority
            width={120}
            height={120}
            src='/gifs/login.gif'
            className='rounded-full dark:invert shadow-lg'
          />
        ) : (
          <Image
            alt=''
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='bg-white dark:bg-slate-800 mt-1'
          />
        </div>

        <div>
          <label htmlFor='password'>Password:</label>
          <Input
            id='password'
            name='password'
            type='password'
            placeholder='Enter your password here'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='bg-white dark:bg-slate-800 mt-1'
          />
        </div>

        <Button
          type='submit'
          disabled={isLoading}
          className={`w-full text-white bg-blue-500 hover:bg-blue-700`}>
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
