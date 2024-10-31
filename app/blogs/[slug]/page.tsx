import BlogComments from "@/components/BlogComments";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server"; // Adjust this path to your Supabase client
import dayjs from "dayjs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";


export const metadata: Metadata = {
  title: "Blog Post",
  description:
    "Stay updated with the latest articles, trends, and insights on real estate and home services. Explore our blog at Tigerkenn Homes to learn more about our mission, services, and how we’re fostering innovation and building lasting relationships with our clients.",
};

export const revalidate = 0;

function getUserNameFromEmail(email: string | undefined): string | null {
  if (!email) {
    return null;
  }

  const [username] = email.split("@");
  return username;
}

// Server Component to fetch blog post based on slug
export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const supabase = createClient();

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const username = getUserNameFromEmail(user?.email);

  // Fetch blog from Supabase
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !blog) {
    notFound(); // If blog is not found, show 404 page
  }

  return (
    <div className='w-full max-w-5xl mx-auto px-3 py-8'>
      {/* Blog Image */}
      <div className='relative w-full h-56 aspect-video mb-8 animate-fadeIn'>
        <Image
          priority
          fill
          src={blog.img}
          alt={blog.title}
          className='w-full h-full object-cover rounded-lg shadow-lg'
        />
      </div>

      {/* Blog Title */}
      <h1 className='text-3xl md:text-4xl font-semibold mb-2 dark:text-gray-300 animate-fadeIn'>
        {blog.title}
      </h1>

      {/* Blog Metadata */}
      <p className='text-gray-500 text-sm mb-6 animate-fadeIn'>
        Published on {dayjs(blog.published_at).format("MMM DD, YYYY hh:mm a")}
      </p>

      {/* Blog Content */}
      <div
        className='animate-fadeIn max-w-none dark:text-gray-300'
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Return to Blog List */}
      <div className='mt-10 animate-fadeIn '>
        <Button aria-label="return to blog list" asChild className='bg-sky-600 hover:bg-sky-700 text-white'>
          <Link aria-label="return to blog list" href='/blogs'>Return to Blog List</Link>
        </Button>
      </div>
      <BlogComments id={blog.id} user={user} username={username} />
    </div>
  );
}
