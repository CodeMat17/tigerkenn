"use client";

import { ForwardIcon } from "lucide-react";

type Props = {
  title: string;
  slug: string;
  classnames?: string;
};

const ShareLink = ({ title, slug, classnames }: Props) => {
  return (
    <button
      className={`${classnames} flex items-center`}
      onClick={() => {
        if (navigator.share) {
          navigator
            .share({
              title: title,
              text: `Check out this post: ${title}`,
              url: `${window.location.origin}/threads/topics/${slug}`,
            })
            .catch((error) => console.error("Error sharing:", error));
        } else {
          alert("Sharing is not supported in this browser.");
        }
      }}>
      <ForwardIcon className={`mr-1 w-4 h-4`} /> Share
    </button>
  );
};

export default ShareLink;
