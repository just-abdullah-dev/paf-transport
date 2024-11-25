import connectDB from "@/lib/db";
import { userAdminGuard, userAuthGuard } from "@/middleware/user";
import Bus from "@/models/Bus";
import User from "@/models/User";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 1.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    let query = {};

   if (role === "admin") {
      query = { role: "admin" };
    } else if (role === "driver") {
        query = { role: "driver" };
    } else if (role === "bank") {
        query = { role: "bank" };
      }

    const data = await User.find(query).select("-password").populate("bus");

    if (data.length == 0) {
      return resError(`Users not found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 2.
export async function POST(req) {
  try {
    await connectDB();

    const { email, password, name, role, phone, address, busId } =
      await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    let bus;
    if (role === "driver" && busId) {
      bus = await Bus.findById(busId);
      if (!bus) {
        return resError("Bus was not found.");
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return resError("Invalid email format.");
    }

    if (password.length < 8) {
      return resError("Password must be at least 8 characters.");
    }

    if (!name) {
      return resError("Name cannot be empty.");
    }

    if (!role) {
      return resError("Role cannot be empty.");
    }

    let user = await User.findOne({ email });
    if (user) {
      return resError("Email already registerd.");
    }

    user = await User.create({
      email,
      password,
      role,
      name,
      address,
      phone,
      bus: busId,
    });

    user = await User.findById(user?._id).select("-password").populate("bus");
    return NextResponse.json(
      {
        success: true,
        data: {
          ...user?._doc,
          token: await user.generateJWT(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 3.
export async function PUT(req) {
  try {
    await connectDB();
    const { userId, password, name, role, phone, address, busId } =
      await req.json();

    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!userId) {
      return resError("User ID is required.");
    }

    if (password && password.length < 8) {
      return resError("Password must be at least 8 characters.");
    }

    let user = await User.findById(userId);
    if (!user) {
      return resError("User was not found.");
    }

    user.password = password || user.password;
    user.name = name || user.name;
    user.role = role || user.role;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.bus = busId || user.bus;

    await user.save();

    user = await User.findById(user._id).select("-password").populate("bus");

    return NextResponse.json(
      {
        success: true,
        message: "User has been updated.",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 4.
export async function DELETE(req) {
  try {
    await connectDB();
    const { userId } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!userId) {
      return resError("User id is required.");
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return resError("User was not found.");
    }

    if(user.role === "driver"){
        let bus = await Bus.findById(user.bus);
        bus.driver = null;
        await bus.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "User has been deleted.",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
