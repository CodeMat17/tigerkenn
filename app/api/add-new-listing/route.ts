import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service"; // Adjust the path to your Supabase service
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

// Cloudinary configuration (ensure env variables are set in .env file)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const img = formData.get("img") as Blob; // Main image
    const desc = formData.get("desc") as string;
    const beds = formData.get("beds") as string;
    const baths = formData.get("baths") as string;
    const sqm = formData.get("sqm");
    const price = formData.get("price");
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;
    const files = formData.getAll("files") as File[]; // 'other_imgs' field

    // Validation: ensure required fields are present
    if (
      !title ||
      !location ||
      !img ||
      !desc ||
      !beds ||
      !baths ||
      !sqm ||
      !price ||
      !category ||
      !status
    ) {
      return new Response(
        JSON.stringify({ error: "Fill the required fields" }),
        { status: 400 }
      );
    }

    // 1. Upload the main `img` to Cloudinary
    const bytes = await img.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imgUploadResponse = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "tigerkenn-homes" }, // Specify folder in Cloudinary
        (error, result) => {
          if (error) reject(error);
          resolve(result?.secure_url || "");
        }
      );
      uploadStream.end(buffer);
    });

    // 2. Upload `other_imgs` to Cloudinary and store URLs (limit to 4 images)
    const uploadResults: string[] = await Promise.all(
      files.map(async (file) => {
       

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        return new Promise<CloudinaryUploadResult>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "tigerkenn-homes" }, // Specify folder in Cloudinary
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

    // Filter out any empty string results from failed uploads
    // const filteredUploadResults = uploadResults.filter((url) => url !== "");

    // 3. Insert the listing into Supabase
    const { error } = await supabaseService
      .from("listings")
      .insert([
        {
          title,
          location,
          img: imgUploadResponse, // Cloudinary URL for main image
          other_imgs: uploadResults, // Array of Cloudinary URLs for other images (or null if none)
          beds: parseInt(beds),
          baths: parseInt(baths),
          sqm: parseInt(sqm as string), // Parse sqm to float
          price: parseInt(price as string), // Parse price to float
          desc,
          category,
          status,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    // Optionally revalidate paths for dynamic content
    revalidatePath("/admin/listings");
    revalidatePath("/listings");

    return NextResponse.json(
      { message: "Listing added successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading images or inserting into database:", error);
    return NextResponse.json(
      { error: "Failed to upload or insert data" },
      { status: 500 }
    );
  }
}
