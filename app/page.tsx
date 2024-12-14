import { FeaturedProperties } from "@/components/FeaturedProperties";
import HeroPage from "@/components/HeroPage";
import HeroThreads from "@/components/HeroThreads";
import NewsletterSignup from "@/components/NewsletterSignup";
import ReviewCarousel from "@/components/ReviewCarousel";
import { createClient } from "@/utils/supabase/server";
export const dynamic = "force-dynamic"; // Enable dynamic rendering

export const revalidate = 0

const fetchTopicsWithReplies = async () => {
  const supabase = createClient();

  // Fetch threads
  const { data: threads, error: threadsError } = await supabase
    .from("topics")
    .select(
      "id, slug, title, tags, content, created_at, views, votes, user_id, updated_on",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .limit(5);

  if (threadsError) {
    throw new Error(`Error fetching threads: ${threadsError.message}`);
  }

  if (!threads) {
    return [];
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
  return threadsWithReplies;
};

const Home = async () => {
  const threadsWithReplies = await fetchTopicsWithReplies();


  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  const isAdmin = user?.app_metadata?.isAdmin || false;

  // Fetch data for the Hero Slide
  const { data: hero, error: heroError } = await supabase
    .from("hero")
    .select("title, desc, content")
    .single();

  if (heroError) {
    console.error("Error fetching hero:", heroError);
    // Handle error display or fallback
  }

  // Fetch data for the Hero Thread

  const { data: completed } = await supabase
    .from("completed")
    .select("id, desc, imgUrl");

  return (
    <div className='w-full min-h-screen '>
      <HeroPage title={hero?.title} desc={hero?.desc} content={hero?.content} />
      <FeaturedProperties projects={completed ?? []} />
      <HeroThreads threadsWithReplies={threadsWithReplies} userId={userId ?? null} isAdmin={isAdmin} />
      <ReviewCarousel />
      <NewsletterSignup />
    </div>
  );
};

export default Home;
