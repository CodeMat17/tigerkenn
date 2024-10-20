import { supabaseService } from "@/utils/supabase/service";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { id, location } = await req.json();

  // validate
  if (!id || !location) {
    return NextResponse.json(
      { error: "ID and location are required." },
      { status: 400 }
    );
  }

  // update record in Supabase
  const { data, error } = await supabaseService
    .from("listings")
    .update({ location })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating location:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/admin/listings");

  return NextResponse.json({ data }, { status: 200 });
}
