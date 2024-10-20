import { supabaseService } from "@/utils/supabase/service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const listing_id = formData.get("id") as string;
  const comment = formData.get("comment") as string;
  const author = formData.get("author") as string;
  const date = formData.get("date") as string;
  const parent_id =
    formData.get("parent_id") === "null"
      ? null
      : (formData.get("parent_id") as string); // Ensure parent_id is null for top-level comments

  // Validate that 'id', 'comment', 'author', and 'date' are provided
  if (!listing_id || !comment || !author) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Insert the comment or reply into the listing_comments table
  const { data, error } = await supabaseService
    .from("listing_comments")
    .insert([{ listing_id, comment, author, date, parent_id }])
    .select();

  if (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Error adding comment." },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 200 });
}
