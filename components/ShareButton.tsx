"use client";

import { Share2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ShareButton: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
      })
      .catch((error) => {
        console.error("Failed to copy URL:", error);
      });
  };

  if (copied) {
    toast.success("Copied!");
  }

  return (
    <button
      onClick={handleShare}
      className='flex items-center gap-2 dark:text-gray-300 transition-colors duration-300 focus:outline-none'
      aria-label='Share this post'>
      <Share2Icon className='w-4 h-4' />
      {/* <span className='text-sm'>{copied ? "Copied!" : "Share"}</span> */}
    </button>
  );
};

export default ShareButton;
