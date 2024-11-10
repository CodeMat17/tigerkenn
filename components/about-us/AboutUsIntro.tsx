import { createClient } from "@/utils/supabase/server";
import StatsSection from "../StatsSection";

const AboutUsIntro = async () => {
  const supabase = createClient();

  const { data } = await supabase.from("intro").select("*").single();

  return (
    <div>
      <h2 className='text-2xl font-semibold mb-4'>{data.title}</h2>
      <p className='text-lg'>{data.desc}</p>
      <StatsSection />
    </div>
  );
};

export default AboutUsIntro;
