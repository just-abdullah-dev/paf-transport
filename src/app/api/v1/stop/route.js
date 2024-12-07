import connectDB from "@/lib/db";
import { userAdminGuard, userAuthGuard } from "@/middleware/user";
import Bus from "@/models/Bus";
import Route from "@/models/Route";
import Stop from "@/models/Stop";
import User from "@/models/User";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 14.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const { searchParams } = new URL(req.url);
    const routeId = searchParams.get("routeId");

    const data = await Stop.find(routeId ? { route: routeId } : {}).populate({
      path: "route",
    });

    if (data.length == 0) {
      return resError(`Stops not found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 15.
export async function POST(req) {
  try {
    await connectDB();

    const { routeId, name, pickTime, dropTime } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!name || !pickTime || !dropTime ||!routeId) {
      return resError("One or more fields are missing.");
    }

    let stop = await Stop.findOne({ name });
    if (stop) {
      return resError("Stop with this name is already registered.");
    }
    stop = await Stop.create({
      route: routeId,
      name,
      pickTime,
      dropTime,
    });

    let route = await Route.findById(routeId);
    route.stops.push(stop?._id);
    await route.save();

    stop = await Stop.findById(stop?._id).populate({
      path: "route",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Stop has been added to route.",
        data: stop,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 16.
export async function PUT(req) {
  try {
    await connectDB();
    const { stopId, name, pickTime, dropTime } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    let stop = await Stop.findById(stopId);
    if (!stop) {
      return resError("Stop was not found.");
    }

    stop.name = name || stop.name;
    stop.pickTime = pickTime || stop.pickTime;
    stop.dropTime = dropTime || stop.dropTime;

    await stop.save();

    stop = await Stop.findById(stop?._id).populate({
      path: "route",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Stop has been updated.",
        data: stop,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 17.
export async function DELETE(req) {
  try {
    await connectDB();
    const { stopId } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!stopId) {
      return resError("Stop id is required.");
    }

    let stop = await Stop.findByIdAndDelete(stopId);
    if (!stop) {
      return resError("stop was not found.");
    }

    let route = await Route.findById(stop?.route);
    route.stops = route.stops.filter((stop) => stop !== stopId);
    await route.save();

    return NextResponse.json(
      {
        success: true,
        message: "Stop has been removed from route.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
