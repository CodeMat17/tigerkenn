import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const position = formData.get("position") as string;
    const body = formData.get("body") as string;

    if (!name || !position || !body) {
      return NextResponse.json(
        { error: "All the fields are required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseService
      .from("reviews")
      .insert([{ name, position, body }])
    

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    revalidatePath(`/admin/reviews`);

    // Return a success response
    return NextResponse.json({ success: "Review added successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "An error occurred while adding the review.",
      },
      { status: 500 }
    );
  }
}
