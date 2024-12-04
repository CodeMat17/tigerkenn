import ShareTopicButton from "@/components/ShareTopicButton";
import TopicReplyComponent from "@/components/TopicReplyComponent";
import VoteButton from "@/components/VoteButton";
import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { FilePenLineIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteSinglePost from "@/components/DeleteSinglePost";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: { slug: string };
};

// type Topic = {
//   id: number;
//   slug: string;
//   title: string;
//   tags: string[];
//   content: string;
//   created_at: string;
//   views: number;
//   votes: number;
//   user_id: string;
//   updated_on?: string;
// };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("topics")
    .select("title, slug")
    .eq("slug", params.slug)
    .single();

  return {
    title: data?.title || "Thread",
    description: data?.slug || "View detailed information about this thread",
    openGraph: {
      title: data?.title || "Thread",
      description:
        `Read more about: ${data?.slug}` ||
        "View detailed information about this thread",
    },
  };
}

const incrementViewCount = async (topicId: number, slug: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_HOME || "http://localhost:3000";
  try {
    const response = await fetch(`${baseUrl}/api/view-count`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, slug }),
    });

    if (!response.ok) {
      console.error("Failed to increment view count:", await response.json());
    }
  } catch (error) {
    console.error("Error while incrementing view count:", error);
  }
};

const SlugDetail = async ({ params: { slug } }: Props) => {
  const supabase = createClient();

  // Fetch authenticated user
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user || null;

  // Fetch topic details
  const { data: topic, error: topicError } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .single();

  if (topicError || !topic) {
    notFound();
  }

  // Fetch reply count
  const { count: replyCount, error: replyError } = await supabase
    .from("topic_reply")
    .select("*", { count: "exact" })
    .eq("topic_id", topic.id);

  if (replyError) {
    console.error("Failed to fetch reply count.");
  }

  // Increment view count (can also run asynchronously if required)
  await incrementViewCount(topic.id, slug);

  const userId = user?.id;
  const isAdmin = user?.app_metadata?.isAdmin;

  return (
    <div className='px-4 py-8 max-w-4xl mx-auto'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <div className='flex gap-2 text-sm text-gray-500 dark:text-gray-400'>
            <p>Views: {topic.views}</p> | <p>Votes: {topic.votes}</p> |{" "}
            <p>Replies: {replyCount || 0}</p>
          </div>
          {topic.updated_on ? (
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Updated on {dayjs(topic.updated_on).format("MMM DD, YYYY h:mm a")}
            </p>
          ) : (
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Published on{" "}
              {dayjs(topic.created_at).format("MMM DD, YYYY h:mm a")}
            </p>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <VoteButton postId={topic.id} user={user} slug={slug} />
          <ShareTopicButton
            topic={topic}
            classnames='flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg'
          />
        </div>
      </div>

      <h2 className='text-2xl font-semibold'>{topic.title}</h2>
      <div className='text-sm text-gray-600 dark:text-gray-300  mt-2'>
        {topic.tags &&
          topic.tags.map((tag: string, i: number) => (
            <Badge key={i} className='mr-2 italic rounded-full'>
              #{tag}
            </Badge>
          ))}
      </div>

      <div className='flex items-center gap-5 mt-4'>
        {userId === topic.user_id && (
          <Link
            href={`/threads/topics/edit-post/${topic.slug}`}
            className='flex items-center border rounded-full px-3 py-1'>
            <FilePenLineIcon className='mr-1 w-5 h-5' />
            Edit
          </Link>
        )}
        {(userId === topic.user_id || isAdmin) && (
          <DeleteSinglePost
            id={topic.id}
            title={topic.title}
            classnames='border border-red-500 rounded-full px-3 py-1'
          />
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

export default SlugDetail;
