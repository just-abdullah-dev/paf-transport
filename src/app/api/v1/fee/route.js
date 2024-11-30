import connectDB from "@/lib/db";
import { userAdminGuard, userAuthGuard } from "@/middleware/user";
import Fee from "@/models/Fee";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 22.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { searchParams } = new URL(req.url);
    const routeId = searchParams.get("routeId");
    let query = {};
    if (routeId) {
      query = { ...query, route: routeId };
    }


    const data = await Fee.find(query)
      .populate({
        path: "route",
      });

    if (data.length == 0) {
      return resError(`No fee was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 23.
export async function POST(req) {
  try {
    await connectDB();

    const { perMonth, perDay, routeId } =
      await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!perDay || !perMonth || !routeId) {
      return resError("One or more fields are missing.");
    }

    let fee = await Fee.findOne({ route: routeId });
    if (fee) {
      return resError(
        "Fee structure for this route is already registered."
      );
    }

    fee = await Fee.create({
      perDay,
      perMonth,
      route: routeId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Fee registered for route id: " + routeId,
        data: fee,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 24.
export async function PUT(req) {
  try {
    await connectDB();
    const {
      perMonth, perDay, feeId 
    } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!feeId) {
      return resError("Fee ID is required.");
    }
    let fee = await Fee.findById(feeId);
    if (!fee) {
      return resError("Fee was not found.");
    }

    fee.perMonth = perMonth || fee.perMonth;
    fee.perDay = perDay || fee.perDay;

    await fee.save();

    return NextResponse.json(
      {
        success: true,
        message: "Fee detail has been updated.",
        data: fee,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 25.
export async function DELETE(req) {
  try {
    await connectDB();
    const { feeId } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!feeId) {
      return resError("Fee ID is required.");
    }

    let fee = await Fee.findByIdAndDelete(feeId);
    if (!fee) {
      return resError("Fee was not found.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Fee has been deleted.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
