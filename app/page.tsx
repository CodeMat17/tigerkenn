import HeroPage from "@/components/HeroPage";
import LastestBlog from "@/components/LatestBlog";
import RecentListing from "@/components/RecentListing";
import ReviewCarousel from "@/components/ReviewCarousel";
import { createClient } from "@/utils/supabase/server";

const Home = async () => {
  const supabase = createClient();

  const { data: hero } = await supabase.from("hero").select("*").single();

  return (
    <div className='w-full min-h-screen '>
      <HeroPage title={hero.title} desc={hero.desc} content={hero.content} />
      <RecentListing />
      <ReviewCarousel />
      <LastestBlog />
    </div>
  );
};

export default Home;
