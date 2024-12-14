"use client";

import { User } from "@supabase/supabase-js";
// import DOMPurify from "dompurify";
import { MinusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TiptapEditor from "./TiptapEditor";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function convertTitleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

const AddNewTopic = ({ user }: { user: User }) => {
  const router = useRouter();

  if (!user) {
    router.push("/login");
    // return null;
  }

  const userId = user?.id;
  const [title, setTitle] = useState("");
  const [tiptapContent, setTiptapContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);

  const slug = convertTitleToSlug(title);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isContentValid = (html: string) => {
    const strippedContent = html.replace(/<\/?[^>]+(>|$)/g, "").trim();
    return !!strippedContent;
  };

  const isFormValid =
    title.trim() &&
    isContentValid(tiptapContent) &&
    tags.length > 0 &&
    tags.length <= 5;

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Please fill all required fields: Title, Tags, and Content.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/add-new-thread`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: tiptapContent,
          user_id: userId,
          slug,
          tags,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        router.push(`/threads/topics`);
        toast.success("thread published successfully!");
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

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <h2 className='text-2xl mb-4'>Create New Topic</h2>
      <div>
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
              placeholder='Add a tag and press Add'
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className='w-full'
            />
            <Button
              type='button'
              onClick={() => {
                const newTag = currentTag.trim().toLowerCase();
                if (newTag && !tags.includes(newTag) && tags.length < 5) {
                  setTags([...tags, newTag]);
                  setCurrentTag("");
                }
              }}
              className='bg-blue-500 text-white hover:bg-blue-600'
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
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className='ml-2 text-red-500 hover:text-red-700'
                  aria-label={`Remove tag ${tag}`}>
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {isMounted && (
          <div className='mb-4'>
            <label
              htmlFor='content-tiptap'
              className='block mb-1 text-sm font-medium text-gray-500'>
              Content
            </label>
            <TiptapEditor onUpdate={setTiptapContent} />
          </div>
        )}

        <Button
          onClick={handleSubmit}
          className={` ${
            isFormValid
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          } text-white`}
          disabled={!isFormValid || loading}>
          {loading ? <MinusIcon className='animate-spin' /> : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default AddNewTopic;
