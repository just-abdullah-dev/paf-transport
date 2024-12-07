import connectDB from "@/lib/db";
import { userAdminGuard, userAuthGuard } from "@/middleware/user";
import Bus from "@/models/Bus";
import Route from "@/models/Route";
import User from "@/models/User";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 10.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const data = await Bus.find()
      .populate({
        path: "route",
      })
      .populate({
        path: "driver",
        select: "-password",
      });

    if (data.length == 0) {
      return resError(`Buses not found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 11.
export async function POST(req) {
  try {
    await connectDB();

    const { routeId, name, number, driver, seats, status } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!name || !number || !seats || !driver) {
      return resError("One or more fields are missing.");
    }

    let bus = await Bus.findOne({ name });
    if (bus) {
      return resError("Bus with this name is already registered.");
    }

    bus = await Bus.findOne({ driver });
    if (bus) {
      return resError("Driver already assigned.");
    }

    bus = await Bus.create({
      route: routeId,
      name,
      number,
      driver,
      seats,
      status,
    });
    
    if (routeId) {
      let route = await Route.findById(routeId);
      if (!route) {
        return resError("Route was not found.");
      }
      route.buses.push(bus?._id);
      await route.save();
    }

    let user = await User.findById(driver);
    user.bus = bus?._id;
    await user.save();

    bus = await Bus.findById(bus?._id).populate({
      path: "driver",
      select: "-password",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Bus has been added to route.",
        data: bus,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 12.
export async function PUT(req) {
  try {
    await connectDB();
    const { busId, name, number, driver, seats, status } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!busId) {
      return resError("Bus ID is required.");
    }
    let bus = await Bus.findById(busId);
    if (!bus) {
      return resError("Bus was not found.");
    }

    bus.name = name || bus.name;
    bus.number = number || bus.number;
    bus.seats = seats || bus.seats;
    bus.status = status || bus.status;

    if (bus.driver !== driver && driver) {
      let user = await User.findById(bus.driver);
      user.bus = null;
      await user.save();

      bus.driver = driver;
      user = await User.findById(driver);
      user.bus = bus?._id;
      await user.save();
    }
    await bus.save();

    bus = await Bus.findById(bus?._id).populate({
      path: "driver",
      select: "-password",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Bus has been updated.",
        data: bus,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 13.
export async function DELETE(req) {
  try {
    await connectDB();
    const { busId } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!busId) {
      return resError("Bus id is required.");
    }

    let bus = await Bus.findById(busId);
    if (!bus) {
      return resError("Bus was not found.");
    }

    let route = await Route.findById(bus.route);
    if (!route) {
      return resError("Route was not found.");
    }
    route.buses = route.buses.filter((bus) => bus !== busId);
    await route.save();

    if (bus.driver) {
      let user = await User.findById(bus.driver);
      if (!user) {
        return resError("User was not found.");
      }
      user.bus = null;
      await user.save();
    }

    await Bus.findByIdAndDelete(busId);

    return NextResponse.json(
      {
        success: true,
        message: "Bus has been removed from route.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
