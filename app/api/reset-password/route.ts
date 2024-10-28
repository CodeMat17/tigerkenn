import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    //  Check if user exist already
    const { data: users, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (fetchError || !users) {
      return NextResponse.json(
        { error: "Email not found in the database" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return NextResponse.json(
        { error: "Failed to reset password" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "An error occurred while attempting to reset your password" },
      { status: 500 }
    );
  }
}
