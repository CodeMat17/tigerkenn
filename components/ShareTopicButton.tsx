'use client'

import { ForwardIcon } from "lucide-react";

type Props = {
  topic: {
    title: string;
    slug: string;
  };
  classnames?: string;
};

const ShareTopicButton = ({ topic, classnames }: Props) => {
  return (
    <button
      //   variant='ghost'
      className={`${classnames}`}
      onClick={() => {
        if (navigator.share) {
          navigator
            .share({
              title: topic.title,
              text: `Check out this post: ${topic.title}`,
              url: `${window.location.origin}/threads/topics/${topic.slug}`,
            })
            .catch((error) => console.error("Error sharing:", error));
        } else {
          alert("Sharing is not supported in this browser.");
        }
      }}>
      <ForwardIcon className='w-5 h-5' /> <span className="text-sm font-medium">share</span>
    </button>
  );
};

export default ShareTopicButton;
