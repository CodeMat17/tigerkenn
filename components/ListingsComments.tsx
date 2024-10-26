"use client";

import { createClient } from "@/utils/supabase/clients";
import dayjs from "dayjs";
import { MinusIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { User } from "@supabase/supabase-js";


// Define the structure of a comment
type Comment = {
  id: string;
  user_id: string;
  author: string;
  comment: string;
  date: string;
  parent_id: string | null; // Add parent_id to represent replies
};

type Props = {
  id: string;
  username: string | null;
  user: User | null; // Supabase user object
}

const Comments = ({
  id,
  username, user
}: Props) => {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname() 

  const [comments, setComments] = useState<Comment[]>([]); // Use the defined Comment[] type
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [sendingComment, setSendingComment] = useState(false);
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null); // Track which comment reply box is active
  const [replies, setReplies] = useState<{ [key: string]: string }>({}); // Store reply content for each comment
  const [sendingReply, setSendingReply] = useState<string | null>(null); // Track which reply is being sent

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("listing_comments")
        .select("*")
        .eq("listing_id", id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error);
      }

      if (data) {
        setComments(data as Comment[]); // Ensure the data matches the Comment[] type
      }
    } catch (error) {
      console.log("ErrorMsd: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if a user is logged in
    if (!user) {
     alert("WAIT OOO! - You must be logged in to add a comment")
      const returnUrl = pathname
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`); // Redirect to login if no user
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setSendingComment(true);

    const formData = new FormData();
    formData.append("id", id);
    formData.append("comment", newComment);
    formData.append("author", `@${username}`);
    formData.append("date", new Date().toISOString());
    formData.append("parent_id", "null"); // Main comment should have no parent_id

    try {
      const res = await fetch("/api/add-listing-comment", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Error adding comment:", result);
      } else {
        toast("COMMENT ADDED!", {
          description: "Your comment has been successfully added",
        });
      }

      fetchComments(); // Refresh comments after adding
    } catch (error) {
      console.log("Error adding comment: ", error);
      toast.error("ERROR!", { description: `Error adding comment: ${error}` });
    } finally {
      setNewComment("");
      setSendingComment(false);
    }
  };

  const handleAddReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();

    // Check if a user is logged in
    if (!user) {
      alert("WAIT OOO! - You must be logged in to add a comment");
      const returnUrl = pathname;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`); // Redirect to login if no user
      return;
    }

    const replyText = replies[parentId];
    if (!replyText || !replyText.trim()) {
      toast.error("Please enter a valid reply");
      return;
    }

    setSendingReply(parentId);

    const formData = new FormData();
    formData.append("id", id);
    formData.append("comment", replyText);
    formData.append("author", `@${username}`);
    formData.append("date", new Date().toISOString());
    formData.append("parent_id", parentId); // Add reply to the correct parent comment

    try {
      const res = await fetch("/api/add-listing-comment", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Error adding reply:", result);
      } else {
        toast("REPLY ADDED!", {
          description: "Your reply has been successfully added",
        });
      }

      fetchComments(); // Refresh comments after adding a reply
    } catch (error) {
      console.log("Error adding reply: ", error);
      toast.error("ERROR!", { description: `Error adding reply: ${error}` });
    } finally {
      setReplies((prevReplies) => ({ ...prevReplies, [parentId]: "" })); // Clear reply textarea after submission
      setActiveReplyBox(null); // Close reply box after reply is submitted
      setSendingReply(null); // Reset sending state
    }
  };

  const handleReplyInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    parentId: string
  ) => {
    setReplies((prevReplies) => ({
      ...prevReplies,
      [parentId]: e.target.value,
    }));
  };

  // Render replies recursively
  const renderReplies = (parentId: string) => {
    return comments
      .filter((comment) => comment.parent_id === parentId)
      .map((reply) => (
        <div key={reply.id} className='ml-6 border-l-2 pl-4 reply'>
          <p className=''>{reply.comment}</p>
          <p className='text-xs font-medium'>
            {reply.author || "Anonymous"} |{" "}
            {dayjs(reply.date).format("MMM DD, YYYY h:mm:ss a")}
          </p>
          <button
            onClick={() => setActiveReplyBox(reply.id)}
            className='text-xs text-blue-500'>
            Reply
          </button>
          {/* If this reply's reply box is active, show textarea */}
          {activeReplyBox === reply.id && (
            <form
              onSubmit={(e) => handleAddReply(e, reply.id)}
              className='mt-2'>
              <Textarea
                placeholder='Add your reply'
                value={replies[reply.id] || ""}
                onChange={(e) => handleReplyInputChange(e, reply.id)}
                className='w-full border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <Button
                type='submit'
                className='mt-2 bg-blue-500 text-white font-semibold hover:bg-blue-600'
                disabled={sendingReply === reply.id}>
                {sendingReply === reply.id ? "Submitting..." : "Submit Reply"}
              </Button>
            </form>
          )}
          {renderReplies(reply.id)} {/* Recursively render replies */}
        </div>
      ));
  };

  return (
    <div className='bg-gray-100 dark:bg-gray-900 p-6 rounded-lg mt-12'>
      <div className='max-w-[650px]'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-400 mb-4'>
          Comments
        </h2>

        {/* Render existing comments */}
        {loading ? (
          <div className='flex items-center px-4 py-2'>
            <MinusIcon className='mr-3 animate-spin' /> loading comments...
          </div>
        ) : (
          <div className='space-y-4'>
            {comments.length === 0 ? (
              <p className='text-gray-500'>No comments yet.</p>
            ) : (
              comments
                .filter((comment) => comment.parent_id === null) // Top-level comments only
                .map((comment) => (
                  <div key={comment.id} className='flex flex-col items-start'>
                    <div className='dark:text-gray-400'>
                      <p className=' '>{comment.comment}</p>
                      <p className='text-xs font-medium'>
                        {comment.author || "Anonymous"} |{" "}
                        {dayjs(comment.date).format("MMM DD, YYYY h:mm:ss a")}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveReplyBox(comment.id)}
                      className='text-xs text-blue-500'>
                      Reply
                    </button>
                    {/* If this comment's reply box is active, show textarea */}
                    {activeReplyBox === comment.id && (
                      <form
                        onSubmit={(e) => handleAddReply(e, comment.id)}
                        className='mt-2'>
                        <Textarea
                          placeholder='Add your reply'
                          value={replies[comment.id] || ""}
                          onChange={(e) =>
                            handleReplyInputChange(e, comment.id)
                          }
                          className='w-full border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <Button
                          type='submit'
                          className='mt-2 bg-blue-500 text-white font-semibold hover:bg-blue-600'
                          disabled={sendingReply === comment.id}>
                          {sendingReply === comment.id
                            ? "Submitting..."
                            : "Submit Reply"}
                        </Button>
                      </form>
                    )}
                    {renderReplies(comment.id)} {/* Render replies */}
                  </div>
                ))
            )}
          </div>
        )}

        {/* Add new comment */}
        <form onSubmit={handleAddComment} className='mt-4'>
          <Textarea
            placeholder='Add your comment'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className='w-full border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <Button
            type='submit'
            className='mt-2 bg-blue-500 text-white font-semibold hover:bg-blue-600'
            disabled={sendingComment}>
            {sendingComment ? "Submitting..." : "Submit Comment"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Comments;
