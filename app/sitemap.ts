import { createClient } from "@/utils/supabase/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // Fetch threadsfrom Supabase or your data source
  const { data: threads } = await supabase
    .from("topics")
    .select("slug, created_at");

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
      url: process.env.NEXT_PUBLIC_THREADS!,
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_CONTACT_US!,
      lastModified: new Date(),
    },
  ];

  // Dynamic thread pages
  const threadTopics =
    threads?.map((thread) => ({
      url: `${process.env.NEXT_PUBLIC_THREADS}/${thread.slug}`,
      lastModified: new Date(thread.created_at),
    })) ?? [];



  // Combine static and dynamic routes
  return [...staticRoutes, ...threadTopics];
}
