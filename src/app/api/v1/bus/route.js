import connectDB from "@/lib/db";
import { userAdminGuard, userAuthGuard } from "@/middleware/user";
import Bus from "@/models/Bus";
import Route from "@/models/Route";
import Student from "@/models/Student";
import User from "@/models/User";
import resError from "@/utils/resError";
import { model } from "mongoose";
import { NextResponse } from "next/server";

// 10.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { searchParams } = new URL(req.url);
    const busId = searchParams.get("busId");
    let data;

    if (busId) {
      // Fetch a single bus by ID
      data = await Bus.findById(busId).populate({
        path: "route",
        populate: {
          path: "stops",
          model: "Stop",
        },
      });

      if (!data) {
        return resError(`Bus not found.`);
      }

      // Calculate total students for the bus
      const studentsInBus = await Student.find({ bus: data._id });
      const totalStudents = studentsInBus.length;

      // Update stops in the route with total students
      const stopsWithStudents = await Promise.all(
        data.route.stops.map(async (stop) => {
          const studentsAtStop = await Student.find({ stop: stop._id });
          return {
            ...stop._doc,
            totalStudents: studentsAtStop.length,
          };
        })
      );

      // Return the updated bus with total students and updated stops
      return NextResponse.json(
        {
          success: true,
          data: {
            ...data._doc,
            totalStudents,
            route: {
              ...data.route._doc,
              stops: stopsWithStudents,
            },
          },
        },
        { status: 200 }
      );
    } else {
      // Fetch all buses
      data = await Bus.find()
        .populate({
          path: "route",
        })
        .populate({
          path: "driver",
          select: "-password",
        });

      if (data.length === 0) {
        return resError(`Buses not found.`);
      }

      // Update each bus with total students
      const busesWithStudents = await Promise.all(
        data.map(async (bus) => {
          const studentsInBus = await Student.find({ bus: bus._id });
          const totalStudents = studentsInBus.length;

          // Update stops in the route with total students
          const stopsWithStudents = await Promise.all(
            bus.route.stops.map(async (stop) => {
              const studentsAtStop = await Student.find({ stop: stop._id });
              return {
                ...stop._doc,
                totalStudents: studentsAtStop.length,
              };
            })
          );

          return {
            ...bus._doc,
            totalStudents,
            route: {
              ...bus.route._doc,
              stops: stopsWithStudents,
            },
          };
        })
      );

      return NextResponse.json(
        { success: true, data: busesWithStudents },
        { status: 200 }
      );
    }
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
