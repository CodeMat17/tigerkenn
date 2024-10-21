"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSuccess(true);
    // Logic to handle email submission (API call)
    console.log("Email submitted:", email);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

    return (
        <div className='py-12
      bg-gray-50 dark:bg-gray-950'>
        <div className='bg-white dark:bg-gray-800 py-12 px-6 sm:px-12 rounded-xl shadow-lg max-w-2xl mx-auto my-12'>
          <div className=''>
            <div className='space-y-4'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl'>
                Join Our Newsletter
              </h2>
              <p className='text-gray-600 dark:text-gray-300 text-lg'>
                Stay updated with the latest listings and real estate news.
              </p>
              <form onSubmit={handleSubmit} className='mt-4'>
                <div className='flex h-12 border border-blue-600 rounded-xl overflow-hidden'>
                  <Input
                    type='email'
                    value={email}
                    onChange={handleEmailChange}
                    className='w-full bg-gray-100 dark:bg-gray-700 dark:text-white px-4 h-full focus:outline-none rounded-none'
                    placeholder='Enter your email'
                    required
                  />
                  <Button
                    type='submit'
                    className='bg-blue-600 text-white hover:bg-blue-700 h-full rounded-none py-4'>
                    Subscribe
                  </Button>
                </div>
                {error && <p className='text-red-500 mt-2'>{error}</p>}
                {success && (
                  <p className='text-green-500 mt-2'>
                    Thank you for subscribing!
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
};

export default NewsletterSignup;
