import TopicsComponent from "@/components/TopicsComponent";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Threads: Listings & Discussions",
  description: "Explore technical discussions and property threads.",
};

const fetchTopicsWithReplies = async (page: number, pageSize: number) => {
  const supabase = createClient();

  // Fetch total count and data
  const {
    data: threads,
    error,
    count,
  } = await supabase
    .from("topics")
    .select(
      "id, slug, title, tags, content, created_at, views, votes, user_id, updated_on",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1); // Ensure pagination works

  if (error) {
    throw new Error(`Error fetching threads: ${error.message}`);
  }

  if (!threads) {
    return { threads: [], count: 0 };
  }

  // Fetch replies count for each thread
  const threadsWithReplies = await Promise.all(
    threads.map(async (thread) => {
      const { count: replyCount, error: repliesError } = await supabase
        .from("topic_reply")
        .select("id", { count: "exact" })
        .eq("topic_id", thread.id);

      if (repliesError) {
        console.error(
          `Error fetching replies for thread ${thread.id}:`,
          repliesError
        );
      }

      return {
        ...thread,
        replyCount: replyCount || 0,
      };
    })
  );



  return { threads: threadsWithReplies, count };
};

const TopicsPage = async ({
  searchParams,
}: {
  searchParams: { page?: string; };
}) => {
  const page = parseInt(searchParams.page || "0", 10);
  const pageSize = 10; // Adjust page size as needed

  const { threads, count } = await fetchTopicsWithReplies(page, pageSize);

  // Extract unique tags from threads
  const uniqueTags = Array.from(
    new Set(threads.flatMap((thread) => thread.tags))
  );

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  const isAdmin = user?.app_metadata?.isAdmin || false;

  return (
    <TopicsComponent
      threads={threads}
      totalCount={count || 0}
      renderedCount={threads.length}
      currentPage={page}
      pageSize={pageSize}
      userId={userId || ""}
      isAdmin={isAdmin}
      tags={uniqueTags} // Add the tags property here
    />
  );
};

export default TopicsPage;
