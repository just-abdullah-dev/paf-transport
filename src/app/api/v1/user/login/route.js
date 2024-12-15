import connectDB from "@/lib/db";
import importModels from "@/models";
import User from "@/models/User";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";
importModels();

// 5.
export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return resError("Invalid email format.");
    }

    if (password.length < 8) {
      return resError("Password must be at least 8 characters.");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return resError("Email is not registered.");
    }
    if (await user.comparePassword(password)) {
      const user2 = await User.findOne({ email })
        .select("-password")
        .populate("bus");
      return NextResponse.json(
        {
          success: true,
          message: "Logged in successfully.",
          data: {
            ...user2?._doc,
            token: await user.generateJWT(),
          },
        },
        { status: 200 }
      );
    } else {
      return resError("Invalid Password!");
    }
  } catch (error) {
    return resError(error?.message);
  }
}
