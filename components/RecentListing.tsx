import { createClient } from "@/utils/supabase/server";
import { BathIcon, BedIcon, RulerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ShimmerButton from "./ui/shimmer-button";

const RecentListing = async () => {
  const supabase = createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .limit(3)
    .order("created_at", { ascending: false });

  return (
    <div className='w-full bg-gray-50 dark:bg-gray-950'>
      <div className='w-full max-w-6xl mx-auto px-4 py-12 '>
        <h1 className='text-3xl sm:text-4xl  font-semibold'>Latest Listings</h1>
        <div className='mt-5 '>
          {listings && listings.length < 1 ? (
            <div className='w-full text-center py-32'>
              No listing at the moment
            </div>
          ) : (
            <div className='flex flex-wrap justify-center gap-4 sm:gap-6'>
              {listings &&
                listings.map((list, i) => (
                  <div
                    key={i}
                    className='rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl group w-full max-w-[330px] sm:max-w-[300px] '>
                    <Link href={`/listings/${list.id}`}>
                      <div className='transition transform duration-300 ease-in-out hover:scale-105'>
                        <div className='relative'>
                          <Image
                            alt={list.title}
                            priority
                            width={320}
                            height={200}
                            src={list.img}
                            className='w-full h-[180px] aspect-video object-cover'
                          />
                          <p className='absolute bottom-2 left-2 px-2 py-.5 rounded-full overflow-hidden bg-black/20 font-semibold text-white'>
                            ₦{list.price.toLocaleString()}
                          </p>

                          <div className='absolute bottom-2 right-2 flex justify-start  mt-2'>
                            <p className='px-2 py-0 w-auto text-blue-800 rounded-full shadow-md bg-blue-200/70'>
                              {list.location}
                            </p>
                          </div>

                          {list.available ? (
                            <p
                              className='absolute top-2 right-2 bg-green-600/60 px-2 py-0.5
              rounded-full text-green-100'>
                              Available
                            </p>
                          ) : (
                            <p
                              className='absolute top-2 right-2 bg-red-600/60 px-2 py-0.5
              rounded-full text-red-100'>
                              Available
                            </p>
                          )}
                        </div>

                        <div className='px-4 pb-4 pt-3 '>
                          <h2 className='text-lg font-medium leading-tight truncate'>
                            {list.title}
                          </h2>

                          <div className='mt-2 flex items-center justify-between gap-2.5'>
                            {list.beds && (
                              <div className='flex items-center gap-1'>
                                <BedIcon className='w-4 h-4 text-blue-500' />
                                <p className='text-sm'>{list.beds} Beds</p>
                              </div>
                            )}

                            {list.baths && (
                              <div className='flex items-center gap-1'>
                                <BathIcon className='w-4 h-4 text-blue-500' />
                                <p className='text-sm'>{list.baths} Baths</p>
                              </div>
                            )}

                            {list.sqm && (
                              <div className='flex items-center gap-1'>
                                <RulerIcon className='w-4 h-4 text-blue-500' />
                                <p className='text-sm'>{list.sqm} Sqm</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className='flex justify-center mt-6'>
          <Link href='/listings'>
            <ShimmerButton className='shadow-2xl'>
              <span className='whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg'>
                See Full Listings
              </span>
            </ShimmerButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentListing;
