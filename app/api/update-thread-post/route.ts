import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}); 


export async function POST(req: NextRequest) {
  const { title, content, tags, id, newSlug } = await req.json();

  // Validate required fields
  if (
    !title?.trim() ||
    !content?.trim() ||
    !id ||
    !newSlug?.trim() ||
    !Array.isArray(tags) ||
    tags.length === 0
  ) {
    return NextResponse.json(
      { error: "Fill add the required fields." },
      { status: 400 }
    );
  }

  // Fetch existing content from Supabase
  const { data: existingData, error: fetchError } = await supabaseService
    .from("topics")
    .select("content")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json(
      { error: `Failed to fetch existing content: ${fetchError.message}` },
      { status: 500 }
    );
  }

  const existingContent = existingData?.content || "";

  // Sanitize HTML
  const { window } = new JSDOM("<!DOCTYPE html>");
  const purify = DOMPurify(window);

  const sanitizedContent = purify.sanitize(content, {
    ALLOWED_TAGS: [
      "p",
      "img",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "a",
      "br",
      "div",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "style"],
    KEEP_CONTENT: true,
  });

  const dom = new JSDOM(sanitizedContent);
  const document = dom.window.document;

  const existingDocument = new JSDOM(existingContent).window.document;

  const newImgTags = Array.from(
    document.querySelectorAll("img")
  ) as HTMLImageElement[];
  const oldImgTags = Array.from(
    existingDocument.querySelectorAll("img")
  ) as HTMLImageElement[];

  const oldSrcSet = new Set(oldImgTags.map((img) => img.src));
  const newSrcSet = new Set(newImgTags.map((img) => img.src));

  // Determine removed, added, and updated images
  const removedImages = Array.from(oldSrcSet).filter(
    (src) => !newSrcSet.has(src)
  );
  const addedImages = newImgTags.filter(
    (img) =>
      img.src && !oldSrcSet.has(img.src) && img.src.startsWith("data:image")
  );

  // Remove deleted images from Cloudinary
  for (const src of removedImages) {
    const publicId = src.split("/").pop()?.split(".")[0]; // Extract public ID
    if (publicId) {
      await cloudinary.uploader.destroy(`tigerkenn-homes/${publicId}`);
    }
  }

  // Upload new images to Cloudinary and update their src
  for (const img of addedImages) {
    const src = img.getAttribute("src");
    if (src) {
      const uploadResponse = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "tigerkenn-homes" }, (error, result) => {
              if (error) reject(error);
              else if (result && result.secure_url) {
                resolve({ secure_url: result.secure_url });
              } else {
                reject(new Error("Failed to upload image"));
              }
            })
            .end(Buffer.from(src.split(",")[1], "base64"));
        }
      );

      img.setAttribute("src", uploadResponse.secure_url);
    }
  }

  // Serialize updated HTML
  const updatedContent = document.body.innerHTML.replace(
    /<p><\/p>/g,
    "<p>&nbsp;</p>"
  );

  try {
    // update Supabase "topics" table
    const { data, error } = await supabaseService
      .from("topics")
      .update({
        title,
        content: updatedContent,
        tags,
        slug: newSlug,
        updated_on: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate cache
    revalidatePath("/thread/topics");

    // Return a success response
    return NextResponse.json(
      { message: "Topic updated successfully!", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
