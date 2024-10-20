import { supabaseService } from "@/utils/supabase/service";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Configuration for Cloudinary
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
    const files = formData.getAll("files") as File[];
    const replaceIndex = formData.get("replaceIndex") as string | null;
    const currentUrl = formData.get("currentUrl") as string | null;

    if (!id || files.length === 0) {
      return NextResponse.json(
        { error: "Images are required" },
        { status: 400 }
      );
    }

    let updatedImages: string[] = [];

    // Fetch the current images from Supabase
    const { data, error } = await supabaseService
      .from("listings")
      .select("other_imgs")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    updatedImages = data.other_imgs || [];

    // If replacing an image, remove the old image from Cloudinary and the array
    if (replaceIndex !== null && currentUrl) {
      const publicId = currentUrl.split("/").pop()?.split(".")[0]; // Extract public_id from the URL
      if (publicId) {
        await cloudinary.uploader.destroy(`tigerkenn-homes/${publicId}`);
      }
      updatedImages[parseInt(replaceIndex)] = ""; // Remove old image placeholder
    }

    // Upload new images to Cloudinary
    const uploadResults: string[] = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        return new Promise<CloudinaryUploadResult>((resolve, reject) => {
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
        }).then((result) => result.secure_url);
      })
    );

    // Update the image array with new images
    if (replaceIndex) {
      updatedImages[parseInt(replaceIndex)] = uploadResults[0]; // Replace at specific index
    } else {
      updatedImages = updatedImages.concat(uploadResults); // Append new
    }

    // Save the new images to Supabase
    const { error: updateError } = await supabaseService
      .from("listings")
      .update({ other_imgs: updatedImages })
      .eq("id", id)
      .select();

    if (updateError) {
      return NextResponse.json({ error }, { status: 500 });
    }
    // Revalidate the /admin/listings path to update the cached data
    revalidatePath(`/admin/listings/${id}`);

    return NextResponse.json({
      success: true,
      message: "Files uploaded and listing updated successfully!",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error:
          "An error occurred while uploading files or updating the listing",
      },
      { status: 500 }
    );
  }
}
