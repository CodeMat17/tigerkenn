"use client";

import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type VoteSectionProps = {
  initialVotes: number;
  postId: number;
  slug: string;
  userId?: string;
};

const VoteComponent = ({
  initialVotes,
  postId,
  userId,
  slug,
}: VoteSectionProps) => {
  const [votes, setVotes] = useState(initialVotes);
  const [isLoading, setIsLoading] = useState(false);
  const [userVote, setUserVote] = useState<1 | -1 | null>(null);

  useEffect(() => {
    const fetchVoteStatus = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/vote-status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId, userId, slug }),
        });

        const data = await response.json();
        if (response.ok) {
          setUserVote(data.userVote); // Existing vote status: 1 (upvoted), -1 (downvoted), null (no vote)
        } else {
          console.error("Failed to fetch vote status:", data.message);
        }
      } catch (error) {
        console.error("Error fetching vote status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoteStatus();
  }, [postId, userId, slug]);

  const handleVote = async (increment: 1 | -1) => {
    if (!userId) {
      alert("You must be logged in to vote.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, increment, slug, userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setVotes(data.newVotes); // Update votes count
        setUserVote(data.userVote); // Update user's vote status
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating vote:", error);
      toast.error("An error occurred while voting.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <button
        onClick={() => handleVote(1)}
        disabled={isLoading || userVote === 1}
        className={`p-2 rounded-full ${
          userVote === 1 ? "bg-green-200" : "bg-gray-100"
        }`}>
        <ThumbsUpIcon className='w-4 h-4 text-green-600' />
      </button>
      <p className='text-lg font-semibold'>{votes}</p>
      <button
        onClick={() => handleVote(-1)}
        disabled={isLoading || userVote === -1}
        className={`p-2 rounded-full ${
          userVote === -1 ? "bg-red-200" : "bg-gray-100"
        }`}>
        <ThumbsDownIcon className='w-4 h-4 text-red-600' />
      </button>
    </div>
  );
};

export default VoteComponent;
