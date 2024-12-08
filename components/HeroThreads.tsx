"use client";

import { createClient } from "@/utils/supabase/clients";
import dayjs from "dayjs";
import {
  EyeIcon,
  FilePenLineIcon,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DeletePost from "./DeletePost";
import ShareLink from "./ShareLink";
import { Badge } from "./ui/badge";
import { Card, CardHeader, CardTitle } from "./ui/card";

type Topic = {
  id: number;
  slug: string;
  title: string;
  tags: string[];
  content: string;
  created_at: string;
  views: number;
  votes: number;
  user_id: string;
  updated_on: string;
  replyCount?: number;
};

type Props = {
  userId: string | null;
  isAdmin: boolean;
};

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

const HeroThreads = ({ userId, isAdmin }: Props) => {
  const supabase = createClient();
  const [threadsWithReplies, setThreadsWithReplies] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopicsWithReplies = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: threads, error: fetchError } = await supabase
        .from("topics")
        .select(
          "id, slug, title, tags, content, created_at, views, votes, user_id, updated_on",
          {
            count: "exact",
          }
        )
        .order("created_at", { ascending: false })
        .limit(5);

      if (fetchError) {
        throw fetchError;
      }

      if (!threads || threads.length === 0) {
        setThreadsWithReplies([]);
        return;
      }

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

      setThreadsWithReplies(threadsWithReplies);
    } catch (err) {
      console.error("Error fetching threads:", err);
      setError("Failed to load threads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicsWithReplies();
  }, []);

  if (error) {
    return <div className='text-center px-4 py-12'>{error}</div>;
  }

  if (!threadsWithReplies || threadsWithReplies.length === 0) {
    return <div className='text-center px-4 py-12'>No threads found.</div>;
  }

  return (
    <section className='w-full bg-gray-50 dark:bg-gray-950'>
      <div className='w-full max-w-2xl mx-auto px-3 py-8'>
        <h2 className='text-3xl sm:text-4xl font-semibold text-center'>
          Latest threads on listings and other technical posts.
        </h2>

        <div className='mt-6'>
          {loading ? (
            <SlugDetailSkeleton />
          ) : (
            threadsWithReplies.map((thread) => (
              <div
                key={thread.id}
                className='border rounded-xl overflow-hidden shadow-md mb-4 bg-white dark:bg-gray-800'>
                <div className='flex'>
                  <Card className='rounded-none border-none flex-1 flex-grow shadow-none dark:bg-gray-800'>
                    <CardHeader>
                      <div className='flex flex-col leading-4 mb-2 text-sm text-gray-600 dark:text-gray-400'>
                        <span>
                          Published on{" "}
                          {dayjs(thread.created_at).format(
                            "MMM DD, YYYY h:mm a"
                          )}
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

                  <div className='flex flex-col items-start justify-start gap-2 text-sm w-16 py-6 mr-1 bg-white dark:bg-gray-800'>
                    <div className='flex items-center justify-center gap-x-1 text-green-600 dark:text-gray-300'>
                      <div className=' bg-gray-100 dark:bg-gray-700 p-2 rounded-full'>
                        <EyeIcon className='h-4 w-4 text-green-600 dark:text-gray-400' />
                      </div>
                      <span>{formatNumber(thread.views)}</span>
                    </div>
                    <div className='flex items-center justify-center gap-x-1 text-green-600 dark:text-gray-300'>
                      <div className=' bg-gray-100 dark:bg-gray-700 p-2 rounded-full'>
                        <ThumbsUp className='h-4 w-4 text-green-600 dark:text-gray-400' />
                      </div>

                      <span>{formatNumber(thread.votes)}</span>
                    </div>
                    <div className='flex items-center justify-center gap-x-1 text-green-600 dark:text-gray-300'>
                      <div className=' bg-gray-100 dark:bg-gray-700 p-2 rounded-full'>
                        <MessageSquare className='h-4 w-4 text-green-600 dark:text-gray-400' />
                      </div>
                      <span>{formatNumber(thread.replyCount || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className='py-3 px-6 flex items-center justify-between bg-gradient-to-t from-blue-950 via-blue-900 dark:from-black'>
                  <div className='flex items-center gap-4'>
                    <ShareLink
                      title={thread.title}
                      slug={thread.slug}
                      classnames='text-sm transition duration-300 hover:scale-105 text-white'
                    />

                    {userId === thread.user_id && (
                      <Link
                        href={`/threads/topics/edit-post/${thread.slug}`}
                        className='flex items-center  transition duration-300 hover:scale-105 text-white hover:text-gray-200 text-sm'>
                        <FilePenLineIcon className='mr-1 w-4 h-4' />
                        Edit
                      </Link>
                    )}

                    {(userId === thread.user_id || isAdmin) && (
                      <DeletePost
                        id={thread.id}
                        title={thread.title}
                        reload={fetchTopicsWithReplies}
                        classnames='text-white rounded-full hover:text-red-500 transition duration-300 hover:scale-105 text-sm'
                      />
                    )}
                  </div>
                  {isAdmin && (
                    <p className='text-sm text-white italic'>@Admin</p>
                  )}
                </div>
              </div>
            ))
          )}
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

const SlugDetailSkeleton = () => {
  return (
    <div className='px-4 py-8 max-w-4xl mx-auto'>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className='animate-pulse mb-8'>
          {/* Header Skeleton */}
          <div className='flex items-center justify-between mb-4'>
            <div>
              <div className='flex gap-2 text-sm text-gray-300'>
                <div className='h-4 w-16 bg-gray-300 rounded'></div>{" "}
                {/* Views */}
                <div className='h-4 w-16 bg-gray-300 rounded'></div>{" "}
                {/* Votes */}
                <div className='h-4 w-16 bg-gray-300 rounded'></div>{" "}
                {/* Replies */}
              </div>
              <div className='mt-2 h-4 w-32 bg-gray-300 rounded'></div>{" "}
              {/* Date */}
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-8 w-8 bg-gray-300 rounded-full'></div>{" "}
              {/* Vote Button */}
              <div className='h-8 w-8 bg-gray-300 rounded-full'></div>{" "}
              {/* Share Button */}
            </div>
          </div>

          {/* Title Skeleton */}
          <div className='h-6 w-3/4 bg-gray-300 rounded mb-2'></div>

          {/* Tags Skeleton */}
          <div className='flex gap-2 mb-4'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='h-4 w-16 bg-gray-300 rounded'></div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className='space-y-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='h-4 w-full bg-gray-300 rounded'></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroThreads;
