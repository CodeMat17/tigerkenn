'use client'

import { useState } from 'react'
import { Input } from './ui/input';
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Button } from './ui/button';
import LoadingAnimation from './LoadingAnimation';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type Props = {
  slug: string;
  post_title: string;
  post_tags: string
  post_content: string;
};


const EditThreadPost = ({ slug, post_title, post_tags, post_content }: Props) => {
  
  const router = useRouter()

  const [title, setTitle] = useState(post_title)
  const [tags, setTags] = useState<string[]>(
    Array.isArray(post_tags)
      ? post_tags
      : typeof post_tags === "string"
      ? [post_tags]
      : []
  );
  const [content, setContent] = useState(post_content)
  const [loading, setLoading] = useState(false)

const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    const newTag = e.currentTarget.value.trim().toLowerCase();
    if (newTag && !tags.includes(newTag) && tags.length < 5) {
      setTags((prevTags) => [...prevTags, newTag]);
      e.currentTarget.value = ""; // Clear input
    } else if (tags.length >= 5) {
      toast.error("You can only add 5 tags.");
    }
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

    const isFormValid = title.trim() && isContentValid() && tags.length <= 5;
  
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
  
    const handleSubmit = async () => {
 

      if (!isFormValid) {
        toast.error(
          "Please fill all required fields: Title, Tags, and Content."
        );
        return;
      }
      try {
        setLoading(true);
        const sanitizedContent = sanitizeContent(content);

        const res = await fetch(`/api/update-thread-post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content: sanitizedContent,
            slug,
            tags,
          }),
        });

        const result = await res.json();

        if (res.ok) {
          router.push(`/threads/topics/${slug}`);
          toast.success("Topic edited successfully!");
        } else {
          toast.error(`Error updating topic: ${result.error}`);
        }
      } catch (error) {
        console.error("ErrorMsg: ", error);
        toast.error("An error occurred while updating the topic.");
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <div className='mt-6 space-y-4'>
      <div>
        <label className='block text-gray-700 dark:text-gray-400 mb-1'>
          Title
        </label>
        <Input
          className=' w-full'
          type='text'
          id='title'
          name='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className=''>
        <label
          htmlFor='tags'
          className='block text-sm mb-1 font-medium text-gray-500'>
          Tags: (Enter a max. of 5 tags, separated by commas or pressing Enter)
        </label>
        <input
          id='tags'
          type='text'
          placeholder='Add a tag and press Enter or comma...'
          onKeyDown={handleTagInput}
          className='w-full p-2 border rounded'
        />
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

      <div className=''>
        <label
          htmlFor='content'
          className='block mb-1 text-sm font-medium text-gray-500'>
          Content
        </label>
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder='Write your content here...'
          className='rounded-lg dark:text-black dark:bg-gray-100 border-gray-300 dark:border-gray-700'
        />
      </div>

      <Button
        onClick={handleSubmit}
        className={` ${
          isFormValid
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        } ${loading ? "bg-gray-300" : ""} text-white rounded`}
        disabled={!isFormValid || loading}>
        {loading ? <LoadingAnimation /> : "Update"}
      </Button>
    </div>
  );
}

export default EditThreadPost