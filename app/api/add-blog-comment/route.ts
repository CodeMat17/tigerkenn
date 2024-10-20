import { supabaseService } from "@/utils/supabase/service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const blog_id = formData.get("id") as string;
  const comment = formData.get("comment") as string;
  const author = formData.get("author") as string;
  const parent_id =
    formData.get("parent_id") === "null"
      ? null
      : (formData.get("parent_id") as string); // Ensure parent_id is null for top-level comments

  // Validate that 'id', 'comment', 'author', and 'date' are provided
  if (!blog_id || !comment || !author) {
    console.error("Missing required fields:", {
      blog_id,
      comment,
      author,
    });
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Insert the comment or reply into the listing_comments table
  const { data, error } = await supabaseService
    .from("blog_comments")
    .insert([{ blog_id, comment, author, parent_id }])
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
