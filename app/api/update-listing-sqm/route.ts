import { supabaseService } from "@/utils/supabase/service";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { id, sqm } = await req.json();

  // validate
  if (!id || !sqm) {
    return NextResponse.json(
      { error: "ID and sqm are required." },
      { status: 400 }
    );
  }

  // update record in Supabase
  const { data, error } = await supabaseService
    .from("listings")
    .update({ sqm })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating sqm:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/admin/listings");

  return NextResponse.json({ data }, { status: 200 });
}
