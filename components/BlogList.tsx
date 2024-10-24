"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { createClient } from "@/utils/supabase/clients";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { MinusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type BlogPost = {
  title: string;
  slug: string;
  published_at: string;
  img: string;
  content: string; // Markdown content
};

export default function BlogList() {
  const supabase = createClient();

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);

    const perPage = 9;
    const from = page * perPage;
    const to = from + perPage - 1;

    try {
      const { data, count, error } = await supabase
        .from("blogs")
        .select("title, slug, published_at, img, content", { count: "exact" })
        .order("published_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error(error);
        return <div>Error fetching blogs.</div>;
      } else {
        setBlogs(data || []);
        setTotalPages(Math.ceil((count || 0) / perPage));
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='px-4 w-full min-h-screen flex justify-center text-center py-32'>
        <MinusIcon className='animate-spin mr-3' /> loading data...
      </div>
    );
  }

  return (
    <div className='min-h-screen py-10 px-4 sm:px-4 bg-gray-50 dark:bg-gray-950'>
      <div className='max-w-5xl mx-auto'>
        <motion.h1
          className='text-3xl sm:text-4xl text-center font-semibold mb-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}>
          Blog Posts
        </motion.h1>

        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {blogs?.map((blog) => (
            <motion.div
              key={blog.slug}
              className=' rounded-xl shadow-lg overflow-hidden'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              <Link
                href={`/blogs/${blog.slug}`}
                className='block hover:scale-105 transition-transform duration-300'>
                <div className='relative h-48'>
                  <Image
                    src={blog.img}
                    alt={blog.title}
                    layout='fill'
                    className='object-cover'
                  />
                </div>
                <div className='px-6 pb-6 pt-4 bg-white dark:bg-gray-800'>
                  <h2 className='text-xl font-semibold text-blue-500 mb-2 leading-6 line-clamp-2'>
                    {blog.title}
                  </h2>
                  <p className='text-gray-400 text-sm'>
                    Published on{" "}
                    {dayjs(blog.published_at).format("MMM DD, YYYY hh:mm a")}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className='my-7 '>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
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
                  variant='ghost'
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}>
                  Next <ChevronRightIcon className='ml-2' />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
