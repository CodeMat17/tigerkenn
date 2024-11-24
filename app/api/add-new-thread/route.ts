import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const { title, content, user_id, slug, tags } = await req.json();

    // Validate required fields
    if (!title || !content || !user_id || !tags || !slug) {
      return NextResponse.json(
        { error: "Fill add the required fields." },
        { status: 400 }
      );
    }

    // Insert into the Supabase "topics" table
    const { data, error } = await supabaseService
      .from("topics")
      .insert([{ title, content, user_id, slug, tags }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate cache
    revalidatePath("/thread/topics");

    // Return a success response
      return NextResponse.json(
        { message: "Topic created successfully!", data },
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
