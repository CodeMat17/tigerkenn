"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AddNewBlogPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  // Function to convert title to slug
  const createSlug = (title: string): string => { 
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    // Validate selection
    if (!selectedFile) {
      toast.error("No image selected");
      return;
    }
    console.log("TITLE: ", title);
    console.log("CONTENT: ", content);
    console.log("IMAGE: ", selectedFile);
    console.log("Slug: ", createSlug(title));

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("file", selectedFile);

    // Generate and append the slug
    const slug = createSlug(title)
    formData.append("slug", slug);

    try {
      const res = await fetch(`/api/add-new-blog-post`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (res.ok) {
        toast("Post updated successfully");
        setError(null);
      } else {
        toast.error("Error updating image", {
          description: `${result.error}` || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      toast.error(`Error uploading image`);
    } finally {
      setLoading(false);
      setSelectedFile(null); // Reset selected file after upload
    }
  };

  return (
    <div className='py-12 space-y-4 max-w-xl mx-auto'>
      <h2 className='text-3xl sm:text-4xl text-center mt-8'>
        Add New Blog Post
      </h2>
      {error && (
        <div className='text-center p-3 bg-red-50 text-red-500'>{error}</div>
      )}
      <div>
        <label className='text-sm text-gray-400 mb-1'>Title</label>
        <Input
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='border-gray-300'
        />
      </div>
      <div>
        <label className='text-sm text-gray-400 mb-1'>Content</label>
        <ReactQuill
          value={content}
          onChange={setContent}
          className='border border-gray-300 rounded-md '
          theme='snow'
        />
      </div>
      <div className=''>
        <label className='block text-sm text-gray-400 mb-1'>Image</label>
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='w-full'
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={loading || !selectedFile || !title.trim() || !content.trim()}
        className={`mt-2`}>
        {loading ? <MinusIcon className='animate-spin' /> : "Upload blog post"}
      </Button>
    </div>
  );
};

export default AddNewBlogPost;
