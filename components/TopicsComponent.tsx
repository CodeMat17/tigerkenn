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
import { createClient } from "@/utils/supabase/clients";
import dayjs from "dayjs";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  FilePenLineIcon,
  MessageSquare,
  MinusIcon,
  Search,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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

type Topic = {
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

const TopicsComponent = () => {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [sortedTopics, setSortedTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<
    "votes" | "views" | "created_at"
  >("created_at");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");

  const [count, setCount] = useState(0);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const perPage = 10;
  
    const fetchTopicsWithReplies = async () => {
      setLoading(true);

      const from = page * perPage;
      const to = from + perPage - 1;

      const {
        data: topicsData,
        count,
        error: topicsError,
      } = await supabase
        .from("topics")
        .select(
          "id, slug, user_id, title, tags, content, created_at, views, votes, updated_on",
          {
            count: "exact",
          }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (topicsError) {
        console.error("Error fetching topics:", topicsError);
        setLoading(false);
        return;
      }

      // Fetch reply counts for each topic
      const topicsWithReplies = await Promise.all(
        (topicsData || []).map(async (topic: Topic) => {
          const { count: replyCount, error: replyCountError } = await supabase
            .from("topic_reply")
            .select("id", { count: "exact" })
            .eq("topic_id", topic.id);

          if (replyCountError) {
            console.error(
              `Error fetching replies for topic ${topic.id}:`,
              replyCountError
            );
            return { ...topic, replyCount: 0 };
          }

          return { ...topic, replyCount: replyCount || 0 };
        })
      );

      const uniqueTags = Array.from(
        new Set(topicsData.flatMap((topic: Topic) => topic.tags || []))
      );

      setCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / perPage));
      setTopics(topicsWithReplies);
      setSortedTopics(topicsWithReplies);
      setTags(uniqueTags);
      setLoading(false);
    };// Number of topics per page

  useEffect(() => {
    const fetchUserId = async () => {
      const response = await fetch("/api/get-user");
      const data = await response.json();
      setUserId(data.userId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchIsAdmin = async () => {
      const response = await fetch("/api/isAdmin");
      const data = await response.json();
      setIsAdmin(data.isAdmin);
    };
    fetchIsAdmin();
  }, []);

  useEffect(() => {
  

    fetchTopicsWithReplies();
  }, [page, supabase]); // Re-fetch topics when page changes

  useEffect(() => {
    let filteredTopics = [...topics];

    if (searchQuery) {
      filteredTopics = filteredTopics.filter((topic) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag && selectedTag !== "all") {
      filteredTopics = filteredTopics.filter((topic) =>
        topic.tags?.includes(selectedTag)
      );
    }

    switch (sortOption) {
      case "votes":
        filteredTopics.sort((a, b) => b.votes - a.votes);
        break;
      case "views":
        filteredTopics.sort((a, b) => b.views - a.views);
        break;
      case "created_at":
        filteredTopics.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    setSortedTopics(filteredTopics);
  }, [searchQuery, sortOption, selectedTag, topics]);

  const reset = () => {
    setSearchQuery("");
    setSelectedTag("");
    setSortOption("created_at");
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-72'>
        <MinusIcon className='animate-spin mr-3' /> loading...
      </div>
    );
  }

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
              <Link href={`/threads/new-topic`}>Send post</Link>
            </Button>
          </div>

          <MobileViewGuidelines />

          <div className='flex items-center gap-3'>
            <div className='relative w-full flex items-center justify-center'>
              <Input
                type='text'
                placeholder='Search by title...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-8 border-gray-400 dark:border-gray-700'
              />
              <Search className='absolute left-2 top-2 size-5' />
            </div>
            <Button
              onClick={reset}
              variant='outline'
              className='border-gray-400 dark:border-gray-700'>
              Reset
            </Button>
          </div>

          <div className='my-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
            <div>
              <p className='text-xl font-medium text-blue-600 dark:text-blue-500'>
                Total Posts: {count}
              </p>
              <p className='text-gray-500'>
                Rendered posts: {sortedTopics.length}
              </p>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                Sorted by:
                <Select
                  value={sortOption}
                  onValueChange={(value: "votes" | "views" | "created_at") =>
                    setSortOption(value)
                  }>
                  <SelectTrigger className='w-[180px] border-gray-400 dark:border-gray-700'>
                    <SelectValue placeholder='Sort by: ' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='created_at'>Latest posts</SelectItem>
                    <SelectItem value='votes'>Highest votes</SelectItem>
                    <SelectItem value='views'>Highest views</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                Tags:
                <Select
                  value={selectedTag}
                  onValueChange={(value: string) => setSelectedTag(value)}>
                  <SelectTrigger className='w-full md:w-auto border rounded border-gray-400 dark:border-gray-700'>
                    <SelectValue placeholder='All Tags' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Tags</SelectItem>
                    {tags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {sortedTopics && sortedTopics.length < 1 ? (
            <div className='text-center py-8 px-4 text-red-500'>
              No post rendered at the moment.
            </div>
          ) : (
            sortedTopics.map((topic) => (
              <div
                key={topic.id}
                className='border rounded-xl overflow-hidden shadow-md mb-4 bg-white dark:bg-gray-800'>
                <div className='flex '>
                  <Card className='rounded-none border-none flex-1 flex-grow shadow-none dark:bg-gray-800'>
                    <CardHeader>
                      <div className='flex flex-col leading-4 mb-2 text-sm text-gray-600 dark:text-gray-400'>
                        <span>
                          Published on{" "}
                          {dayjs(topic.created_at).format(
                            "MMM DD, YYYY h:mm a"
                          )}
                        </span>
                        {topic.updated_on && (
                          <span>
                            Updated on{" "}
                            {dayjs(topic.updated_on).format(
                              "MMM DD, YYYY h:mm a"
                            )}
                          </span>
                        )}
                      </div>
                      <Link href={`/threads/topics/${topic.slug}`}>
                        <CardTitle>
                          <h1 className='line-clamp-2 text-xl text-gray-900 dark:text-gray-100 hover:text-blue-500 hover:underline'>
                            {topic.title}
                          </h1>
                        </CardTitle>
                      </Link>
                      <div className='text-sm pt-2 text-gray-600 dark:text-gray-400 flex flex-wrap gap-1'>
                        {topic.tags.map((tag: string, i: number) => (
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
                      <span>{formatNumber(topic.views)}</span>
                    </div>
                    <div className='flex items-center justify-center gap-x-1 text-gray-700 dark:text-gray-300'>
                      <ThumbsUp className='h-4 w-4 text-gray-600 dark:text-gray-400' />
                      <span>{formatNumber(topic.votes)}</span>
                    </div>
                    <div className='flex items-center justify-center gap-x-1 text-gray-700 dark:text-gray-300'>
                      <MessageSquare className='h-4 w-4 text-gray-600 dark:text-gray-400' />
                      <span>{formatNumber(topic.replyCount || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className='py-3 px-6 flex items-center justify-between bg-gradient-to-t from-blue-950 dark:from-black'>
                  <div className='flex items-center gap-4'>
                    <ShareLink
                      title={topic.title}
                      slug={topic.slug}
                      classnames='transition duration-300 hover:scale-105 text-white text-sm'
                    />

                    {userId === topic.user_id && (
                      <Link
                        href={`/threads/topics/edit-post/${topic.slug}`}
                        className='flex items-center  transition duration-300 hover:scale-105 text-white hover:text-gray-200 text-sm'>
                        <FilePenLineIcon className='mr-1 w-4 h-4' />
                        Edit
                      </Link>
                    )}

                    {(userId === topic.user_id || isAdmin) && (
                      <DeletePost
                        id={topic.id}
                        title={topic.title}
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

          <div className='my-7'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    aria-label='prev button'
                    variant='ghost'
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}>
                    <ChevronLeftIcon className='mr-2' /> Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <span className='text-sm'>
                    Page {page + 1} of {totalPages}
                  </span>
                </PaginationItem>

                <PaginationItem>
                  <Button
                    aria-label='next button'
                    variant='ghost'
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages - 1))
                    }
                    disabled={page >= totalPages - 1}>
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
