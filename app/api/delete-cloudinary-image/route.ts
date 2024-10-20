import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export a named DELETE handler
export async function DELETE(req: NextRequest) {
  try {
    const { imgUrl } = await req.json();

    if (!imgUrl) {
      return NextResponse.json(
        { message: "Image URL is required" },
        { status: 400 }
      );
    }

    // Extract public ID from the Cloudinary URL (adjust this based on your Cloudinary URL structure)
    const publicId = imgUrl.split("/").pop()?.split(".")[0];

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json(
      { message: "Image deleted successfully from Cloudinary" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Cloudinary image:", error);
    return NextResponse.json(
      { message: "Failed to delete image", error },
      { status: 500 }
    );
  }
}
