"use client";

import { ThumbsUpIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type UpvoteButtonProps = {
  postId: number;
  userId?: string;
  slug: string;
  initialUpvotes: number;
  initialUserVote: 1 | -1 | null;
  onVoteChange: (newVote: 1 | -1 | null) => void;
};

const UpvoteButton = ({
  postId,
  userId,
  slug,
  initialUpvotes,
  initialUserVote,
  onVoteChange,
}: UpvoteButtonProps) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isLoading, setIsLoading] = useState(false);
  const [userVote, setUserVote] = useState(initialUserVote);

  const handleUpvote = async () => {
    if (!userId) {
      alert("You must be logged in to upvote.");
      return;
    }

    const increment = userVote === 1 ? -1 : 1; // Toggle upvote
    const newVote = increment === 1 ? 1 : null; // Update userVote state

    setIsLoading(true);
    try {
      const response = await fetch(`/api/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, increment, slug, userId }),
      });

      if (response.ok) {
        setUpvotes((prev) => prev + increment); // Update UI
        setUserVote(newVote);
        onVoteChange(newVote); // Notify parent component
        toast.success("Upvote updated successfully!");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update upvote.");
      }
    } catch (error) {
      console.error("Error updating upvote:", error);
      toast.error("An error occurred while updating your upvote.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={isLoading}
      className={`p-2 rounded-full ${
        userVote === 1 ? "bg-green-200" : "bg-gray-100"
      }`}>
      <ThumbsUpIcon className='w-4 h-4 text-green-600' />
      <span className='ml-2 text-sm'>{upvotes}</span>
    </button>
  );
};

export default UpvoteButton;
