import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  try {
    const { password, code } = await req.json();

    // Validate the inputs
    if (!password || !code) {
      return NextResponse.json(
        { errors: "The fields are required." },
        { status: 400 }
      );
    }

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Exchange code for session error:", error);
        return NextResponse.json(
          { error: "Failed to exchange code for session." },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: "Code is required." }, { status: 400 });
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    // Check if the password update was successful
    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update password." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Password updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
