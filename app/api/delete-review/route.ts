import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const formData = await req.formData();

  const id = formData.get("id") as string;

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    const { error } = await supabaseService
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/admin/reviews", 'layout');

    return NextResponse.json(
      { message: "Review deleted and database updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting review", error },
      { status: 500 }
    );
  }
}
