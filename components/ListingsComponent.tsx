// /app/listings/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { createClient } from "@/utils/supabase/clients";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  MinusIcon,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type ListingsProps = {
  id: string;
  title: string;
  price: number;
  beds: number;
  baths: number;
  img: string;
  status: string;
  location: string;
  sqm: number;
  available: boolean;
  slug: string;
};

const ListingsComponent: React.FC = () => {
  const supabase = createClient();

  const [listings, setListings] = useState<ListingsProps[]>([]);
  // const [totalCount, setTotalCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [noMatchFound, setNoMatchFound] = useState<boolean>(false);

  useEffect(() => {
    fetchListings();
  }, [page, searchQuery]);

  const fetchListings = async () => {
    setLoading(true);
    const perPage = 9;
    const from = page * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from("listings")
      .select(
        "id, img, price, status, title, beds, baths, sqm, location, available, slug",
        {
          count: "exact",
        }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (searchQuery) {
      query = supabase
        .from("listings")
        .select(
          "id, img, price, status, title, beds, baths, sqm, location, available, slug",
          {
            count: "exact",
          }
        )
        .or(`location.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .order("created_at", { ascending: false })
        .range(from, to);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error("Error fetching students:", error);
    } else {
      setListings(data || []);
      setTotalPages(Math.ceil((count || 0) / perPage));
      setNoMatchFound(data?.length === 0);
      // setTotalCount(count || 0);
    }

    setLoading(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0); // Reset to first page on new search
  };

  return (
    <div className='max-w-6xl min-h-screen mx-auto py-12 px-4 sm:px-6 lg:px-8'>
      <h1 className='text-4xl font-bold text-center mb-8'>Listings</h1>

      <div className='relative w-full max-w-md mx-auto mb-8'>
        <Input
          type='search'
          placeholder='Search listings by location or by category: land or house...'
          value={searchQuery}
          onChange={handleSearchChange}
          className='mb-4 pl-10 py-2 pb-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 '
        />
        <SearchIcon className='absolute top-2.5 w-5 h-5 ml-3 text-sky-600' />
      </div>
      {/* <p className='text-sm text-gray-500'>
        Total number of listings: {totalCount}
      </p> */}

      {loading ? (
        <div className='w-full flex items-center justify-center px-4 py-32'>
          <MinusIcon className='animate-spin mr-3' /> Please wait...
        </div>
      ) : (
        <>
          {noMatchFound ? (
            <div className='w-full text-center px-4 py-32'>
              No match found. Try again.
            </div>
          ) : (
            <div className='flex flex-wrap justify-center gap-4'>
              {listings &&
                listings.map((list) => (
                  <div
                    key={list.id}
                    className='rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl group w-full max-w-[330px]'>
                    <Link href={`/listings/${list.slug}`} className='group'>
                      <div className=' transition transform duration-300 ease-in-out group-hover:scale-105'>
                        <div className='relative'>
                          <Image
                            alt={list.title}
                            priority
                            width={320}
                            height={200}
                            src={list.img}
                            className='w-full h-[180px] aspect-video object-cover '
                          />
                          {list.price && (
                            <p className='absolute bottom-2 left-2 px-1.5 py-0.5 rounded-xl overflow-hidden bg-black/20 font-bold text-white'>
                              ₦{list.price.toLocaleString() ?? "N/A"}
                            </p>
                          )}

                          {list.location && (
                            <div className='absolute bottom-2 right-2'>
                              <div
                                className='relative px-1.5 py-0.5
                           rounded-full bg-blue-200/80 flex items-center gap-1'>
                                <div className='relative flex items-center justify-center h-4 w-4'>
                                  <div className='animate-ping absolute flex items-center justify-center h-full w-full rounded-full bg-blue-800 group-hover:bg-red-500 opacity-75'></div>
                                  <div className='relative flex items-center justify-center rounded-full h-4 w-4 bg-transparent'>
                                    <MapPinIcon className='w-4 h-4 text-blue-800 group-hover:text-red-500' />
                                  </div>
                                </div>
                                <p className='truncate text-blue-800'>
                                  {list.location}
                                </p>

                                <div className='absolute -top-3 '></div>
                              </div>
                            </div>
                          )}

                          <p
                            className={`absolute top-2 right-2 ${
                              list.available
                                ? "bg-green-500/60 border-green-500 text-green-100"
                                : "bg-red-500/60 border-red-500 text-red-100"
                            }  px-2 py-0.5
              rounded-full font-medium border `}>
                            {list.available ? "Available" : "Unavailable"}
                          </p>
                        </div>

                        <div className='p-4'>
                          <h2 className='text-lg font-medium leading-tight truncate mb-1'>
                            {list.title}
                          </h2>

                          <div className='mt-2 flex items-center justify-between gap-2.5 text-sm text-gray-500 dark:text-gray-400'>
                            {list.beds && (
                              <div className='flex items-center gap-1'>
                                <p>{list.beds} Beds</p>
                              </div>
                            )}

                            {list.baths && (
                              <div className='flex items-center gap-1'>
                                <p>{list.baths} Baths</p>
                              </div>
                            )}

                            {list.sqm && (
                              <div className='flex items-center gap-1'>
                                <p>{list.sqm} Sqm</p>
                              </div>
                            )}

                            {list.available && (
                              <p className=' px-3 py-1 rounded-xl overflow-hidden bg-black/60 dark:bg-black/20 font-bold text-white'>
                                {list.status}
                              </p>
                            )}

                        
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          )}
          <div className='my-7'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    aria-label='prev'
                    variant='ghost'
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}>
                    <ChevronLeftIcon className='mr-2' /> Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <span className='text-sm'>
                    Page {page + 1} of {totalPages}
                  </span>
                </PaginationItem>

                <PaginationItem>
                  <Button
                    aria-label='next'
                    variant='ghost'
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages - 1}>
                    Next <ChevronRightIcon className='ml-2' />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default ListingsComponent;
