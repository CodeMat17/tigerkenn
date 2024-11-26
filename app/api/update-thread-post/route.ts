import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { title, content, tags, id, newSlug } = await req.json();

  // Validate required fields
  if (
    !title?.trim() ||
    !content?.trim() ||
    !id ||
    !newSlug?.trim() ||
    !Array.isArray(tags) ||
    tags.length === 0
  ) {
    return NextResponse.json(
      { error: "Fill add the required fields." },
      { status: 400 }
    );
  }

  try {
    // update Supabase "topics" table
    const { data, error } = await supabaseService
      .from("topics")
      .update({ title, content, tags, slug: newSlug })
      .eq("id", id)
      .select("*");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate cache
    revalidatePath("/thread/topics");

    // Return a success response
    return NextResponse.json(
      { message: "Topic updated successfully!", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
