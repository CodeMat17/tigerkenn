import { MinusIcon } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Threads: Listings & Expert Technical Discussions",
  description:
    "Explore property listings and join insightful technical discussions.",
};

const ThreadPage = () => {
  redirect("threads/topics");

  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <MinusIcon className='animate-spin' />
    </div>
  );
};

export default ThreadPage;
