import { createClient } from "@/utils/supabase/server";

const WhyChooseUs = async () => {
  const supabase = createClient();

  const { data } = await supabase.from("choose").select("*");

  if (data === null) {
    return <div className='text-center py-32'>No services found yet.</div>;
  }

  return (
    <div className='py-12 animate-fade-in max-w-3xl mx-auto'>
      {data &&
        data.map((service) => (
          <div key={service.id}>
            <h2 className='text-2xl font-semibold mb-4'>{service.title}</h2>
            {/* Display the content using dangerouslySetInnerHTML since ReactQuill outputs HTML */}
            <div
              className='text-[17px] leading-relaxed  [&_p]:-my-2'
              dangerouslySetInnerHTML={{ __html: service.desc }}
            />
          </div>
        ))}
    </div>
  );
};

export default WhyChooseUs;
