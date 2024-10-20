import { createClient } from "@/utils/supabase/server";
import EditHeroPage from "@/components/admin/EditHeroPage";

export const revalidate = 0;

const Admin = async () => {
  const supabase = createClient();

  const { data: hero } = await supabase.from("hero").select("*").single();

  return (
    <div className='px-4 py-12 w-full min-h-screen max-w-4xl mx-auto '>
      <h1 className='text-xl font-semibold text-center'>Edit Home Page</h1>

      <h2 className='text-3xl text-center font-medium mb-6'>Home Page Carousel</h2>

      <EditHeroPage
        id={hero.id}
        heroTitle={hero.title}
        heroDesc={hero.desc}
        heroContent={hero.content}
      />
    </div>
  );
};

export default Admin;
