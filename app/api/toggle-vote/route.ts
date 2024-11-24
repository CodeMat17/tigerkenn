import { supabaseService } from "@/utils/supabase/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { postId, userId, voted } = await req.json();

    if (!postId || !userId) {
      return NextResponse.json(
        { success: false, message: "Post ID and User ID are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseService
      .from("votes")
      .select("id, voted, user_id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (data && userId !== data.user_id) {
      console.warn("Warning: Provided userId does not match the record.");
    }

    if (data) {
      await supabaseService.from("votes").update({ voted }).eq("id", data.id);
    } else {
      await supabaseService.from("votes").insert({
        post_id: postId,
        user_id: userId,
        voted: true,
      });
    }

    return NextResponse.json({ success: true, voted, user_id: userId });
  } catch (err) {
    console.error("Error toggling vote:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
