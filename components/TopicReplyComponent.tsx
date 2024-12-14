'use client'

import React from "react";
import { createClient } from "@/utils/supabase/clients";
import { User } from "@supabase/supabase-js";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingAnimation from "./LoadingAnimation";
import TiptapEditor from "./TiptapEditor";

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

  const sanitizeContent = (htmlContent: string) =>
    DOMPurify.sanitize(htmlContent);

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
       <div
         key={reply.id}
         className={`relative mt-6 ${
           depth > 0 ? `ml-${Math.min(depth * 4, 12)}` : ""
         }`}>
         {/* Connecting Line */}
         {depth > 0 && (
           <div
             className='absolute top-0 left-0 h-full border-l border-gray-300 dark:border-gray-600'
             style={{ marginLeft: "-1rem" }}
           />
         )}

         {/* Reply Container */}
         <div className='bg-white dark:bg-gray-800 shadow-sm p-4 rounded-lg'>
           {/* Author and Time */}
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

           {/* Reply Content */}
           <div
             className='mt-2 text-gray-700 dark:text-gray-200'
             dangerouslySetInnerHTML={{ __html: reply.reply }}></div>

           {/* Reply Input */}
           {activeReplyId === reply.id && (
             <div className='mt-4'>
               <TiptapEditor
                 onUpdate={(content) =>
                   setReplyEditorMap((prev) => ({
                     ...prev,
                     [reply.id]: content as string,
                   }))
                 }
               />
               <div className='flex gap-2 mt-4'>
                 <button
                   onClick={() => postReply(replyEditorMap[reply.id], reply.id)}
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

           {/* Nested Replies */}
           {renderReplies(reply.id, depth + 1)}
         </div>
       </div>
     ));
 };


  useEffect(() => {
    fetchReplies();
  }, [topicId]);

  return (
    <div className='my-6'>
      <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-gray-200'>
        Discussion
      </h2>
      {fetching ? (
        <div className='space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='bg-gray-100 dark:bg-gray-800 h-6 rounded animate-pulse'
            />
          ))}
        </div>
      ) : (
        <>
          {user ? (
            <div className='mb-4'>
              <TiptapEditor
                onUpdate={(content) => setMainEditorContent(content)}
              />
              <button
                onClick={() => postReply(mainEditorContent, null)}
                className='mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>
                {loading ? <LoadingAnimation /> : "Comment"}
              </button>
            </div>
          ) : (
            <p className='text-gray-500 text-center'>
              Please log in to join the discussion.
            </p>
          )}
          <div>{renderReplies(null)}</div>
        </>
      )}
    </div>
  );
};

export default TopicReplyComponent;
