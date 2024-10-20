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
    const id = formData.get("id") as string;
    const file = formData.get("file") as File;
    const currentUrl = formData.get("currentUrl") as string | null;

    if (!id || !file) {
      return NextResponse.json(
        { error: "No image or listing ID provided" },
        { status: 400 }
      );
    }

    // Fetch current image data from Supabase
    const { data, error } = await supabaseService
      .from("blogs")
      .select("img")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Blog image not found" },
        { status: 404 }
      );
    }

    // If replacing an image, remove the old image from Cloudinary
    if (currentUrl) {
      const publicId = currentUrl.split("/").pop()?.split(".")[0]; // Extract public_id from the URL
      if (publicId) {
        await cloudinary.uploader.destroy(`tigerkenn-homes/${publicId}`);
      }
    }

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
      .update({
        img: uploadResult.secure_url, // Update with new Cloudinary URL
      })
      .eq("id", id);

    if (updateError) {
      throw updateError;
    }

    revalidatePath(`/admin/blog/${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
