import resError from "@/utils/resError";
import { sendMail } from "@/utils/sendMail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    const messageSend = `
    Dear Admin,<br>
    <br>${message}
    <br>
    <br>Best regards,<br>Name: ${name}<br>Email: ${email}<br>
    `;

    await sendMail(
      process.env.SUPPORT_EMAIL,
      `${name} contacted: ${subject}`,
      messageSend
    );

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting! We will get back to you asap.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
