"use client";

import { ThumbsDownIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type DownvoteButtonProps = {
  postId: number;
  userId?: string;
  slug: string;
  initialDownvotes: number;
  initialUserVote: 1 | -1 | null;
  onVoteChange: (newVote: 1 | -1 | null) => void;
};

const DownvoteButton = ({
  postId,
  userId,
  slug,
  initialDownvotes,
  initialUserVote,
  onVoteChange,
}: DownvoteButtonProps) => {
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [isLoading, setIsLoading] = useState(false);
  const [userVote, setUserVote] = useState(initialUserVote);

  const handleDownvote = async () => {
    if (!userId) {
      alert("You must be logged in to downvote.");
      return;
    }

    const increment = userVote === -1 ? -1 : 1; // Toggle downvote
    const newVote = increment === 1 ? -1 : null; // Update userVote state

    setIsLoading(true);
    try {
      const response = await fetch(`/api/downvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, increment, slug, userId }),
      });

      if (response.ok) {
        setDownvotes((prev) => prev + increment); // Update UI
        setUserVote(newVote);
        onVoteChange(newVote); // Notify parent component
        toast.success("Downvote updated successfully!");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update downvote.");
      }
    } catch (error) {
      console.error("Error updating downvote:", error);
      toast.error("An error occurred while updating your downvote.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownvote}
      disabled={isLoading}
      className={`p-2 rounded-full ${
        userVote === -1 ? "bg-red-200" : "bg-gray-100"
      }`}>
      <ThumbsDownIcon className='w-4 h-4 text-red-600' />
      <span className='ml-2 text-sm'>{downvotes}</span>
    </button>
  );
};

export default DownvoteButton;
