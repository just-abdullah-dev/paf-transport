"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import Button from "@/components/utils/Button";
import { deleteGeneratedVouchers, getFeeIntervals } from "@/services";
import { Search, Trash2 } from "lucide-react";
import { toast } from "@/components/utils/Toast";
import formatISODate from "@/utils/formatDate";
import GenerateVouchers from "./GenerateVouchers";

export default function FeeVouchers() {
  const [isLoading, setIsLoading] = useState(true);
  const [generateVouchers, setGenerateVouchers] = useState(false);

  const user = useAppSelector((state) => state.user);
  // const [searchYear, setSearchYear] = useState("");
  // const [searchMonth, setSearchMonth] = useState("");
  const [data, setData] = useState(null);
  const [feeIntervals, setFeeIntervals] = useState([]);

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      const data = await getFeeIntervals(user.token, { year: "", month: "" });
      setData(data);
      setFeeIntervals(
        data?.data.filter((item) => item?.voucherStatus === "generated")
      );
      setIsLoading(false);
    };
    main();
  }, []);

  // const handleSearch = (year, monthName) => {
  //   if (!year && !monthName) {
  //     setFeeIntervals(data?.data);
  //     return;
  //   }

  //   // Helper function to map month names to numbers
  //   const getMonthNumber = (month) => {
  //     const months = [
  //       "jan", "feb", "mar", "apr", "may", "jun",
  //       "jul", "aug", "sep", "oct", "nov", "dec"
  //     ];
  //     return months.findIndex((m) => m.startsWith(month.toLowerCase())) + 1;
  //   };

  //   // Convert month name to month number
  //   const monthNumber = getMonthNumber(monthName);

  //   if (monthNumber === 0) {
  //     console.error("Invalid month name:", monthName);
  //     return;
  //   }

  //   const filteredFeeIntervals = data?.data.filter((feeInterval) => {
  //     const date = new Date(feeInterval?.route?.date); // Assuming route.date is an ISO string
  //     return (
  //       date.getFullYear() === parseInt(year, 10) &&
  //       date.getMonth() + 1 === monthNumber // getMonth() is 0-based
  //     );
  //   });

  //   // Update the state with the filtered data
  //   setFeeIntervals(filteredFeeIntervals);
  // };

  const handleDeleteGeneratedVouchers = async (id) => {
    if (
      window.confirm(
        "Do you really want to delete generated voucher of this interval?"
      )
    ) {
      const data = await deleteGeneratedVouchers(id, user.token);
      if (data?.success) {
        toast.success(data?.message);
        window.location.reload();
      } else {
        toast.error(data?.message);
      }
    }
  };

  const handleCloseModal = () => {
    setGenerateVouchers(false);
  };

  return (
    <>
      <div className="container mx-auto my-8 max-w-[95%] text-sm ">
        <div className="mb-8 w-full">
          <div
            className={` ${isLoading ? "animate-pulse " : ""}
            rounded-lg py-4 px-8 text-white font-[500] duration-300 transition-all cursor-
            bg-gradient-to-tl from-secondary to-primary bg-[length:110%_110%] hoverbg-[length:125%_125%] flex items-center justify-between mb-6 w-full`}
          >
            <h1 className=" text-2xl md:text-3xl font-semibold text-custom-gradien w-fit">
              {generateVouchers
                ? "Generate a vouchers"
                : `Generated Vouchers (${
                    data?.success ? feeIntervals.length : 0
                  })`}
            </h1>
            <Button
              type="button"
              variant={generateVouchers ? "danger" : "info"}
              onClick={() => {
                setGenerateVouchers(!generateVouchers);
              }}
            >
              {generateVouchers ? "Close" : "Generate a vouchers"}
            </Button>
          </div>

          <div>
            {/* search input div  */}
            {/* <div className="  mb-6 flex items-center justify-end relative gap-6">
              <div className="  flex items-center gap-6">
                <input
                  type="text"
                  className="inputTag w-full"
                  placeholder="Search by year"
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value)}
                />
                <input
                  type="text"
                  className="inputTag w-full"
                  placeholder="Search by month"
                  value={searchMonth}
                  onChange={(e) => setSearchMonth(e.target.value)}
                />
              </div>
              <Search
                onClick={()=>{handleSearch(searchYear, searchMonth)}}
                className=" hover:scale-[1.04] duration-300 transition-all cursor-pointer "
              />
            </div> */}
            <table
              className={` ${
                isLoading ? "animate-pulse " : ""
              } w-full border-collapse border border-gray-200 `}
            >
              <thead>
                <tr className="bg-gray-200">
                  <th className="thTag">Sr #</th>
                  <th className="thTag">From</th>
                  <th className="thTag">To</th>
                  <th className="thTag">No of months</th>
                  <th className="thTag">Name of months</th>
                  <th className="thTag">Issue Date</th>
                  <th className="thTag">Due Date</th>
                  <th className="thTag">Delete Generated Vouchers</th>
                </tr>
              </thead>
              {data?.success ? (
                feeIntervals.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-red-500 text-center w-full py-4"
                    >
                      No generated vouchers were found matching the keyword:{" "}
                      {searchYear}
                    </td>
                  </tr>
                ) : (
                  <tbody>
                    {feeIntervals.map((feeInterval, index) => {
                      return (
                        <>
                          <tr
                            key={feeInterval._id}
                            className={` hover:bg-gray-300/80 `}
                          >
                            <td className="thTag">{index + 1}</td>
                            <td className="thTag">
                              {formatISODate(feeInterval?.from)}
                            </td>
                            <td className="thTag">
                              {formatISODate(feeInterval?.to)}
                            </td>
                            <td className="thTag">{feeInterval?.noOfMonths}</td>
                            <td className="thTag">
                              {feeInterval?.namesOfMonths.length > 0
                                ? feeInterval?.namesOfMonths.join(", ")
                                : ""}
                            </td>
                            <td className="thTag">
                              {formatISODate(feeInterval?.issueDate)}
                            </td>
                            <td className="thTag">
                              {formatISODate(feeInterval?.dueDate)}
                            </td>
                            <td className="thTag flex w-full h-full gap-2 items-center justify-around">
                              <Trash2
                                onClick={() =>
                                  handleDeleteGeneratedVouchers(
                                    feeInterval?._id
                                  )
                                }
                                className=" cursor-pointer w-5 h-5 stroke-red-500"
                              />
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                )
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className=" text-red-500 text-center w-full py-4"
                  >
                    {data?.message}
                  </td>
                </tr>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* generate vouchers */}
      {generateVouchers && <GenerateVouchers onClose={handleCloseModal} />}
    </>
  );
}
