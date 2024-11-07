"use client";

import { User } from "@supabase/supabase-js";
import { HeartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface LikeButtonProps {
  postId: string;
  user: User | null;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, user }) => {
  //   const session = useSession(); // Get the authenticated session from Supabase
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);

  // Fetch initial like status and total likes
  useEffect(() => {
    const fetchLikeData = async () => {
   

        try {
          // Fetch total likes count regardless of user session
            const response = await fetch(
              `/api/like-status?postId=${postId}&userId=${user?.id || ""
              }`
            );
          if (response.ok) {
            const data = await response.json();
            // setLiked(data.liked);
            setTotalLikes(data.totalLikes);

            // Only set liked status if there is a logged-in user
            if (user) {
              setLiked(data.liked);
            }
          }
        } catch (error) {
        console.error("Failed to fetch like data:", error);
      }
    };

    fetchLikeData();
  }, [postId, user]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error("HOLD-ON!", {
        description: "Please, you have to log in to like posts",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/toggle-like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId: user.id,
          liked: !liked,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setTotalLikes(data.totalLikes);
      }
    } catch (error) {
      console.error("Failed to toggle like status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
   
      onClick={handleLikeToggle}
      disabled={loading}
      className='flex items-center gap-2 bg-gray-100 dark:hover:bg-gray-800 focus:outline-none rounded-lg overflow-hidden px-2 py-1'>
      {liked ? (
        <HeartIcon className='text-red-500 fill-current w-4 h-4' />
      ) : (
        <HeartIcon className='text-gray-500 w-4 h-4' />
      )}
      <span className='text-sm font-medium'>{totalLikes}</span>
    </button>
  );
};

export default LikeButton;
