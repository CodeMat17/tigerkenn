"use client";

import ShareTopicButton from "@/components/ShareTopicButton";
import TopicReplyComponent from "@/components/TopicReplyComponent";
import VoteButton from "@/components/VoteButton";
import { createClient } from "@/utils/supabase/clients";
import { User } from "@supabase/supabase-js";
import dayjs from "dayjs";
import { FilePenLineIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteSinglePost from "./DeleteSinglePost";

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
  updated_on?: string;
  replyCount?: number;
};

const SlugDetail = ({ slug, user }: { slug: string; user: User | null }) => {
  const supabase = createClient();
  const userId = user?.id;
  const isAdmin = user?.app_metadata?.isAdmin;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [replyCount, setReplyCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch topic and reply count
  const fetchTopic = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: topicData, error: topicError } = await supabase
        .from("topics")
        .select("*")
        .eq("slug", slug)
        .single();

      if (topicError || !topicData) {
        throw new Error("Topic not found.");
      }

      setTopic(topicData);

      // Fetch reply count
      const { count: replyCount, error: replyError } = await supabase
        .from("topic_reply")
        .select("*", { count: "exact" })
        .eq("topic_id", topicData.id);

      if (replyError) {
        throw new Error("Failed to fetch reply count.");
      }

      setReplyCount(replyCount || 0);

      // Increment view count
      const baseUrl = process.env.NEXT_PUBLIC_HOME || "http://localhost:3000";
      await fetch(`${baseUrl}/api/view-count`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId: topicData.id, slug }),
      });
    } catch (err) {
      setError("Failed to load the topic.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopic();
  }, [slug]);

  if (loading) {
    return <div className='text-center px-4 py-12'>Loading...</div>;
  }

  if (error) {
    return <div className='text-center px-4 py-12'>{error}</div>;
  }

  if (!topic) {
    notFound();
  }

  return (
    <div className='px-4 py-8 max-w-4xl mx-auto'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <div className='flex gap-2 text-sm text-gray-500 dark:text-gray-400'>
            <p>Views: {topic.views}</p> | <p>Votes: {topic.votes}</p> |{" "}
            <p>Replies: {replyCount}</p>
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
      <p className='text-sm text-gray-600 dark:text-gray-300 italic mt-1'>
        Tags:{" "}
        {topic.tags &&
          topic.tags.map((tag: string, i: number) => (
            <span key={i} className='mr-2'>
              #{tag}
            </span>
          ))}
      </p>

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
