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

// Define the type for the updateData object
type UpdateData = {
  title: string;
  desc: string;
  content?: string[]; // Optional content field for image URLs
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const files = formData.getAll("file") as File[];

    if (!title || !desc) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Prepare the data to update
    const updateData: UpdateData = { title, desc };

    // Fetch the existing content (images) from the Supabase record
    const { data, error: fetchError } = await supabaseService
      .from("hero")
      .select("content")
      .eq("id", id)
      .single(); // Ensure you get the single record

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const existingContent = data?.content || [];

    if (files.length > 0) {
      if (files.length > 10) {
        return NextResponse.json(
          { error: "Cannot upload more than 10 images" },
          { status: 400 }
        );
      }

      // Upload new files to Cloudinary
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

      // Append the new uploads to the existing content
      updateData.content = [...existingContent, ...uploadResults];
    } else {
      // If no new files, keep the existing content
      updateData.content = existingContent;
    }

    // Update Supabase with the new title, desc, and updated content
    const { error } = await supabaseService
      .from("hero")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    // Revalidate the paths to ensure up-to-date content
    revalidatePath("/", 'layout');
    revalidatePath("/admin");

    return NextResponse.json(
      { message: "Upload successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Uploading image failed", error);
    return NextResponse.json(
      { error: "Uploading image failed" },
      { status: 500 }
    );
  }
}
