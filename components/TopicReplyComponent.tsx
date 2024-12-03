"use client";

import { createClient } from "@/utils/supabase/clients";
import { User } from "@supabase/supabase-js";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import LoadingAnimation from "./LoadingAnimation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const mainEditorModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    ["link", "image"],
    ["clean"],
  ],
};

const replyEditorModules = {
  toolbar: [["bold", "italic", "underline"], ["link"]],
};

type Props = {
  topicId: number;
  slug: string;
  user: User | null;
};

type Reply = {
  id: string;
  created_at: Date;
  reply: string;
  author: string;
  topic_id: number;
  parent_id: string | null;
};

const TopicReplyComponent: React.FC<Props> = ({ topicId, user, slug }) => {
  const supabase = createClient();
  const author = user?.email ? user.email.split("@")[0] : "Anonymous";

  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [mainEditorContent, setMainEditorContent] = useState("");
  const [replyEditorMap, setReplyEditorMap] = useState<{
    [key: string]: string;
  }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const sanitizeContent = (htmlContent: string) => {
    return DOMPurify.sanitize(htmlContent);
  };

  const fetchReplies = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from("topic_reply")
        .select("id, created_at, reply, author, topic_id, parent_id")
        .eq("topic_id", topicId)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch replies.");
        return;
      }
      setReplies(data || []);
    } catch (error) {
      console.error("Failed to fetch replies.", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setFetching(false);
    }
  };

  const postReply = async (content: string, parentId: string | null) => {
    if (!user) {
      toast.error("You must be logged in to add a reply.");
      return;
    }

    if (!content.trim()) {
      toast.error("Reply content cannot be empty.");
      return;
    }

    const sanitizedContent = sanitizeContent(content);

    try {
      setLoading(true);
      const res = await fetch(`/api/topic-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_id: topicId,
          author,
          reply: sanitizedContent,
          parent_id: parentId,
          slug,
        }),
      });

      if (res.ok) {
        toast.success("Reply posted successfully!");
        setReplyEditorMap((prev) => ({ ...prev, [parentId || ""]: "" }));
        setActiveReplyId(null);
        setMainEditorContent("");
        fetchReplies();
      } else {
        toast.error("Failed to post reply.");
      }
    } catch (error) {
      console.error("Failed to post reply.", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const renderReplies = (parentId: string | null, depth = 0) => {
    return replies
      .filter((reply) => reply.parent_id === parentId)
      .map((reply) => (
        <div key={reply.id} className='relative mt-8'>
          {depth > 0 && (
            <div
              className='absolute'
              style={{
                left: `${Math.min(depth * 24, 64)}px`,
                top: "1.25rem",
              }}>
              <svg
                width={Math.min(80, depth * 30)}
                height='50'
                xmlns='http://www.w3.org/2000/svg'
                className='overflow-visible'>
                <path
                  d={`M10 0 C10 20, ${Math.min(70, depth * 28)} 20, ${Math.min(
                    70,
                    depth * 28
                  )} 40`}
                  stroke='#007BFF'
                  strokeWidth='3'
                  fill='none'
                />
              </svg>
            </div>
          )}

          <div
            className='relative flex gap-4'
            style={{
              marginLeft: `${Math.min(depth * 24, 64)}px`,
            }}>
            <div className='flex-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm'>
              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  <strong>@{reply.author}</strong> •{" "}
                  <span>
                    {new Date(reply.created_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </p>
                {user && (
                  <button
                    onClick={() => setActiveReplyId(reply.id)}
                    className='text-blue-500 hover:underline text-xs'>
                    Reply
                  </button>
                )}
              </div>
              <div
                className='mt-2 text-gray-700 dark:text-gray-200'
                dangerouslySetInnerHTML={{ __html: reply.reply }}></div>

              {activeReplyId === reply.id && (
                <div className='mt-4'>
                  <ReactQuill
                    theme='snow'
                    value={replyEditorMap[reply.id] || ""}
                    onChange={(content) =>
                      setReplyEditorMap((prev) => ({
                        ...prev,
                        [reply.id]: content,
                      }))
                    }
                    modules={replyEditorModules}
                    className='w-full bg-white rounded-md shadow-sm'
                  />
                  <div className='flex gap-2 mt-4'>
                    <button
                      onClick={() =>
                        postReply(replyEditorMap[reply.id], reply.id)
                      }
                      className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'>
                      {loading ? <LoadingAnimation /> : "Reply"}
                    </button>
                    <button
                      onClick={() => setActiveReplyId(null)}
                      className='text-gray-500 hover:underline'>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {renderReplies(reply.id, depth + 1)}
            </div>
          </div>
        </div>
      ));
  };

  useEffect(() => {
    fetchReplies();
  }, [topicId]);

  return (
    <div className='mt-6 pt-6 border-t'>
      <h3 className='text-lg font-bold mb-6'>Discussion</h3>
      {fetching ? (
        <div className='space-y-6'>
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className='border rounded-xl p-6 space-y-3 animate-pulse'>
              <div className='w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-full' />
              <div className='w-[70%] p-3 bg-gray-100 dark:bg-gray-800 rounded-full' />
              <div className='w-[40%] p-3 bg-gray-100 dark:bg-gray-800 rounded-full' />
            </div>
          ))}
        </div>
      ) : (
        <>
          {user ? (
            <div className='mb-6 bg-white dark:bg-gray-900 p-4 rounded-lg shadow'>
              <h4 className='text-md font-medium mb-4'>Join the discussion</h4>
              <ReactQuill
                theme='snow'
                value={mainEditorContent}
                onChange={setMainEditorContent}
                modules={mainEditorModules}
                className='w-full bg-white rounded-md shadow-sm'
              />
              <button
                onClick={() => postReply(mainEditorContent, null)}
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4'>
                {loading ? <LoadingAnimation /> : "Comment"}
              </button>
            </div>
          ) : (
            <p className='text-gray-500 text-center'>Log in to participate.</p>
          )}

          <div className='mt-6'>{renderReplies(null)}</div>
        </>
      )}
    </div>
  );
};

export default TopicReplyComponent;
