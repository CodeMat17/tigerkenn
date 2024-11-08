import { createClient } from "@/utils/supabase/server";
import { Eye, EyeOff, MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ShimmerButton from "./ui/shimmer-button";

const RecentListing = async () => {
  const supabase = createClient();
  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("category", "land")
    .limit(3)
    .order("created_at", { ascending: false });

  return (
    <section className='w-full bg-gray-50 dark:bg-gray-950'>
      <div className='w-full max-w-6xl mx-auto px-6 py-16'>
        <h1 className='text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white'>
          Recent Land Listings
        </h1>

        <div className='mt-8'>
          {listings && listings.length === 0 ? (
            <div className='w-full text-center py-24'>
              <p className='text-lg text-gray-600 dark:text-gray-300'>
                No listings available at the moment
              </p>
            </div>
          ) : (
            <div className='flex flex-wrap justify-center gap-6'>
              {listings?.map((list, i) => (
                <div
                  key={i}
                  className='rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition duration-300 ease-in-out w-full sm:max-w-[300px]'>
                  <Link
                    href={`/land-listings/${list.slug}`}
                    passHref
                    className='block transition-transform duration-300 transform hover:scale-105'>
                    <div className='relative'>
                      <Image
                        alt={`${list.title} listing image`}
                        priority
                        width={320}
                        height={200}
                        src={list.img}
                        className='w-full h-[180px] object-cover'
                      />
                      <p className='absolute bottom-3 left-2 px-3 py-1 bg-black/30 rounded-full text-white font-semibold text-lg'>
                        ₦{list.price.toLocaleString() ?? "N/A"}
                      </p>
                      <p
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full font-semibold text-sm ${
                          list.available
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}>
                        {list.available ? "Available" : "Not Available"}
                      </p>
                    </div>

                    <div className='px-4 py-2'>
                      <h2 className='text-lg font-medium text-gray-800 dark:text-white truncate mb-1'>
                        {list.title}
                      </h2>

                      <div className='text-sm flex items-center gap-2 text-gray-600 dark:text-gray-300'>
                        <p> {list.fenced ? "Fenced" : "Not fenced"}</p> |
                        <p>{list.gate ? "With gate" : "No gate"}</p> |{" "}
                        <p>{list.sqm} sqm</p>
                      </div>

                      <div className='flex justify-between items-center text-sm mt-2'>
                        <div className='flex items-center text-blue-600 dark:text-blue-400'>
                          <MapPinIcon className='w-4 h-4 mr-1 ' />{" "}
                          {list.location}
                        </div>
                        <div className='flex items-center'>
                          {list.views < 1 ? (
                            <EyeOff className='w-4 h-4 mr-1' />
                          ) : (
                            <Eye className='w-4 h-4 mr-1' />
                          )}
                          <p>{list.views}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex justify-center mt-10'>
          <Link href='/land-listings' aria-label='See Full Listings'>
            <ShimmerButton className='shadow-lg px-6 py-2'>
              <span className='text-white text-sm font-semibold'>
                See full land listings
              </span>
            </ShimmerButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentListing;
