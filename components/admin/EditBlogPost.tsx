"use client";

import { MinusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type Props = {
  id: string;
  blogTitle: string;
  blogContent: string;
  blogImg: string;
};

const EditBlogPost = ({ id, blogTitle, blogContent, blogImg }: Props) => {
  const [title, setTitle] = useState(blogTitle);
  const [content, setContent] = useState(blogContent);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadingTitle, setLoadingTitle] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const editTitle = async () => {
    setLoadingTitle(true);
    setError(null);

    try {
      const response = await fetch("/api/blog-title-edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast("UPDATED!", {
          description: "Blog title updated successfully",
        });
        setError(null);
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setLoadingTitle(false);
    }
  };

  const editContent = async () => {
    setLoadingContent(true);
    setError(null);

    try {
      const response = await fetch("/api/blog-content-edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          content,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast("UPDATED!", {
          description: "Content updated successfully",
        });
        setError(null);
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const uploadImg = async () => {
    // Validate selection
    if (!selectedFile) {
      toast.error("No image selected");
      return;
    }

    setLoadingImage(true);

    const formData = new FormData();
    formData.append("id", id);

    formData.append("file", selectedFile);

    // If replacing an image, include the current image URL for removal
    if (blogImg) {
      formData.append("currentUrl", blogImg);
    }

    try {
      const res = await fetch("/api/blog-image-edit", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast("Image updated successfully");
        setError(null);
      } else {
        toast.error("Error updating image", {
          description: `${result.error} || Something went wrong`,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`Error uploading image`);
    } finally {
      setLoadingImage(false);
      setSelectedFile(null); // Reset selected file after upload
    }
  };

  return (
    <div className='space-y-4'>
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
        <Button onClick={editTitle} className='mt-2'>
          {loadingTitle ? (
            <MinusIcon className='animate-spin' />
          ) : (
            "Update title"
          )}
        </Button>
      </div>
      <div>
        <label className='text-sm text-gray-400 mb-1'>Content</label>
        <ReactQuill
          value={content}
          onChange={setContent}
          className='border border-gray-300 rounded-md '
          theme='snow'
        />
        <Button
          onClick={editContent}
          disabled={loadingContent}
          className='mt-2'>
          {loadingContent ? (
            <MinusIcon className='animate-spin' />
          ) : (
            "Update content"
          )}
        </Button>
      </div>
      <div className=''>
        <label className='block text-sm text-gray-400 mb-1'>Image</label>
        <input type='file' accept='image/*' onChange={handleFileChange} className="w-full" />
        <Button
          onClick={uploadImg}
          disabled={loadingImage || !selectedFile}
          className={`mt-2`}>
          {loadingImage ? (
            <MinusIcon className='animate-spin' />
          ) : blogImg ? (
            "Submit Replacement"
          ) : (
            "Upload Image"
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditBlogPost;
