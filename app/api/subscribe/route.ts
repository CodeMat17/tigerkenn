import SubscribeTemplate from "@/components/subscribe-template";
import { supabaseService } from "@/utils/supabase/service";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Check if the email already exists in Supabase
    const { data: existingEmail, error: checkError } = await supabaseService
      .from("subscribers")
      .select("id")
      .eq("email", email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // Handle unexpected errors from Supabase
      console.error("Supabase error:", checkError.message);
      throw checkError;
    }

    // If email exists, respond with a message that it is already subscribed
    if (existingEmail) {
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 400 }
      );
    }

    // Save the email to Supabase
    const { error: supabaseError } = await supabaseService
      .from("subscribers")
      .insert([{ email }]);

    if (supabaseError) {
      throw supabaseError;
    }

    // Send confirmation email
    const { data, error } = await resend.emails.send({
      from: `Tigerkenn Homes <support@tigerkennhomes.com>`,
      to: [email],
      subject: `Subscription Confirmation`,
      react: SubscribeTemplate({ email }),
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Error subscribing. Please try again." },
      { status: 500 }
    );
  }
}
