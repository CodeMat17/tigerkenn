// import EditListingPage from '@/components/admin/EditListingPage'
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

const Listings = async () => {
  const supabase = createClient();

  const { data } = await supabase.from("listings").select("*").order('created_at', { ascending: false });

  return (
    <div className='px-2 py-12 w-full min-h-screen'>
      <h1 className='text-3xl mb-3 font-semibold text-center'>
        Update Listings
      </h1>
      <div className="flex justify-center mb-8">
        <Button asChild>
          <Link href='/admin/listings/add-new-listing'>Add New Listing</Link>
          </Button>
      </div>

      <div className='flex flex-wrap justify-center gap-4'>
        {data &&
          data.map((list) => (
            <Link key={list.id} href={`/admin/listings/${list.id}`}>
              <div className='max-w-[300px] border  rounded-xl overflow-hidden shadow-md '>
                <Image
                  alt={list.id}
                  priority
                  width={320}
                  height={150}
                  src={list.img}
                  className='w-[320px] aspect-video object-cover'
                />
                <div className='px-4 pb-4 pt-2 space-y-2'>
                  <h2 className='leading-5 font-medium truncate'>
                    {list.title}
                  </h2>
                  <div
                    className='text-[17px] leading-relaxed  [&_p]:-my-1 line-clamp-2 text-sm dark:text-gray-400'
                    dangerouslySetInnerHTML={{ __html: list.desc }}
                  />
                  <div className='text-xs flex items-center justify-between'>
                    <p>{list.beds} Beds</p>
                    <p>{list.baths} Baths</p>
                    <p>{list.sqm} Sqm</p>
                    <p className='px-1.5 py-1 rounded-xl bg-sky-700 text-sky-300'>
                      {list.location}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Listings;
