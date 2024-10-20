import { createClient } from "@/utils/supabase/server";

const OurMission = async () => {
  const supabase = createClient();

  const { data } = await supabase.from("mission").select("*").single();

  return (
    <div className='animate-fade-in max-w-3xl mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>{data.title}</h2>
      <p className='text-lg'>{data.desc}</p>
    </div>
  );
};

export default OurMission;
