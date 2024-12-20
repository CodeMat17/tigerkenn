import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Ensure that `slug` is extracted and parsed properly
    const { slug } = await req.json();

    // Fetch the blog post by slug
    const { data: blog, error: fetchError } = await supabaseService
      .from("blogs")
      .select("id, views")
      .eq("slug", slug)
      .single();

    if (fetchError || !blog) {
      // Return a success response even if the blog is not found
      return NextResponse.json(
        { success: true, message: "Blog post not found or no view update" },
        { status: 200 }
      );
    }

    // Increment the view count, catching errors separately to avoid blocking
    try {
      await supabaseService
      .from("blogs")
      .update({ views: blog.views + 1 })
      .eq("id", blog.id)
    } catch  (updateError) {
       if (process.env.NODE_ENV === "development") {
        console.error("View count update failed:", updateError);
      }
    }

    revalidatePath('/', 'layout')

    // Return a success response regardless of the view count outcome
     return NextResponse.json(
       { success: true, message: "Blog post accessed" },
       { status: 200 }
     );
  } catch (error) {
   if (process.env.NODE_ENV === "development") {
     console.error("Unexpected error:", error);
   }
   return NextResponse.json(
     { success: true, message: "Blog post accessed with no view update" },
     { status: 200 }
   );
  }
}
