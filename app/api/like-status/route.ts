// app/api/like-status/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  const userId = searchParams.get("userId");

  const supabase = createClient();

  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  // Get total likes count
  const { count: totalLikes, error: totalLikesError } = await supabase
    .from("likes")
    .select("liked", { count: "exact" })
    .eq("post_id", postId)
    .eq("liked", true);

  if (totalLikesError) {
    return NextResponse.json(
      { error: "Failed to fetch total likes" },
      { status: 500 }
    );
  }

  let liked = false;
  if (userId) {
    // Check if the user liked this post if userId is provided
    const { data: userLike } = await supabase
      .from("likes")
      .select("liked")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    liked = userLike?.liked || false;
  }

  return NextResponse.json({
    liked,
    totalLikes: totalLikes || 0,
  });
}
