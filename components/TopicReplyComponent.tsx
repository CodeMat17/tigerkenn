"use client";

import { createClient } from "@/utils/supabase/clients";
import { User } from "@supabase/supabase-js";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
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
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const replyEditorModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ],
};

type Props = {
  topicId: string;
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
  const router = useRouter();

  const author = user?.email ? user.email.split("@")[0] : "Anonymous";

  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);
  const [mainEditorContent, setMainEditorContent] = useState("");
  const [replyEditorMap, setReplyEditorMap] = useState<{
    [key: string]: string;
  }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

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

  const fetchReplies = async () => {
    setLoading(true);
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
      console.log("Failed to post reply.", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const postReply = async (content: string, parentId: string | null) => {
    if (!user) {
      alert("You must be logged in to add a reply.");
      router.push("/login");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic_id: topicId,
          author,
          reply: sanitizedContent,
          parent_id: parentId,
          slug
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
      console.log("Failed to post reply.", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const renderReplies = (parentId: string | null) => {
    return replies
      .filter((reply) => reply.parent_id === parentId)
      .map((reply) => (
        <div key={reply.id} className='mt-4 rounded-lg overflow-hidden border'>
          <div className='p-3 border bg-white dark:bg-gray-800'>
            <div className='flex justify-between items-center'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                @{reply.author} •{" "}
                <span>
                  {new Date(reply.created_at).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>{" "}
                |{" "}
                <button
                  onClick={() => setActiveReplyId(reply.id)}
                  className='text-blue-500 hover:text-blue-600 text-sm'>
                  Reply
                </button>
              </div>
            </div>

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
                  className='w-full dark:bg-gray-100 dark:text-gray-800 rounded-lg'
                />
                <button
                  onClick={() => postReply(replyEditorMap[reply.id], reply.id)}
                  disabled={loading}
                  className={`px-4 py-2 ${
                    loading
                      ? "bg-blue-50 text-gray-50"
                      : "bg-blue-500 text-white"
                  }  rounded-lg hover:bg-blue-600 mt-4`}>
                  {loading ? <LoadingAnimation /> : "Post Reply"}
                </button>
                <button
                  onClick={() => setActiveReplyId(null)}
                  className='text-gray-500 hover:text-gray-700 text-sm ml-4'>
                  Cancel
                </button>
              </div>
            )}

            <div
              className='quill-content mt-4'
              dangerouslySetInnerHTML={{ __html: reply.reply || "" }}
            />
            {renderReplies(reply.id)}
          </div>
        </div>
      ));
  };

  useEffect(() => {
    fetchReplies();
  }, [topicId]);

  return (
    <div className='mt-6 pt-6 border-t max-w-2xl'>
      <h3 className='text-lg font-semibold mb-6'>Replies</h3>

      {user ? (
        <div className='mt-6 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 shadow-md'>
          <h4 className='text-md font-medium mb-4'>
            Share your thoughts on this topic
          </h4>
          <ReactQuill
            theme='snow'
            value={mainEditorContent}
            onChange={setMainEditorContent}
            modules={mainEditorModules}
            className='w-full dark:bg-gray-100 dark:text-gray-800 rounded-lg'
          />
          <button
            onClick={() => postReply(mainEditorContent, null)}
            disabled={loading}
            className={`px-4 py-2 ${
              loading ? "bg-blue-50 text-gray-50" : "bg-blue-500 text-white"
            }  rounded-lg hover:bg-blue-600 mt-4`}>
            {loading ? <LoadingAnimation /> : "Post Reply"}
          </button>
        </div>
      ) : (
        <p className='text-gray-500 mt-4'>Login to leave a reply.</p>
      )}

      <div className='mt-6'>{renderReplies(null)}</div>
    </div>
  );
};

export default TopicReplyComponent;
