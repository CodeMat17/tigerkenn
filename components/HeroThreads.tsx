import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import Link from "next/link";
import DeleteThread from "./DeleteThread";
import ShareTopicButton from "./ShareTopicButton";

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
              className='border border-blue-500 dark:border-none rounded-xl overflow-hidden mb-3 bg-white dark:bg-gray-800 shadow-lg'>
              <Link href={`/threads/topics/${thread.slug}`}>
                <div className='p-4'>
                  <div className='mb-1 flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 dark:text-gray-400'>
                    <div className='flex gap-2 items-center'>
                      <p>views {thread.views}</p> |<p>votes {thread.votes}</p>|
                      <p>replies {thread.replyCount}</p>
                    </div>
                    {thread.updated_on ? (
                      <p>
                        <span className=' mr-1'>Updated on</span>
                        {dayjs(thread.updated_on).format("MMM DD, YYYY h:mm a")}
                      </p>
                    ) : (
                      <p>
                        <span className=' mr-1'>Published on</span>
                        {dayjs(thread.created_at).format("MMM DD, YYYY h:mm a")}
                      </p>
                    )}
                  </div>
                  <h3 className='text-xl font-semibold line-clamp-2 leading-6'>
                    {thread.title}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300 italic mt-1'>
                    Tags:{" "}
                    {thread.tags &&
                      thread.tags.map((tag: string, i: number) => (
                        <span key={i} className='mr-2'>
                          #{tag}
                        </span>
                      ))}
                  </p>
                </div>
              </Link>
              <div className='flex items-center px-4 py-2 justify-between bg-gradient-to-r from-blue-500 to-gray-800'>
                <ShareTopicButton
                  topic={thread}
                  classnames='flex items-center gap-1 text-white'
                />
                <div className='flex gap-x-5'>
                  {userId === thread.user_id && (
                    <Link
                      href={`/threads/topics/edit-post/${thread.slug}`}
                      className='text-white'>
                      Edit
                    </Link>
                  )}
                  {(userId === thread.user_id || isAdmin) && (
                    <DeleteThread id={thread.id} title={thread.title} />
                  )}
                </div>
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