"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import DOMPurify from "dompurify";
import { Button } from "./ui/button";
import LoadingAnimation from "./LoadingAnimation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import TiptapEditor from "./TiptapEditor";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import styles

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });


const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
  ssr: false,
});

function convertTitleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

type Props = {
  id: number;
  post_title: string;
  post_tags: string;
  post_content: string;
};

const EditThreadPost = ({ id, post_title, post_tags, post_content }: Props) => {
  const router = useRouter();

  const [title, setTitle] = useState(post_title);
  const [tags, setTags] = useState<string[]>(
    Array.isArray(post_tags)
      ? post_tags
      : typeof post_tags === "string"
      ? [post_tags]
      : []
  );
  const [currentTag, setCurrentTag] = useState(""); // Input for the current tag

  const [content, setContent] = useState(post_content);
  const [loading, setLoading] = useState(false);

  const newSlug = convertTitleToSlug(title);

  const addTag = () => {
    const newTag = currentTag.trim().toLowerCase();
    if (newTag && !tags.includes(newTag) && tags.length < 5) {
      setTags((prevTags) => [...prevTags, newTag]);
      setCurrentTag(""); // Clear the input field
    } else if (tags.length >= 5) {
      toast.error("You can only add up to 5 tags.");
    } else if (tags.includes(newTag)) {
      toast.error("This tag is already added.");
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

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Please fill all required fields: Title, Tags, and Content.");
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
          tags,
          id,
          newSlug,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        router.push(`/threads/topics/${newSlug}`);
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
    <div className='mt-6 space-y-4 w-full max-w-3xl mx-auto'>
      <div>
        <label className='block text-gray-700 dark:text-gray-400 mb-1'>
          Title
        </label>
        <Input
          className='w-full'
          type='text'
          id='title'
          name='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor='tags'
          className='block text-sm mb-1 font-medium text-gray-500'>
          Tags: (Max of 5 tags)
        </label>
        <div className='flex gap-2'>
          <Input
            id='tags'
            type='text'
            placeholder='Add a tag and press Enter or comma...'
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            className='w-full p-2 border rounded'
          />
          <Button
            type='button'
            onClick={addTag}
            disabled={!currentTag.trim() || tags.length >= 5}
            className='bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600'>
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

      <div>
        <label
          htmlFor='content'
          className='block mb-1 text-sm font-medium text-gray-500'>
          Content
        </label>
        <TiptapEditor
          initialContent={content}
          onUpdate={(updatedContent) => setContent(updatedContent)}
        />
      </div>

      <div>
        <label
          htmlFor='content'
          className='block mb-1 text-sm font-medium text-gray-500'>
          Content
        </label>
        <ReactQuill
          value={content}
          onChange={(value) => setContent(value)}
          modules={{
            toolbar: [
              ["bold", "italic", "underline", "strike"],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["link", "image", "code-block"],
              ["blockquote", "code"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["clean"],
            ],
          }}
          formats={[
            "bold",
            "italic",
            "underline",
            "link",
            "image",
            "list",
            "bullet",
          ]}
        />
      </div>

      <Button
        onClick={handleSubmit}
        className={`${
          isFormValid
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        } ${loading ? "bg-gray-50" : ""} text-white rounded`}
        disabled={!isFormValid || loading}>
        {loading ? <LoadingAnimation /> : "Update"}
      </Button>
    </div>
  );
};

export default EditThreadPost;
