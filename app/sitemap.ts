import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // Fetch blog posts and listings from Supabase or your data source
  const { data: blogPosts } = await supabase
    .from("blogs")
    .select("slug, published_at");
  const { data: listings } = await supabase
    .from("listings")
    .select("id, created_at");

  // Basic static routes
  const staticRoutes = [
    {
      url: process.env.NEXT_PUBLIC_HOME!,
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_ABOUT_US!,
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_LISTINGS!,
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_BLOGS!,
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_CONTACT_US!,
      lastModified: new Date(),
    },
  ];

  // Dynamic blog pages
  const blogRoutes =
    blogPosts?.map((post) => ({
      url: `${process.env.NEXT_PUBLIC_BLOGS}/${post.slug}`,
      lastModified: new Date(post.published_at),
    })) || [];

  // Dynamic listing pages
  const listingRoutes =
    listings?.map((listing) => ({
      url: `${process.env.NEXT_PUBLIC_LISTINGS}/${listing.id}`,
      lastModified: new Date(listing.created_at),
    })) || [];

  // Combine static and dynamic routes
  return [...staticRoutes, ...blogRoutes, ...listingRoutes];
}
