import { NextRequest, NextResponse } from "next/server";
import  EmailTemplate  from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    const { data, error } = await resend.emails.send({
      from: `Website Client <support@tigerkennhomes.com>`,
      to: ["support@tigerkennhomes.com"],
      subject: `New message from ${name}`,
      react: EmailTemplate({ name, email, message }),
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json(
      { error: "An error occurred while sending the email" },
      { status: 500 }
    );
  }
}
