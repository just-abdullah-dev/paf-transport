import connectDB from "@/lib/db";
import { userAdminGuard, userAuthGuard } from "@/middleware/user";
import FeeInterval from "@/models/FeeInterval";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 26.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get("year"), 10);
    const month = parseInt(searchParams.get("month"), 10);

    let query = {};

    if (year || month) {
      const dateFilters = {};
      if (year) {
        dateFilters.from = { $gte: new Date(`${year}-01-01T00:00:00Z`) };
        dateFilters.to = { $lte: new Date(`${year}-12-31T23:59:59Z`) };
      }
      if (month) {
        // Ensure month is between 1 and 12
        if (month < 1 || month > 12) {
          return resError("Invalid month value. It must be between 1 and 12.");
        }

        const startDate = new Date(
          `${year || new Date().getFullYear()}-${month
            .toString()
            .padStart(2, "0")}-01T00:00:00Z`
        );
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        endDate.setSeconds(endDate.getSeconds() - 1);

        dateFilters.from = { ...dateFilters.from, $gte: startDate };
        dateFilters.to = { ...dateFilters.to, $lte: endDate };
      }

      query = { ...query, ...dateFilters };
    }

    const data = await FeeInterval.find(query);

    if (data.length == 0) {
      return resError(`No fee interval was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 27.
export async function POST(req) {
  try {
    await connectDB();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const { from, to, namesOfMonths, issueDate, dueDate } = await req.json();

    if (!from || !to || !issueDate || !dueDate) {
      return resError("One or more fields are missing.");
    }
    // Parse dates
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const issueDateParsed = new Date(issueDate);
    const dueDateParsed = new Date(dueDate);

    // Validate date relationships
    if (fromDate >= toDate) {
      return resError("'from' date must be earlier than 'to' date.");
    }
    if (issueDateParsed >= dueDateParsed) {
      return resError("'issueDate' must be earlier than 'dueDate'.");
    }

    let noOfMonths = 0;
    let current = new Date(fromDate);

    while (current < toDate) {
      const daysInMonth = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        0
      ).getDate();
      const remainingDays = (toDate - current) / (1000 * 60 * 60 * 24);

      if (remainingDays >= daysInMonth - 5) {
        noOfMonths += 1; // Full month
        current.setMonth(current.getMonth() + 1);
      } else if (remainingDays > 0) {
        noOfMonths += remainingDays / daysInMonth; // Partial month
        break;
      }
    }

    console.log(from, to, noOfMonths, namesOfMonths, issueDate, dueDate);

    const feeInterval = await FeeInterval.create({
      from,
      to,
      noOfMonths: Math.round(noOfMonths),
      namesOfMonths,
      issueDate,
      dueDate,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Fee interval has been created.",
        data: feeInterval,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 28.
export async function PUT(req) {
  try {
    await connectDB();
    const {
      feeIntervalId,
      from,
      to,
      noOfMonths,
      namesOfMonths,
      issueDate,
      dueDate,
    } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!feeIntervalId) {
      return resError("Fee interval id is required.");
    }
    let feeInterval = await FeeInterval.findById(feeIntervalId);
    if (!feeInterval) {
      return resError("Fee Interval was not found.");
    }

    feeInterval.from = from || feeInterval.from;
    feeInterval.to = to || feeInterval.to;
    feeInterval.issueDate = issueDate || feeInterval.issueDate;
    feeInterval.dueDate = dueDate || feeInterval.dueDate;
    feeInterval.noOfMonths = noOfMonths || feeInterval.noOfMonths;
    feeInterval.namesOfMonths = namesOfMonths || feeInterval.namesOfMonths;

    await feeInterval.save();

    return NextResponse.json(
      {
        success: true,
        message: "Fee interval has been updated.",
        data: feeInterval,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 29.
export async function DELETE(req) {
  try {
    await connectDB();
    const { feeIntervalId } = await req.json();

    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (!feeIntervalId) {
      return resError("Fee ID is required.");
    }

    let feeInterval = await FeeInterval.findById(feeIntervalId);
    if (!feeInterval) {
      return resError("Fee Interval was not found.");
    }

    if (feeInterval.voucherStatus === "generated") {
      return resError(
        "Can't delete it. Fee interval has been used for generating vouchers."
      );
    }
    await FeeInterval.findByIdAndDelete(feeIntervalId);

    return NextResponse.json(
      {
        success: true,
        message: "Fee Interval has been deleted.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
