import { supabaseService } from "@/utils/supabase/service";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { id, desc } = await req.json();

  // validate
  if (!id || !desc) {
    return NextResponse.json(
      { error: "ID and desc are required." },
      { status: 400 }
    );
  }

  // update record in Supabase
  const { data, error } = await supabaseService
    .from("listings")
    .update({ desc })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating description:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/admin/listings");

  return NextResponse.json({ data }, { status: 200 });
}
