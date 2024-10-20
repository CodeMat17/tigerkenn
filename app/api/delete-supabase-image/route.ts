import { supabaseService } from "@/utils/supabase/service";
import { NextResponse } from "next/server";
import {revalidatePath} from 'next/cache'

export async function DELETE(req: Request) {
  try {
    const { id, imgUrl } = await req.json(); // Parse the incoming JSON data

    if (!id || !imgUrl) {
      return NextResponse.json(
        { message: "ID and Image URL are required" },
        { status: 400 }
      );
    }

    // Fetch the current heroContent from the Supabase table
    const { data, error: fetchError } = await supabaseService
      .from("hero")
      .select("content")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const updatedImages = data.content.filter((img: string) => img !== imgUrl);

    // Update the heroContent array with the image removed
    const { error: updateError } = await supabaseService
      .from("hero")
      .update({ content: updatedImages })
      .eq("id", id)
      .select();

      if (updateError) throw updateError;
      
      revalidatePath('/admin', 'layout')

    return NextResponse.json(
      { message: "Image deleted and Supabase record updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting image", error },
      { status: 500 }
    );
  }
}
