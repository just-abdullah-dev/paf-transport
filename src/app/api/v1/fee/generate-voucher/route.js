import connectDB from "@/lib/db";
import { userAdminGuard } from "@/middleware/user";
import Fee from "@/models/Fee";
import FeeInterval from "@/models/FeeInterval";
import RouteVoucher from "@/models/RouteVoucher";
import Student from "@/models/Student";
import StudentVoucher from "@/models/StudentVoucher";
import { informStudentAboutDeletedVoucher } from "@/utils/informStudentAboutDeletedVoucher";
import resError from "@/utils/resError";
import { sendVoucherToStudent } from "@/utils/sendVoucherToStudent";
import { NextResponse } from "next/server";

// 30.
export async function POST(req) {
  try {
    await connectDB();

    const { feeIntervalId } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!feeIntervalId) {
      return resError("Fee interval is required.");
    }

    let feeInterval = await FeeInterval.findById(feeIntervalId);
    if (!feeInterval) {
      return resError(
        "Fee Interval was not found against id: " + feeIntervalId
      );
    }

    if (feeInterval.voucherStatus === "generated") {
      return resError("Vouchers are already generated for this fee interval.");
    }

    const fees = await Fee.find().populate("route");
    if (fees.length === 0) {
      return resError("No fee was found.");
    }

    // Collect all promises
    const feePromises = fees.map(async (fee) => {
      const routeVoucher = await RouteVoucher.create({
        route: fee.route?._id,
        fee: fee._id,
        feeInterval: feeInterval._id,
        totalAmount: Number(feeInterval.noOfMonths) * Number(fee.perMonth),
        finePerDay: Number(fee.perDay),
      });

      const stds = await Student.find({ route: fee.route?._id }).populate(
        "bus"
      );
      if (stds.length === 0) {
        console.log("No students was found for route id: " + fee.route?._id);
      } else {
        const studentPromises = stds.map(async (std) => {
          const stdVoucher = await StudentVoucher.create({
            student: std._id,
            routeVoucher: routeVoucher._id,
          });
          await Student.updateOne(
            { _id: std._id },
            { $addToSet: { fees: stdVoucher._id } }
          );
          await sendVoucherToStudent({
            name: std?.name,
            email: std?.email,
            program: std?.program,
            reg: std?.reg,
            voucherId: stdVoucher._id,
            route: `${fee.route?.name} (${fee.route?.road}, ${fee.route?.city})`,
            bus: std?.bus,
            feeIntervals: [
              {
                ...feeInterval._doc,
                totalAmount: routeVoucher?.totalAmount,
                finePerDay: routeVoucher?.finePerDay,
              },
            ],
          });
        });
        await Promise.all(studentPromises); // Wait for all student promises
      }
    });

    // Wait for all fee-related promises
    await Promise.all(feePromises);
    feeInterval.voucherStatus = "generated";
    await feeInterval.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Voucher has been generated for all routes and issued to all students.",
        data: feeInterval,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 31.
export async function DELETE(req) {
  try {
    await connectDB();
    const { feeIntervalId } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!feeIntervalId) {
      return resError("Fee interval ID is required.");
    }

    let feeInterval = await FeeInterval.findById(feeIntervalId);
    if (!feeInterval) {
      return resError(
        "Fee Interval was not found against id: " + feeIntervalId
      );
    }

    if (feeInterval.voucherStatus === "not-generated") {
      return resError("Fee interval do not have any voucher generated yet.");
    }

    const routeVouchers = await RouteVoucher.find({
      feeInterval: feeIntervalId,
    })
      .populate("fee")
      .populate({
        path: "route",
      });
    if (routeVouchers.length === 0) {
      return resError(
        "No route vouchers was found against this fee interval: " +
          feeIntervalId
      );
    }

    // Collect all promises
    const routeVouchersPromises = routeVouchers.map(async (rVoucher) => {
      await RouteVoucher.findByIdAndDelete(rVoucher._id);

      const stds = await Student.find({ route: rVoucher.route?._id }).populate("bus");
      if (stds.length === 0) {
        console.log("No students was found for route id: " + rVoucher.route?._id);
      } else {
        const studentPromises = stds.map(async (std) => {
          const stdVoucher = await StudentVoucher.findOneAndDelete({
            routeVoucher: rVoucher._id,
            student: std._id,
          });
          await Student.updateOne(
            { _id: std._id },
            { $pull: { fees: stdVoucher._id } }
          );
          await informStudentAboutDeletedVoucher({
            name: std?.name,
            email: std?.email,
            program: std?.program,
            reg: std?.reg,
            voucherId: stdVoucher._id,
            route: `${rVoucher.route?.name} (${rVoucher.route?.road}, ${rVoucher.route?.city})`,
            bus: std?.bus,
            feeIntervals: [
              {
                ...feeInterval._doc,
                totalAmount: rVoucher?.totalAmount,
                finePerDay: rVoucher?.finePerDay,
              },
            ],
          });
        });
        await Promise.all(studentPromises); // Wait for all student promises
      }
    });

    // Wait for all fee-related promises
    await Promise.all(routeVouchersPromises);

    feeInterval.voucherStatus = "not-generated";
    await feeInterval.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Voucher has been removed from all students of mentioned fee interval.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
