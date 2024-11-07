import BlogList from "@/components/BlogList";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Posts",
  description:
    "Learn more about our services and mission at Tigerkenn Homes. We are dedicated to delivering exceptional services, fostering innovation, and building lasting relationships with our clients.",
};

export default async function BlogListPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <BlogList user={user} />
    </div>
  );
}
