'use client'

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, message } = formData;

    // Basic form validation
    if (!name || !email || !message) {
      setError("All fields are required");
      return;
    }
    setError("");

    // Send form data to server (not implemented here)
    console.log("Form submitted", formData);

    // Clear form after submission
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 '>
      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700'>
          Your Name
        </label>
        <Input
          type='text'
          name='name'
          id='name'
          value={formData.name}
          onChange={handleChange}
          className='mt-1 w-full focus:outline-none border-none  bg-gray-200 dark:bg-gray-900 focus:border-indigo-500'
          required
        />
      </div>
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700'>
          Email Address
        </label>
        <Input
          type='email'
          name='email'
          id='email'
          value={formData.email}
          onChange={handleChange}
          className='mt-1 w-full focus:outline-none border-none  bg-gray-200 dark:bg-gray-900 focus:border-indigo-500'
          required
        />
      </div>
      <div>
        <label
          htmlFor='message'
          className='block text-sm font-medium text-gray-700'>
          Your Message
        </label>
        <Textarea
          name='message'
          id='message'
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className='mt-1 w-full focus:outline-none border-none bg-gray-200 dark:bg-gray-900 focus:border-indigo-500'
          required
        />
      </div>

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <div>
        <button
          type='submit'
          className='w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
