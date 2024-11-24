"use client";

import { createClient } from "@/utils/supabase/clients";
import { BadgeCheckIcon, BadgeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingAnimation from "./LoadingAnimation";

type VoteButtonProps = {
  postId: string;
  user: { id: string } | null;
  slug: string;
};

const VoteButton: React.FC<VoteButtonProps> = ({ postId, user, slug }) => {
  const supabase = createClient();
  const router = useRouter();

  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVoteStatus = async () => {
      setLoading(true);
      try {
        const { data: voteStatus, error } = await supabase
          .from("votes")
          .select("id, post_id, user_id, voted")
          .eq("post_id", postId)
          .eq("user_id", user?.id)
          .single();

        if (error) {
          console.error("Failed to fetch vote status: ", error);
          return;
        }

        setVoted(voteStatus.voted);
      } catch (error) {
        console.error("Failed to fetch vote status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVoteStatus();
  }, [postId, user, supabase, router]);

  const handleVoteToggle = async () => {
    if (!user) {
      alert("Please log in to vote.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/vote-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId: user.id, slug }),
      });

      const data = await response.json();

      if (response.ok) {
        setVoted(data.voted); // Update vote status
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to toggle vote:", error);
      toast.error("An error occurred while toggling your vote.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVoteToggle}
      disabled={loading}
      className='flex flex-col justify-center items-center gap- bg-gray-100 dark:bg-gray-800 focus:outline-none rounded-lg overflow-hidden px-2 py-1'>
      {loading ? (
        <BadgeIcon className='animate-spin  w-5 h-5' />
      ) : voted ? (
        <BadgeCheckIcon className='text-green-500 w-5 h-5' />
      ) : (
        <BadgeIcon className=' w-5 h-5' />
      )}
      <span className='text-sm font-medium'>
        {loading ? <LoadingAnimation /> : voted ? "voted" : "vote"}
      </span>
    </button>
  );
};

export default VoteButton;
