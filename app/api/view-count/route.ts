import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { topicId, slug } = await req.json();

    if (!topicId || typeof topicId !== "number") {
      return NextResponse.json(
        { error: "Invalid or missing topic ID" },
        { status: 400 }
      );
    }

    const { error } = await supabaseService.rpc("increment_views", {
      topic_id_input: topicId,
    });

    if (error) {
      console.error("Error incrementing views:", error);
      return NextResponse.json(
        { error: "Failed to update views" },
        { status: 500 }
      );
    }

    revalidatePath(`/threads/topics/${slug}`, 'layout')

    return NextResponse.json({ message: "View count updated successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
