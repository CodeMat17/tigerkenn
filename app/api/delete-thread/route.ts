import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    const { error } = await supabaseService
      .from("topics")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/", "layout");
    revalidatePath("/thread/topics");

    return NextResponse.json(
      { message: "Thread deleted and database updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting thread", error },
      { status: 500 }
    );
  }
}
