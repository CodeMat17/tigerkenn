"use client";

import { Minus } from "lucide-react";
import  { useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic form validation
    if (!name || !email || !message) {
      setError("All fields are required");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const res = await fetch(`/api/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

   
      if (res.ok) {
        toast("DONE!", { description: "Message sent successfully!" });
            setName("");
            setEmail("");
            setMessage("");
      } else {
     toast.error("ERROR!", {
       description: "An error occurred while sending your message.",
     });
    throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("ERROR!", {
        description: "An error occurred while sending your message.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 '>
      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700 dark:text-gray-400'>
          Your Name
        </label>
        <Input
          type='text'
          name='name'
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='mt-1 w-full focus:outline-none border-none  bg-gray-200 dark:bg-gray-800 focus:border-indigo-500'
          required
        />
      </div>
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700 dark:text-gray-400'>
          Email Address
        </label>
        <Input
          type='email'
          name='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mt-1 w-full focus:outline-none border-none  bg-gray-200 dark:bg-gray-800 focus:border-indigo-500'
          required
        />
      </div>
      <div>
        <label
          htmlFor='message'
          className='block text-sm font-medium text-gray-700 dark:text-gray-400'>
          Your Message
        </label>
        <Textarea
          name='message'
          id='message'
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='mt-1 w-full focus:outline-none border-none bg-gray-200 dark:bg-gray-800 focus:border-indigo-500'
          required
        />
      </div>

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <div>
        <Button
          aria-label='submit btn'
          type='submit'
          disabled={isSubmitting}
          className='w-full  text-white bg-blue-600 hover:bg-blue-700 '>
          {isSubmitting ? <Minus className='animate-spin' /> : "Send Message"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
