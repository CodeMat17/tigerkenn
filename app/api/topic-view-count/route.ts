import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Ensure that `slug` is extracted and parsed properly
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug is required." },
        { status: 400 }
      );
    }

    // Fetch the blog post by slug
    const { data: topic, error: fetchError } = await supabaseService
      .from("topics")
      .select("id, views")
      .eq("slug", slug)
      .single();

    if (fetchError || !topic) {
      // Return a success response even if the topic is not found
      return NextResponse.json(
        { success: true, message: "Topic post not found or no view update" },
        { status: 200 }
      );
    }

    // Increment the view count, catching errors separately to avoid blocking
    const updatedViews = (topic.views || 0) + 1; // Ensure views defaults to 0 if null/undefined

    try {
      await supabaseService
        .from("topics")
        .update({ views: updatedViews })
        .eq("id", topic.id)
        .select();
    } catch (updateError) {
      if (process.env.NODE_ENV === "development") {
        console.error("View count update failed:", updateError);
      }
    }

    // Revalidate paths if needed
    revalidatePath("/threads/topics", "layout");
    revalidatePath(`/threads/topics/${slug}`);

    // Return a success response regardless of the view count outcome
    return NextResponse.json(
      { success: true, message: "Post accessed" },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error:", error);
    }
    return NextResponse.json(
      { success: true, message: "Post accessed with no view update" },
      { status: 200 }
    );
  }
}
