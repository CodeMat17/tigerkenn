import { createClient } from "@/utils/supabase/server";
import {
  BathIcon,
  BedIcon,
  RatioIcon,
} from "lucide-react";
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
                    className='rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl group w-full max-w-[320px] sm:max-w-[290px] '>
                    {list.available ? (
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
                            <p
                              className='absolute bottom-2 right-2 bg-black/20 px-2 py-0.5
              rounded-full font-medium text-white'>
                              {list.status}
                            </p>
                            {list.available ? (
                              <p
                                className='absolute top-2 right-2 bg-green-500/60 px-2 py-0.5
              rounded-full font-medium border border-green-500 text-green-200'>
                                Available
                              </p>
                            ) : (
                              <p
                                className='absolute top-2 right-2 bg-red-500/60 px-2 py-0.5
              rounded-full font-medium border border-red-500 text-green-200'>
                                Available
                              </p>
                            )}
                          </div>

                          <div className='px-4 pb-4 pt-3 '>
                            <h2 className='font-medium leading-tight line-clamp-2'>
                              {list.title}
                            </h2>
                            <div className='flex justify-start  mt-1.5'>
                              <p className='text-sm font-light px-2 py-0 w-auto text-amber-500 border rounded-full border-amber-500'>
                                {list.location}
                              </p>
                            </div>

                            <div className='mt-2 flex items-center justify-between gap-2.5'>
                              {list.beds && (
                                <div className='flex items-center gap-1'>
                                  <BedIcon className='w-4 h-4 text-amber-500' />
                                  <p className='text-xs'>{list.beds} Beds</p>
                                </div>
                              )}

                              {list.baths && (
                                <div className='flex items-center gap-1'>
                                  <BathIcon className='w-4 h-4 text-amber-500' />
                                  <p className='text-xs'>{list.baths} Baths</p>
                                </div>
                              )}

                              {list.sqm && (
                                <div className='flex items-center gap-1'>
                                  <RatioIcon className='w-4 h-4 text-amber-500' />
                                  <p className='text-xs'>{list.sqm} Sqm</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className=''>
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
                          {/* <p
                            className='absolute bottom-2 right-2 bg-black/20 px-2 py-0.5
              rounded-full font-medium text-white'>
                            {list.status}
                          </p> */}

                          <p
                            className='absolute top-2 right-2 bg-red-100 px-2 py-0.5
              rounded-full font-medium border border-red-500 text-red-500'>
                            Unavailable
                          </p>
                        </div>

                        <div className='px-4 pb-4 pt-3 bg-red-200 dark:bg-red-950/70'>
                          <h2 className='font-medium leading-tight line-clamp-2'>
                            {list.title}
                          </h2>
                          <div className='flex justify-start  mt-1.5'>
                            <p className='text-sm font-light px-2 py-0 w-auto text-amber-500 border rounded-full border-amber-500'>
                              {list.location}
                            </p>
                          </div>

                          <div className='mt-2 flex items-center justify-between gap-2.5'>
                            {list.beds && (
                              <div className='flex items-center gap-1'>
                                <BedIcon className='w-4 h-4 text-amber-500' />
                                <p className='text-xs'>{list.beds} Beds</p>
                              </div>
                            )}

                            {list.baths && (
                              <div className='flex items-center gap-1'>
                                <BathIcon className='w-4 h-4 text-amber-500' />
                                <p className='text-xs'>{list.baths} Baths</p>
                              </div>
                            )}

                            {list.sqm && (
                              <div className='flex items-center gap-1'>
                                <RatioIcon className='w-4 h-4 text-amber-500' />
                                <p className='text-xs'>{list.sqm} Sqm</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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
