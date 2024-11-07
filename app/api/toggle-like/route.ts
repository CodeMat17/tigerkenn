// app/api/toggle-like/route.ts
import { supabaseService } from "@/utils/supabase/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { postId, userId, liked } = await req.json();

  if (!postId || !userId) {
    return NextResponse.json(
      { error: "Missing postId or userId" },
      { status: 400 }
    );
  }


  try {
    // Check if a like record exists for this user and post
    const { data } = await supabaseService
      .from("likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    if (data) {
      // Update existing like status
      const { error: updateError } = await supabaseService
        .from("likes")
        .update({ liked })
        .eq("id", data.id);

      if (updateError) throw updateError;
    } else {
      // Create new like record
      const { error: insertError } = await supabaseService
        .from("likes")
        .insert({ post_id: postId, user_id: userId, liked });

      if (insertError) throw insertError;
    }

    // Fetch updated total likes count
    const { count: totalLikes, error: totalLikesError } = await supabaseService
      .from("likes")
      .select("liked", { count: "exact" })
      .eq("post_id", postId)
      .eq("liked", true);

    if (totalLikesError) throw totalLikesError;

    return NextResponse.json({ liked, totalLikes: totalLikes || 0 });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
