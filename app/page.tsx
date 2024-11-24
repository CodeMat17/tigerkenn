import CompletedProjects from "@/components/CompletedProjects";
import HeroPage from "@/components/HeroPage";
import HeroThreads from "@/components/HeroThreads";
import NewsletterSignup from "@/components/NewsletterSignup";
import ReviewCarousel from "@/components/ReviewCarousel";
import { createClient } from "@/utils/supabase/server";

const Home = async () => {
  const supabase = createClient();

  const { data: hero } = await supabase.from("hero").select("*").single();

  const { data: completed } = await supabase.from("completed").select("*");

  return (
    <div className='w-full min-h-screen '>
      <HeroPage title={hero.title} desc={hero.desc} content={hero.content} />
      <CompletedProjects projects={completed ?? []} />
      <HeroThreads />
      {/* <RecentListing /> */}
      {/* <RecentBuildingListing /> */}
      <ReviewCarousel />
      {/* <LastestBlog /> */}
      <NewsletterSignup />
    </div>
  );
};

export default Home;
