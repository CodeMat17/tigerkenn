import { supabaseService } from "@/utils/supabase/service";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { id, baths } = await req.json();

  // validate
  if (!id || !baths) {
    return NextResponse.json(
      { error: "ID and baths are required." },
      { status: 400 }
    );
  }

  // update record in Supabase
  const { data, error } = await supabaseService
    .from("listings")
    .update({ baths })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating baths:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/admin/listings");

  return NextResponse.json({ data }, { status: 200 });
}
