"use client";

import { MinusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css"; // Import the CSS for React Quill
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type DataProps = {
  id: string;
  dataTitle: string;
  dataDesc: string;
};

const EditAboutUsChooseUs = ({ id, dataTitle, dataDesc }: DataProps) => {
  const [title, setTitle] = useState(dataTitle || "");
  const [desc, setDesc] = useState(dataDesc || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/chooseus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, title, desc }),
      });

      const result = await response.json();

      if (response.ok) {
        toast("UPDATED!", {
          description: "Choose-Us updated successfully",
        });
        setError(null);
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen max-w-3xl mx-auto mb-16'>
      <h2 className='text-3xl text-center font-medium mb-6'>
        Why Choose Us? Services
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-400'>
            Title
          </label>
          <Input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-400'>
            Content
          </label>
          <ReactQuill
            value={desc}
            onChange={setDesc}
            className='border border-gray-300 rounded-md'
            theme='snow'
          />
        </div>
        {error && <p className='text-red-600'>{error}</p>}

        <Button type='submit' className=''>
          {loading ? (
            <MinusIcon className='animate-spin' />
          ) : (
            "Update Choose-us"
          )}
        </Button>
      </form>
    </div>
  );
};

export default EditAboutUsChooseUs;
