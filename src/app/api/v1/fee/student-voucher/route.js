import connectDB from "@/lib/db";
import { userAdminGuard, userBankGuard } from "@/middleware/user";
import Student from "@/models/Student";
import StudentVoucher from "@/models/StudentVoucher";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 32.
export async function PUT(req) {
  try {
    await connectDB();

    const { voucherId, status, notes } = await req.json();

    const authData1 = await userAdminGuard(req);
    const authData2 = await userBankGuard(req);
    if (!authData1?.success && !authData2?.success) {
      return resError(
        authData1?.success ? authData2?.message : authData1?.message
      );
    }

    if (!voucherId) {
      return resError("Voucher id is required.");
    }

    let stdVoucher = await StudentVoucher.findById(voucherId);
    if (!stdVoucher) {
      return resError("Student voucher was not found against id: " + voucherId);
    }

    stdVoucher.status = status || stdVoucher.status;
    stdVoucher.notes = notes || stdVoucher.notes;

    await stdVoucher.save();

    stdVoucher = await StudentVoucher.findById(voucherId).populate({
      path: "routeVoucher",
      populate: {
        path: "feeInterval",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Student voucher has been updated.",
        data: stdVoucher,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 33.
export async function DELETE(req) {
  try {
    await connectDB();
    const { voucherId } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!voucherId) {
      return resError("Student voucher id is required.");
    }

    const stdVoucher = await StudentVoucher.findByIdAndDelete(voucherId);
    if (!stdVoucher) {
      return resError("Student Voucher was not found against id: " + voucherId);
    }
    await Student.updateOne(
      { _id: stdVoucher.student },
      { $pull: { fees: stdVoucher._id } }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Voucher has been removed from student fees.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
