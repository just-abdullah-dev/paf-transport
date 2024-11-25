import connectDB from "@/lib/db";
import { userAdminGuard, userAuthGuard } from "@/middleware/user";
import Bus from "@/models/Bus";
import Route from "@/models/Route";
import Stop from "@/models/Stop";
import User from "@/models/User";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 6.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const data = await Route.find()
      .populate({
        path: "buses",
        model: "Bus",
        populate: {
          path: "driver",
          select: "-password",
        },
      })
      .populate({
        path: "stops",
        model: "Stop",
      });

    if (data.length == 0) {
      return resError(`Routes not found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 7.
export async function POST(req) {
  try {
    await connectDB();

    const { name, road, city, buses, stops } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!name || !city || !road) {
      return resError("One or more fields are missing.");
    }

    let route = await Route.findOne({ name });
    if (route) {
      return resError("Route with this name already registerd.");
    }

    route = await Route.create({
      name,
      road,
      city,
    });

    let busesId = [];
    if (buses.length > 0) {
      busesId = await Promise.all(
        buses.map(async (item) => {
          const bus = await Bus.create({
            ...item,
            route: route?._id,
          });
          return bus._id; // Return the created bus ID
        })
      );
    }

    route.buses = busesId;

    let stopsId = [];

    if (stops.length > 0) {
      stopsId = await Promise.all(
        stops.map(async (item) => {
          const stop = await Stop.create({
            ...item,
            route: route?._id,
          });
          return stop._id; // Return the created stop ID
        })
      );
    }
    route.stops = stopsId;

    route = await Route.findById(route?._id)
      .populate({
        path: "buses",
        model: "Bus",
      })
      .populate({
        path: "stops",
        model: "Stop",
      });

    return NextResponse.json(
      {
        success: true,
        data: route,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 8.
export async function PUT(req) {
  try {
    await connectDB();
    const { routeId, name, road, city } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    let route = await Route.findById(routeId);
    if (!route) {
      return resError("Route was not found.");
    }

    route.road = road || route.road;
    route.city = city || route.city;
    route.name = name || route.name;

    await route.save();

    route = await Route.findById(route._id)
      .populate({
        path: "buses",
        model: "Bus",
      })
      .populate({
        path: "stops",
        model: "Stop",
      });
    return NextResponse.json(
      {
        success: true,
        message: "Route has been updated.",
        data: route,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 9.
export async function DELETE(req) {
  try {
    await connectDB();
    const { routeId } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!routeId) {
      return resError("Route id is required.");
    }

    const route = await Route.findByIdAndDelete(routeId);
    if (!route) {
      return resError("Route was not found.");
    }
    const buses = await Bus.find({ route: routeId });

    if (buses.length) {
      const userUpdates = buses.map(async (bus) => {
        if (bus.driver) {
          await User.findByIdAndUpdate(bus.driver, { bus: null });
        }
      });

      await Promise.all(userUpdates);
      console.log("User bus fields updated successfully.");
    } else {
      console.log("No buses found for the given route.");
    }
    await Bus.deleteAll({ route: routeId });

    await Stop.deleteAll({ route: routeId });

    return NextResponse.json(
      {
        success: true,
        message: "Route and its buses and stops has been deleted.",
        data: route,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
