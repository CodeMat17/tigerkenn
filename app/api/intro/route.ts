import { supabaseService } from "@/utils/supabase/service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id, title, desc } = await req.json();

  // Validate that 'id', 'title', and 'content' are provided
  if (!id || !title || !desc) {
    return NextResponse.json(
      { error: "ID, title, and content are required." },
      { status: 400 }
    );
  }

  // Update the record in Supabase
  const { data, error } = await supabaseService
    .from("intro")
    .update({ title, desc })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
