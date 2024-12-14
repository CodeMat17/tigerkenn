import { supabaseService } from "@/utils/supabase/service";
import { v2 as cloudinary } from "cloudinary";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Rate Limiting
const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // per 60 seconds
});

export async function POST(req: NextRequest) {
  try {
    //  Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
    await rateLimiter.consume(ip);

    // Parse and validate input
    const { title, content, user_id, slug, tags } = await req.json();

    // Validate required fields
    if (!title || !content || !user_id || !tags || !slug) {
      return NextResponse.json(
        { error: "Fill add the required fields." },
        { status: 400 }
      );
    }

    // Sanitize HTML Utility
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
      KEEP_CONTENT: true, // Preserve even empty tags
    });

    // Parse sanitized content with JSDOM
    const dom = new JSDOM(sanitizedContent);
    const document = dom.window.document;

    const imgTags = Array.from(
      document.querySelectorAll("img")
    ) as HTMLImageElement[];

    // Iterate through img tags, process base64 images, and upload to Cloudinary
    for (const img of imgTags) {
      const src = img.getAttribute("src");
      if (src && src.startsWith("data:image")) {
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

    // Insert data into Supabase
    const { data, error } = await supabaseService
      .from("topics")
      .insert([{ title, content: updatedContent, user_id, slug, tags }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate path
    revalidatePath("/threads/topics", "layout");

    return new Response(
      JSON.stringify({ message: "Topic created successfully!", data }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
