import BlogComments from "@/components/BlogComments";
import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server"; // Adjust this path to your Supabase client
import dayjs from "dayjs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("blogs")
    .select("title, slug, img")
    .eq("slug", params.slug)
    .single();

  return {
    title: data?.title || "Blog post details",
    description:
      data?.slug ||
      "Stay updated with the latest articles, trends, and insights on real estate and home services. Explore our blog at Tigerkenn Homes to learn more about our mission, services, and how we’re fostering innovation and building lasting relationships with our clients.",
    openGraph: {
      title: data?.title || "Blog post details",
      description:
        `Read more about: ${data?.slug}` ||
        "Stay updated with the latest articles, trends, and insights on real estate and home services. Explore our blog at Tigerkenn Homes to learn more about our mission, services, and how we’re fostering innovation and building lasting relationships with our clients.",
      images: [
        {
          url:
            data?.img ||
            "https://res.cloudinary.com/dusg2xagv/image/upload/v1730245213/og-image/qtu9wrhthbw7iw6gupur.jpg",
          type: "image",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

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

  if (blog) {
    const baseUrl = process.env.NEXT_PUBLIC_HOME || "http://localhost:3000";
    await fetch(`${baseUrl}/api/blog-views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch((fetchError) => {
      // Log error if in development, but do not interrupt the user
      if (process.env.NODE_ENV === "development") {
        console.error("View count update failed:", fetchError);
      }
    });
  }

  return (
    <div className='w-full max-w-5xl mx-auto px-3 py-8'>
      {/* Blog Image */}
      <div className='relative w-full h-96 aspect-video mb-8 animate-fadeIn'>
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

      {/* Blog Metadata and likes */}
      <div className='mb-6 flex items-center gap-6'>
        <p className='text-gray-500 text-sm animate-fadeIn'>
          Published on {dayjs(blog.published_at).format("MMM DD, YYYY hh:mm a")}
        </p>
        <LikeButton postId={blog.id} user={user} />
        <ShareButton />
      </div>

      {/* Blog Content */}
      <div
        className='animate-fadeIn max-w-none dark:text-gray-300'
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Return to Blog List */}
      <div className='mt-10 animate-fadeIn '>
        <Button
          aria-label='return to blog list'
          asChild
          className='bg-sky-600 hover:bg-sky-700 text-white'>
          <Link aria-label='return to blog list' href='/blogs'>
            Return to Blog List
          </Link>
        </Button>
      </div>
      <BlogComments id={blog.id} user={user} username={username} />
    </div>
  );
}
