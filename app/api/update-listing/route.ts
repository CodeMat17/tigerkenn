import { supabaseService } from "@/utils/supabase/service";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const comments = JSON.parse(formData.get("comments") as string);
    const mainImg = formData.get("main_img") as File | null;
    const otherImgs = formData.getAll("other_imgs") as File[];

    if (!title || !desc) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const updateData = { title, desc, comments };

    // Fetch existing content from Supabase
    const { data: existingData, error: fetchError } = await supabaseService
      .from("hero")
      .select("main_img, other_imgs")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const existingOtherImgs = existingData?.other_imgs || [];

    // Upload main image to Cloudinary
    if (mainImg) {
      const buffer = Buffer.from(await mainImg.arrayBuffer());
      const mainUploadResult = await cloudinary.uploader.upload_stream(
        { folder: "tigerkenn-homes" },
        (error, result) => {
          if (error) throw new Error(error.message);
          return result?.secure_url;
        }
      );
      updateData.main_img = mainUploadResult.secure_url;
    } else {
      updateData.main_img = existingData.main_img;
    }

    // Upload other images to Cloudinary
    if (otherImgs.length > 0) {
      const otherUploadResults = await Promise.all(
        otherImgs.map(async (img) => {
          const buffer = Buffer.from(await img.arrayBuffer());
          const uploadResult = await new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "tigerkenn-homes" },
              (error, result) => {
                if (error) reject(error);
                resolve(result.secure_url);
              }
            );
            uploadStream.end(buffer);
          });
          return uploadResult;
        })
      );

      updateData.other_imgs = [...existingOtherImgs, ...otherUploadResults];
    } else {
      updateData.other_imgs = existingOtherImgs;
    }

    // Update Supabase with new data
    const { error: updateError } = await supabaseService
      .from("hero")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json(
      { message: "Update successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating hero:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
