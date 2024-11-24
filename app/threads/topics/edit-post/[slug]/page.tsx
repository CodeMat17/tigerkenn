import EditThreadPost from "@/components/EditThreadPost";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

const EditPost = async ({ params: { slug } }: Props) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
    return;
  }

  const { data: post, error } = await supabase
    .from("topics")
    .select("title, tags, content, user_id")
    .eq("slug", slug)
    .single();
  
  if (error) {
    console.error("Error fetching topic", error);
    return;
  }

  if (!post) {
    notFound()
  }

  if (user?.id != post.user_id) {
    return (
      <div className="text-center px-4 py-20">This post was not published by you. {' '}<Link href='/threads/topics'>Go back to threads.</Link></div>
    )
  }

  return (
    <div
      className='px-4 py-8
  '>
      <h2 className="text-3xl sm:text-4xl font-semibold text-center">Edit your post</h2>
      
     
      <EditThreadPost slug={slug} post_title={post.title} post_tags={post.tags} post_content={post.content} />
    </div>
  );
};

export default EditPost;
