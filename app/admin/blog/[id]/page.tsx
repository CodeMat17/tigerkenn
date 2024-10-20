import EditBlogPost from "@/components/admin/EditBlogPost";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

const BlogDetails = async ({ params: { id } }: Props) => {
  const supabase = createClient();

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (!blog || error) {
    notFound();
    return null;
  }

  return (
    <div className='py-12 w-full min-h-screen max-w-xl mx-auto'>
      <h1 className='text-3xl text-center font-semibold mb-6'>
        Edit Blog Post
      </h1>
      <EditBlogPost
        id={blog.id}
        blogTitle={blog.title}
        blogContent={blog.content}
        blogImg={blog.img}
      />
    </div>
  );
};

export default BlogDetails;
