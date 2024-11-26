"use client";

import { User } from "@supabase/supabase-js";
import DOMPurify from "dompurify";
import { MinusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

function convertTitleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

const AddNewTopic = ({ user }: { user: User }) => {
  const userId = user?.id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState(""); // Store the current tag input
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const slug = convertTitleToSlug(title);

    const addTag = () => {
      const newTag = currentTag.trim().toLowerCase();
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags((prevTags) => [...prevTags, newTag]);
        setCurrentTag(""); // Clear the input
      }
  };
  
   const removeTag = (tagToRemove: string) => {
     setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  
    const sanitizeContent = (htmlContent: string) => {
      const cleanContent = DOMPurify.sanitize(htmlContent, {
        ADD_TAGS: ["img"],
        ADD_ATTR: ["loading", "style"],
        FORBID_ATTR: ["onerror", "onload"],
      });

      // Use Tailwind's responsive utility classes for styling images
      const imgRegex = /<img [^>]*src="([^"]*)"[^>]*>/g;
      return cleanContent.replace(imgRegex, (match, src) => {
        return `<img src="${src}" loading="lazy" class="w-full md:w-[70%] h-auto" />`;
      });
  };
  
    const isContentValid = () => {
      const strippedContent = content.replace(/<\/?[^>]+(>|$)/g, "").trim();
      return !!strippedContent;
    };

    const isFormValid =
      title.trim() && isContentValid() && tags.length > 0 && tags.length <= 5;

  // const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter" || e.key === ",") {
  //     e.preventDefault();
  //     const newTag = e.currentTarget.value.trim().toLowerCase();
  //     if (newTag && !tags.includes(newTag) && tags.length < 5) {
  //       setTags((prevTags) => [...prevTags, newTag]);
  //       e.currentTarget.value = ""; // Clear input
  //     }
  //   }
  // };





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fill all required fields: Title, Tags, and Content.");
      return;
    }
    try {
      setLoading(true);
      const sanitizedContent = sanitizeContent(content);

      const res = await fetch(`/api/add-new-thread`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: sanitizedContent,
          user_id: userId,
          slug,
          tags,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        router.push(`/threads/topics`);
        toast.success("Topic published successfully!");
      } else {
        toast.error(`Error creating topic: ${result.error}`);
      }
    } catch (error) {
      console.error("ErrorMsg: ", error);
      toast.error("An error occurred while creating the topic.");
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <h2 className='text-2xl mb-4'>Create New Topic</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            htmlFor='title'
            className='block mb-1 text-sm font-medium text-gray-500'>
            Title
          </label>
          <Input
            id='title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full'
            required
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='tags'
            className='block text-sm mb-1 font-medium text-gray-500'>
            Tags: (Max 5 tags)
          </label>
          <div className='flex gap-2'>
            <Input
              id='tags'
              type='text'
              placeholder='Add a tag and press Enter or comma...'
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className='w-full'
            />
            <Button
              type='button'
              onClick={addTag}
              className='bg-blue-500 text-white  hover:bg-blue-600'
              disabled={!currentTag.trim() || tags.length >= 5}>
              Add
            </Button>
          </div>
         
          <div className='mt-2'>
            {tags.map((tag) => (
              <span
                key={tag}
                className='inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2 mb-2'>
                {tag}
                <button
                  type='button'
                  onClick={() => removeTag(tag)}
                  className='ml-2 text-red-500 hover:text-red-700'
                  aria-label={`Remove tag ${tag}`}>
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className='mb-4'>
          <label
            htmlFor='content'
            className='block mb-1 text-sm font-medium text-gray-500'>
            Content
          </label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            className='rounded-lg dark:text-black dark:bg-gray-100 border-gray-300 dark:border-gray-700'
          />
        </div>
        <button
          type='submit'
          className={`px-4 py-2 ${
            isFormValid
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          } text-white rounded`}
          disabled={!isFormValid || loading}>
          {loading ? <MinusIcon className='animate-spin' /> : "Create Topic"}
        </button>
      </form>
    </div>
  );
};

export default AddNewTopic;
