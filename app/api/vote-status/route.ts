import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { postId, userId, slug } = await req.json();

  if (!postId || !userId) {
    return NextResponse.json(
      { success: false, message: "Post ID and User ID are required" },
      { status: 400 }
    );
  }

  try {
    // Check if a vote already exists
    const { data: existingVote, error: fetchError } = await supabaseService
      .from("votes")
      .select("id, voted")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching vote record:", fetchError);
      return NextResponse.json(
        { success: false, message: "Failed to fetch vote record" },
        { status: 500 }
      );
    }

    let updatedVote = true;
    let voteDelta = 1;

    if (existingVote) {
      // Toggle the vote
      updatedVote = !existingVote.voted;
      voteDelta = existingVote.voted ? -1 : 1;

      const { error: updateError } = await supabaseService
        .from("votes")
        .update({ voted: updatedVote })
        .eq("id", existingVote.id);

      if (updateError) {
        console.error("Error updating vote record:", updateError);
        return NextResponse.json(
          {
            success: false,
            message: `Failed to update vote: ${updateError.message}`,
          },
          { status: 500 }
        );
      }
    } else {
      // Insert a new vote record
      const { error: insertError } = await supabaseService
        .from("votes")
        .insert({
          post_id: postId,
          user_id: userId,
          voted: true,
        });

      if (insertError) {
        console.error("Error inserting vote record:", insertError);
        return NextResponse.json(
          {
            success: false,
            message: `Failed to create vote: ${insertError.message}`,
          },
          { status: 500 }
        );
      }
    }

    // Fetch the current vote count from the topics table
    const { data: topicData, error: topicFetchError } = await supabaseService
      .from("topics")
      .select("votes")
      .eq("id", postId)
      .single();

    if (topicFetchError) {
      console.error("Error fetching topic votes:", topicFetchError);
      return NextResponse.json(
        {
          success: false,
          message: `Failed to fetch topic votes: ${topicFetchError.message}`,
        },
        { status: 500 }
      );
    }

    const currentVotes = topicData?.votes || 0;
    const updatedVotes = currentVotes + voteDelta;

    // Update the votes count in the topics table
    const { error: topicUpdateError } = await supabaseService
      .from("topics")
      .update({ votes: updatedVotes })
      .eq("id", postId)

    if (topicUpdateError) {
      console.error("Error updating topic votes:", topicUpdateError);
      return NextResponse.json(
        {
          success: false,
          message: `Failed to update topic votes: ${topicUpdateError.message}`,
        },
        { status: 500 }
      );
    }

    revalidatePath("/threads/topics", "layout");
    revalidatePath(`/threads/topics/${slug}`);

    return NextResponse.json({
      success: true,
      voted: updatedVote,
      votes: updatedVotes,
      message: updatedVote
        ? "Vote added successfully"
        : "Vote removed successfully",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
