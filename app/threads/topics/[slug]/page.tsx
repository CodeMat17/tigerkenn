import DeleteThread from "@/components/DeleteThread";
import ShareTopicButton from "@/components/ShareTopicButton";
import TopicReplyComponent from "@/components/TopicReplyComponent";
import VoteButton from "@/components/VoteButton";
import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

const TopicDetail = async ({ params: { slug } }: Props) => {
  const supabase = createClient();

  // Fetch user data
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  const isAdmin = user?.app_metadata?.isAdmin || false;

  // Fetch topic data and reply count
  const { data: topic, error: topicError } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .single();

  if (topicError) {
    notFound(); // Trigger a 404 if topic not found
  }

  if (!topic || topic.length === 0) {
    return (
      <div className='px-4 py-40 text-center'>
        No post found. Refresh page or go back.
      </div>
    );
  }

  // Increment view count
  try {
    const baseUrl = process.env.NEXT_PUBLIC_HOME || "http://localhost:3000";
    await fetch(`${baseUrl}/api/view-count`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId: topic.id, slug }),
    });
  } catch (error) {
    console.error("Failed to update view count:", error);
  }

  // Fetch reply count
  const { data: replies } = await supabase
    .from("topic_reply")
    .select("id")
    .eq("topic_id", topic.id);

  const replyCount = replies ? replies.length : 0;

  return (
    <div className='px-4 py-8 max-w-4xl mx-auto'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <div className=' flex gap-2 text-sm text-gray-500 dark:text-gray-400'>
            <p>views {topic.views}</p> |<p>votes {topic.votes}</p> |
            <p>replies {replyCount}</p>
          </div>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Published on {dayjs(topic.created_at).format("MMM DD, YYYY")}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <VoteButton postId={topic.id} user={user} slug={slug} />

          <ShareTopicButton
            topic={topic}
            classnames='flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 px-2 py-1  rounded-lg'
          />
        </div>
      </div>

      <h2 className='text-2xl font-semibold'>{topic.title}</h2>
      <p className='text-sm text-gray-600 dark:text-gray-300 italic mt-1'>
        Tags:{" "}
        {topic.tags &&
          topic.tags.map((tag: string, i: number) => (
            <span key={i} className='mr-2'>
              #{tag}
            </span>
          ))}
      </p>
      <div className='flex items-center gap-5 mt-2'>
        {userId === topic.user_id && (
          <Link
            href={`/threads/topics/edit-post/${topic.slug}`}
            className='border px-2 py-0.5 rounded-lg shadow'>
            Edit
          </Link>
        )}

        {(userId === topic.user_id || isAdmin) && (
          <DeleteThread id={topic.id} title={topic.title} />
        )}
      </div>
      <div
        className='quill-content max-w-full mt-6'
        dangerouslySetInnerHTML={{ __html: topic.content }}></div>

      {/* Replies */}
      <TopicReplyComponent topicId={topic.id} slug={topic.slug} user={user} />
    </div>
  );
};

export default TopicDetail;
