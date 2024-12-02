import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Ensure that `slug` is extracted and parsed properly
    const { topic_id, author, reply, parent_id, slug } = await req.json();

    if (!topic_id || !author || !reply) {
      return NextResponse.json(
        {
          success: false,
          message: "The required fields are missing",
        },
        { status: 500 }
      );
    }

    const { error } = await supabaseService
      .from("topic_reply")
      .insert([{ topic_id, author, reply, parent_id }])
      .select();

    if (error) {
      // Return a success response even if the topic is not found
      console.error("Database insert error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to insert reply.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    console.log("Reply inserted successfully:");

    // Revalidate paths if needed
    // Revalidate the path
    try {
      revalidatePath(`/threads/topics/${slug}`, 'layout'); // Ensure this path is correct and supported
    } catch (revalidateError) {
      console.warn("Revalidation failed:", revalidateError);
    }

    // Return a success response regardless of the view count outcome
    return NextResponse.json(
      { success: true, message: "Reply submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error.", error },
      { status: 500 }
    );
  }
}
