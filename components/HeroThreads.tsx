"use client";

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
import { useState } from "react";

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
  threadsWithReplies: Topic[];
  userId: string | null;
  isAdmin: boolean;
};

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

const HeroThreads = ({ threadsWithReplies, userId, isAdmin }: Props) => {
  
  const [threads, setThreads] = useState(threadsWithReplies)

  return (
    <section className='w-full bg-gray-50 dark:bg-gray-950'>
      <div className='w-full max-w-2xl mx-auto px-3 py-8'>
        <h2 className='text-3xl sm:text-4xl font-semibold text-center'>
          Latest threads on listings and other technical posts.
        </h2>

        {!threads || threads.length === 0 ? (
          <div className='text-center px-4 py-12'>No threads found.</div>
        ) : (
          <div className='mt-6'>
            {threads.map((thread) => (
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

                  <div className='flex flex-col items-start justify-start gap-4 text-sm w-16 py-6 mr-1 bg-white dark:bg-gray-800'>
                    <div className='flex items-center justify-center gap-x-1  dark:text-gray-300'>
                      <div className=' bg-blue-500 p-2 rounded-full'>
                        <EyeIcon className='h-4 w-4 text-white' />
                      </div>
                      <span className='text-blue-500'>
                        {formatNumber(thread.views)}
                      </span>
                    </div>
                    <div className='flex items-center justify-center gap-x-1 dark:text-gray-300'>
                      <div className='bg-blue-500 p-2 rounded-full'>
                        <ThumbsUp className='h-4 w-4 text-white' />
                      </div>

                      <span className='text-blue-500'>
                        {formatNumber(thread.votes)}
                      </span>
                    </div>
                    <div className='flex items-center justify-center gap-x-1 text-green-600 dark:text-gray-300'>
                      <div className=' bg-blue-500 p-2 rounded-full'>
                        <MessageSquare className='h-4 w-4 text-white' />
                      </div>
                      <span className='text-blue-500'>
                        {formatNumber(thread.replyCount || 0)}
                      </span>
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
                        thread={thread}
                        reload={() => setThreads((prevThreads) => prevThreads.filter((t) => t.id !== thread.id))}
                        classnames='text-white rounded-full hover:text-red-500 transition duration-300 hover:scale-105 text-sm'
                      />
                    )}
                  </div>
                  {isAdmin && (
                    <p className='text-sm text-white italic'>@Admin</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

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
