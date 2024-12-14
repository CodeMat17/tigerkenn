"use client";

import MobileViewGuidelines from "@/components/MobileViewGuidelines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  FilePenLineIcon,
  MessageSquare,
  Search,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

type Thread = {
  id: number;
  slug: string;
  title: string;
  user_id: string;
  tags: string[];
  content: string;
  created_at: string;
  updated_on: string;
  views: number;
  votes: number;
  replyCount?: number; // Add replyCount to store the number of replies for each topic
};

type TopicsComponentProps = {
  threads: Thread[];
  // page: number;
  // totalThreads: number;
  currentPage: number;
  pageSize: number;
  userId: string;
  isAdmin: boolean;
  // searchQuery: string;
  // selectedTag: string;
  // sortOption: string;
  renderedCount: number;
  tags: string[];
  totalCount: number;
};

const TopicsComponent = ({
  threads: initialThreads,
  totalCount,
  // renderedCount,
  currentPage,
  pageSize,
  tags,
  userId,
  isAdmin,
}: TopicsComponentProps) => {
  // const [threads, setThreads] = useState(initialThreads);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<
    "created_at" | "votes" | "views"
  >("created_at");
  const [selectedTag, setSelectedTag] = useState("all");
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>(initialThreads);

  // Function to reset filters
  const resetFilters = () => {
    setFilteredThreads(initialThreads); // Reset threads
    setSearchQuery(""); // Clear search query
    setSelectedTag("all"); // Reset selected tag
    setSortOption("created_at"); // Reset sorting option
  };

  // Apply filtering and sorting logic
  // Filtering and sorting logic
  useEffect(() => {
    let filteredThreads = initialThreads;

    // Filter by tag
    if (selectedTag !== "all") {
      filteredThreads = filteredThreads.filter((thread) =>
        thread.tags.includes(selectedTag)
      );
    }

    // Sort by selected option
    if (sortOption) {
      filteredThreads = filteredThreads.sort((a, b) => {
        return (b[sortOption] as number) - (a[sortOption] as number);
      });
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filteredThreads = filteredThreads.filter((thread) =>
        thread.title.toLowerCase().includes(lowerCaseQuery)
      );
    }

   
  setFilteredThreads(filteredThreads);
  }, [selectedTag, searchQuery, sortOption, initialThreads]);

  // Memoized total pages calculation
  const totalPages = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

  return (
    <div className='bg-gray-50 dark:bg-gray-950'>
      <div className='max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8'>
        <div className='flex-1'>
          <div className='flex items-cent justify-between mb-4 gap-4'>
            <div>
              <h2 className='text-2xl font-medium'>Forum Posts</h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Listings and public conversations on technical topics.
              </p>
            </div>

            <Button
              asChild
              className='bg-blue-600 text-white hover:bg-blue-800 mt-1'>
              <Link href={`/threads/new-topic`}>New Post</Link>
            </Button>
          </div>

          <MobileViewGuidelines />

          <div className='flex items-center gap-3'>
            <div className='relative w-full flex items-center justify-center'>
              <Input
                type='text'
                placeholder='Search threads by title...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-8 border-gray-400 dark:border-gray-700'
              />
              <Search className='absolute left-2 top-2 size-5' />
            </div>

            <Button
              onClick={resetFilters}
              // onClick={() => setSearchQuery("")}
              variant='outline'
              className='border-gray-400 dark:border-gray-700'>
              Reset
            </Button>
          </div>

          <div className='my-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
            <div>
              <p className='text-xl font-medium text-blue-600 dark:text-blue-500'>
                Total Posts: {totalCount}
              </p>
              <p className='text-gray-500'>
                Rendered posts: {filteredThreads.length}
              </p>
            </div>

            {/* Sorting Options */}
            <div className='flex items-center gap-4 sm:w-[60%]'>
              <div className='flex flex-col gap-0.5 w-full'>
                Sorted by:
                <Select
                  value={sortOption}
                  onValueChange={(value: "created_at" | "votes" | "views") =>
                    setSortOption(value)
                  }>
                  <SelectTrigger className='w-full border-gray-400 dark:border-gray-700'>
                    <SelectValue placeholder='Sort by: ' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='created_at'>Latest Post</SelectItem>
                    <SelectItem value='votes'>Highest votes</SelectItem>
                    <SelectItem value='views'>Highest views</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col w-full gap-0.5'>
                Tags:
                <Select
                  value={selectedTag}
                  onValueChange={(value) => setSelectedTag(value)}>
                  <SelectTrigger className='w-full md:w-auto border rounded border-gray-400 dark:border-gray-700'>
                    <SelectValue placeholder='Filter by tag' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Tags</SelectItem>

                    {tags.map((tag: string) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredThreads && filteredThreads.length === 0 ? (
            <div className='text-center py-8 px-4 text-red-500'>
              No post rendered at the moment.
            </div>
          ) : (
            filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className='border rounded-xl overflow-hidden shadow-md mb-4 bg-white dark:bg-gray-800'>
                <div className='flex '>
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

                <div className='py-3 px-6 flex items-center justify-between bg-gradient-to-t from-blue-950 dark:from-black'>
                  <div className='flex items-center gap-4'>
                    <ShareLink
                      title={thread.title}
                      slug={thread.slug}
                      classnames='transition duration-300 hover:scale-105 text-white text-sm'
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
                        reload={() => setFilteredThreads((prevThreads) => prevThreads.filter((t) => t.id !== thread.id))}
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

          <div className='my-7'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    aria-label='prev button'
                    variant='ghost'
                    disabled={currentPage === 0}
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set(
                        "page",
                        (currentPage - 1).toString()
                      );
                      window.location.href = url.toString();
                    }}>
                    <ChevronLeftIcon className='mr-2' /> Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <span className='text-sm'>
                    Page {currentPage + 1} of {totalPages}
                  </span>
                </PaginationItem>

                <PaginationItem>
                  <Button
                    aria-label='next button'
                    variant='ghost'
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set(
                        "page",
                        (currentPage + 1).toString()
                      );
                      window.location.href = url.toString();
                    }}>
                    Next <ChevronRightIcon className='ml-2' />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        <div className='hidden lg:block w-80'>
          <div className='rounded-xl overflow-hidden border'>
            <h1 className='text-lg bg-gray-200 dark:bg-gray-800 p-3'>
              Discussion guidelines.
            </h1>
            <div className='p-3 space-y-3'>
              <div className='pb-3 border-b'>
                <h3 className='font-medium text-lg tracking-wider'>
                  No Self-Promotion
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Posts with overt self-promotion may be removed to keep
                  discussions authentic and valuable to all members.
                </p>
              </div>

              <div className='pb-3 border-b'>
                <h3 className='font-medium text-lg tracking-wider '>
                  Be Patient and Welcoming
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  We all come from different backgrounds and levels of
                  expertise. Be respectful, patient, and encouraging towards
                  others. Constructive feedback and supportive engagement create
                  an inclusive and vibrant community.
                </p>
              </div>

              <div className='pb-3 border-b'>
                <h3 className='font-medium text-lg tracking-wider '>
                  No Job Listings
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  This forum is not a place for job postings, recruitment
                  advertisements, or headhunting. Please reserve job-related
                  discussions for appropriate platforms or dedicated channels.
                </p>
              </div>

              <div className='pb-3 border-b'>
                <h3 className='font-medium text-lg tracking-wider '>
                  Discuss Perspectives, Advice, and Insights
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Share your perspectives and offer thoughtful advice and
                  insights to fellow community members. Focus on discussions
                  that encourage knowledge exchange, problem-solving, and mutual
                  learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsComponent;
