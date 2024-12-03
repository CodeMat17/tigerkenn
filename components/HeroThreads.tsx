import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import {
  EyeIcon,
  FilePenLineIcon,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import DeletePost from "./DeletePost";
import ShareLink from "./ShareLink";
import { Badge } from "./ui/badge";
import { Card, CardHeader, CardTitle } from "./ui/card";

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

const HeroThreads = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  const isAdmin = user?.app_metadata?.isAdmin || false;

  // Fetch threads
  const { data: threads, error } = await supabase
    .from("topics")
    .select(
      "id, slug, title, tags, content, created_at, views, votes, user_id, updated_on",
      {
        count: "exact",
      }
    )
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching threads:", error);
    return (
      <div className='text-center px-4 py-12'>Failed to load threads.</div>
    );
  }

  if (!threads || threads.length === 0) {
    return <div className='text-center px-4 py-12'>No threads found.</div>;
  }

  // Fetch reply counts for all threads
  const threadsWithReplies = await Promise.all(
    threads.map(async (thread) => {
      const { count: replyCount, error: replyError } = await supabase
        .from("topic_reply")
        .select("id", { count: "exact" })
        .eq("topic_id", thread.id);

      if (replyError) {
        console.error(
          `Error fetching replies for thread ${thread.id}:`,
          replyError
        );
      }

      return {
        ...thread,
        replyCount: replyCount || 0,
      };
    })
  );

  return (
    <section className='w-full bg-gray-50 dark:bg-gray-950'>
      <div className='w-full max-w-2xl mx-auto px-3 py-8'>
        <h2 className='text-3xl sm:text-4xl font-semibold text-center'>
          Latest threads on listings and other technical posts.
        </h2>

        <div className='mt-6'>
          {threadsWithReplies.map((thread) => (
            <div
              key={thread.id}
              className='border rounded-xl overflow-hidden shadow-md mb-4 bg-white dark:bg-gray-800'>
              <div className='flex '>
                <Card className='rounded-none border-none flex-1 flex-grow shadow-none dark:bg-gray-800'>
                  <CardHeader>
                    <div className='flex flex-col leading-4 mb-2 text-sm text-gray-600 dark:text-gray-400'>
                      <span>
                        Published on{" "}
                        {dayjs(thread.created_at).format("MMM DD, YYYY h:mm a")}
                      </span>
                      {thread.updated_on && (
                        <span>
                          Updated on{" "}
                          {dayjs(thread.updated_on).format(
                            "MMM DD, YYYY h:mm a"
                          )}
                        </span>
                      )}
                    </div>
                    <Link href={`/threads/topics/${thread.slug}`}>
                      <CardTitle>
                        <h1 className='line-clamp-2 text-xl text-gray-900 dark:text-gray-100 hover:text-blue-500 hover:underline'>
                          {thread.title}
                        </h1>
                      </CardTitle>
                    </Link>
                    <div className='text-sm pt-2 text-gray-600 dark:text-gray-400 flex flex-wrap gap-1'>
                      {thread.tags.map((tag: string, i: number) => (
                        <Badge
                          key={i}
                          className='bg-blue-100 text-blue-700 dark:bg-blue-500 dark:text-white'>
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>

                <div className='flex flex-col items-center justify-center gap-4 text-sm w-auto max-w-16 mx-auto py-6 px-4 bg-white dark:bg-gray-800'>
                  <div className='flex items-center justify-center gap-x-1 text-gray-700 dark:text-gray-300'>
                    <EyeIcon className='h-4 w-4 text-gray-600 dark:text-gray-400' />
                    <span>{formatNumber(thread.views)}</span>
                  </div>
                  <div className='flex items-center justify-center gap-x-1 text-gray-700 dark:text-gray-300'>
                    <ThumbsUp className='h-4 w-4 text-gray-600 dark:text-gray-400' />
                    <span>{formatNumber(thread.votes)}</span>
                  </div>
                  <div className='flex items-center justify-center gap-x-1 text-gray-700 dark:text-gray-300'>
                    <MessageSquare className='h-4 w-4 text-gray-600 dark:text-gray-400' />
                    <span>{formatNumber(thread.replyCount || 0)}</span>
                  </div>
                </div>
              </div>

              <div className='py-3 px-6 flex items-center justify-between bg-gradient-to-t from-black/70 dark:from-black'>
                <div className='flex items-center gap-4'>
                  <ShareLink
                    title={thread.title}
                    slug={thread.slug}
                    classnames='transition duration-300 hover:scale-105 text-white'
                  />

                  {userId === thread.user_id && (
                    <Link
                      href={`/threads/topics/edit-post/${thread.slug}`}
                      className='flex items-center  transition duration-300 hover:scale-105 text-white hover:text-gray-200'>
                      <FilePenLineIcon className='mr-1 w-5 h-5' />
                      Edit
                    </Link>
                  )}

                  {(userId === thread.user_id || isAdmin) && (
                    <DeletePost
                      id={thread.id}
                      title={thread.title}
                      classnames='text-white rounded-full hover:text-red-500 transition duration-300 hover:scale-105'
                    />
                  )}
                </div>
                {isAdmin && <p className='text-sm text-white italic'>@Admin</p>}
              </div>
            </div>
          ))}
        </div>
        <div className='mt-6 flex justify-center'>
          <Link
            href='/threads/topics'
            className=' rounded-full px-8 py-2 bg-gradient-to-r from-blue-500 to-black text-white'>
            See all threads
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroThreads;
