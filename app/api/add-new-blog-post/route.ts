import { supabaseService } from "@/utils/supabase/service";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const slug = formData.get("slug") as string;
    const file = formData.get("file") as File;

    if (!title || !content || !file || !slug) {
      return NextResponse.json(
        { error: "All the fields are required" },
        { status: 400 }
      );
    }

    const published_at = new Date().toISOString();

    // Upload new image to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "tigerkenn-homes",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    // Update the image URL in Supabase
    const { error: updateError } = await supabaseService
      .from("blogs")
      .insert([
        {
          title,
          content,
          slug,
          published_at,
          img: uploadResult.secure_url, // Update with new Cloudinary URL
        },
      ])
      .select();

    if (updateError) {
      throw updateError;
    }

    revalidatePath(`/blog`);
    revalidatePath(`/admin/blog`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
