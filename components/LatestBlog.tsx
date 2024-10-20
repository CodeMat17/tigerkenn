import ShimmerButton from "@/components/ui/shimmer-button";
import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

const blogs = [
  {
    img: "/others/1.webp",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing.",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatum, impedit neque veritatis velit commodi doloribus?",
    date: "Apr 23, 2024",
    comments: "5",
  },
  {
    img: "/others/2.webp",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing.",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatum, impedit neque veritatis velit commodi doloribus?",
    date: "Sept 23, 2024",
    comments: "2",
  },
  {
    img: "/others/3.webp",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing.",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatum, impedit neque veritatis velit commodi doloribus?",
    date: "Oct 23, 2024",
    comments: "0",
  },
  // {
  //   img: "/others/4.webp",
  //   title: "Lorem ipsum dolor sit amet consectetur adipisicing.",
  //   desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatum, impedit neque veritatis velit commodi doloribus?",
  //   date: "Apr 23, 2024",
  //   comments: "1",
  // },
];

const LatestBlog = async () => {
  const supabase = createClient();

  const { data: blogs, error } = await supabase
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
          <div className='flex flex-wrap justify-center gap-5  dark:text-gray-400'>
            {blogs &&
              blogs.map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.slug}`} className='w-full max-w-[300px]'>
                  <div className=' rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition transform hover:scale-105 ease-in-out duration-500'>
                    <Image
                      alt={blog.img}
                      priority
                      width={300}
                      height={100}
                      src={blog.img}
                      className='w-full h-[120px] aspect-video object-cover'
                    />

                    <div className=' flex justify-between items-center text-xs font-medium bg-amber-100/60 dark:bg-amber-100 text-amber-600 px-4 py-1'>
                      <p>
                        Published on{" "}
                        {dayjs(blog.published_at).format(
                          "MMM DD, YYYY hh:mm a"
                        )}
                      </p>
                      {/* <p>
                        Comments{" "}
                        <span className='text-red-500'>({blog.comments})</span>
                      </p> */}
                    </div>

                    <div className='px-4 pb-4 pt-2'>
                      <h2 className='text-lg font-semibold leading-5 mb-2 dark:text-gray-300 line-clamp-2'>
                        {blog.title}
                      </h2>
                   
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
      <div className='flex justify-center mt-6'>
        <Link href='/blogs'>
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
