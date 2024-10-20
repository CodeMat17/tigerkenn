import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id, content } = await req.json();

  // Validate that 'id', 'title', and 'content' are provided
  if (!id || !content) {
    return NextResponse.json(
      { error: "ID and content are required." },
      { status: 400 }
    );
  }

  // Update the record in Supabase
  const { data, error } = await supabaseService
    .from("blogs")
    .update({ content })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath(`/blogs`);
  revalidatePath(`/blogs/${id}`);
  revalidatePath(`/admin/blogs/${id}`);

  return NextResponse.json({ data }, { status: 200 });
}
