import connectDB from "@/lib/db";
import { userAdminGuard, userAuthGuard } from "@/middleware/user";
import Student from "@/models/Student";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 18.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { searchParams } = new URL(req.url);
    const routeId = searchParams.get("routeId");
    const busId = searchParams.get("busId");
    const stopId = searchParams.get("stopId");
    let query = {};
    if (routeId) {
      query = { ...query, route: routeId };
    }

    if (busId) {
      query = { ...query, bus: busId };
    }

    if (stopId) {
      query = { ...query, stop: stopId };
    }

    const data = await Student.find(query)
      .populate({
        path: "fees",
        model: "StudentVoucher",
        populate: {
          path: "routeVoucher",
          populate: {
            path: "feeInterval",
          },
        },
      })
      .populate({
        path: "route",
      })
      .populate({
        path: "bus",
      })
      .populate({
        path: "stop",
      });

    if (data.length == 0) {
      return resError(`No student was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 19.
export async function POST(req) {
  try {
    await connectDB();

    const { name, email, reg, program, department, stopId, routeId, busId } =
      await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!name || !email || !reg || !program) {
      return resError("One or more fields are missing.");
    }

    let std = await Student.findOne({ reg });
    if (std) {
      return resError(
        "Student with this registration number is already registered."
      );
    }

    std = await Student.create({
      name,
      email,
      reg,
      program,
      department,
    });
    std = await Student.findById(std?._id);
    if (routeId) {
      std.route = routeId;
    }
    if (busId) {
      std.bus = busId;
    }
    if (stopId) {
      std.stop = stopId;
    }
    await std.save();

    return NextResponse.json(
      {
        success: true,
        message: "Student registered.",
        data: std,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 20.
export async function PUT(req) {
  try {
    await connectDB();
    const {
      stdId,
      name,
      email,
      reg,
      program,
      department,
      stopId,
      routeId,
      busId,
    } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!stdId) {
      return resError("Student ID is required.");
    }
    let std = await Student.findById(stdId);
    if (!std) {
      return resError("Student was not found.");
    }
    
    std.name = name || std.name;
    std.email = email || std.email;
    std.reg = reg || std.reg;
    std.program = program || std.program;
    std.department = department || std.department;
    std.route = routeId || std.route;
    std.stop = stopId || std.stop;
    std.bus = busId || std.bus;

    await std.save();
    console.log(std);

    return NextResponse.json(
      {
        success: true,
        message: "Student detail has been updated.",
        data: std,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 21.
export async function DELETE(req) {
  try {
    await connectDB();
    const { stdId } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!stdId) {
      return resError("Student id is required.");
    }

    let std = await Student.findByIdAndDelete(stdId);
    if (!std) {
      return resError("Student was not found.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Student has been deleted.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
