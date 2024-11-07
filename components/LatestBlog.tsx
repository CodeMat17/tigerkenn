import ShimmerButton from "@/components/ui/shimmer-button";
import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LikeButton from "./LikeButton";

const LatestBlog = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .limit(3)
    .order("created_at", { ascending: false });

  return (
    <div className='px-4 py-12 w-full max-w-6xl mx-auto'>
      <h2 className='text-3xl font-semibold sm:text-4xl mb-12'>
        Latest Blog Posts
      </h2>
      <div>
        {blogs && blogs.length < 1 ? (
          <div className='px-4 text-center py-32'>
            No blog post at the moment.
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {blogs &&
              blogs.map((blog) => (
                <div
                  key={blog.id}
                  className='w-full transition transform hover:scale-105 ease-in-out duration-500 rounded-xl overflow-hidden shadow-lg hover:shadow-xl sm:max-w-[320px] xl:max-w-[350px] mx-auto'>
                  <Link aria-label='blog post' href={`/blogs/${blog.slug}`}>
                    <Image
                      alt={blog.img}
                      priority
                      width={300}
                      height={100}
                      src={blog.img}
                      className='w-full h-[120px] aspect-video object-cover'
                    />
                    <div className='flex justify-between items-center text-xs font-medium bg-blue-100/80 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-1'>
                      <p>
                        Published on{" "}
                        {dayjs(blog.published_at).format(
                          "MMM DD, YYYY hh:mm a"
                        )}
                      </p>
                    </div>
                    <div className='px-4 pt-2'>
                      <h2 className='text-lg font-semibold leading-5 dark:text-gray-300 line-clamp-2'>
                        {blog.title}
                      </h2>
                    </div>
                  </Link>
                  <div className='flex justify-between items-center text-sm mt-1 px-4 pb-2'>
                    <LikeButton postId={blog.id} user={user} />
                    <div className='flex items-center'>
                      {blog.views < 1 ? (
                        <EyeOff className='w-4 h-4 mr-1' />
                      ) : (
                        <Eye className='w-4 h-4 mr-1' />
                      )}{" "}
                      <p>{blog.views}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <div className='flex justify-center mt-6'>
        <Link aria-label='blog page' href='/blogs'>
          <ShimmerButton className='shadow-2xl'>
            <span className='whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg'>
              Read More Blog Posts
            </span>
          </ShimmerButton>
        </Link>
      </div>
    </div>
  );
};

export default LatestBlog;
