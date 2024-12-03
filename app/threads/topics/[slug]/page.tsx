import SlugDetail from "@/components/SlugDetails";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("topics")
    .select("title, slug")
    .eq("slug", params.slug)
    .single();

  return {
    title: data?.title || "Thread",
    description: data?.slug || "View detailed information about this thread",
    openGraph: {
      title: data?.title || "Thread",
      description:
        `Read more about: ${data?.slug}` ||
        "View detailed information about this thread",
    },
  };
}

const TopicDetail = async ({ params: { slug } }: Props) => {
  const supabase = createClient();

  // Fetch user data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <SlugDetail slug={slug} user={user} />;
};

export default TopicDetail;
