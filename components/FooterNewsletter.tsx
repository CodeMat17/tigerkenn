"use client";

import { MinusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const FooterNewsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast("Enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("ERROR!", { description: "Email is not valid" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (res.ok) {
        setEmail("");
        toast.success("SUBSCRIBED!", {
          description: "You have successfully subscribed to our newsletter",
        });
      } else {
        toast.error("ERROR!", { description: `${result.message}` });
      }
    } catch (error) {
      toast.error("ERROR!", {
        description: `Failed to subscribe. Please try again later: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-3'>
      <Input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Enter your email here'
        className='bg-gray-800'
        required
      />
      <div className='flex justify-end mt-2'>
        <Button aria-label='handle submit' onClick={handleSubmit}>
          {loading ? <MinusIcon className='animate-spin' /> : "Subscribe"}
        </Button>
      </div>
    </div>
  );
};

export default FooterNewsletter;
