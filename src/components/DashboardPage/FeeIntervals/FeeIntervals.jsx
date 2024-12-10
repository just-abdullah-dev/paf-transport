"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import Button from "@/components/utils/Button";
import { deleteFeeInterval, getFeeIntervals } from "@/services";
import { Search, SquarePen, Trash2 } from "lucide-react";
import { toast } from "@/components/utils/Toast";
import EditFeeInterval from "./EditFeeInterval";
import formatISODate from "@/utils/formatDate";
import { Modal } from "@/components/utils/Modal";
import CreateFeeInterval from "./CreateFeeInterval";

export default function FeeIntervals() {
  const [isLoading, setIsLoading] = useState(true);

  const [editFeeInterval, setEditFeeInterval] = useState({});
  const [errorModal, setErrorModal] = useState("");
  const [registerFeeInterval, setRegisterFeeInterval] = useState(false);

  const user = useAppSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [feeIntervals, setFeeIntervals] = useState([]);
  // const [searchYear, setSearchYear] = useState("");
  // const [searchMonth, setSearchMonth] = useState("");

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      const data = await getFeeIntervals(user.token, { year: "", month: "" });
      setData(data);
      setFeeIntervals(data?.data);
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

  const handleDeleteFeeInterval = async (id) => {
    if (window.confirm("Do you really want to delete this fee interval?")) {
      const data = await deleteFeeInterval(id, user.token);
      if (data?.success) {
        toast.success(data?.message);
        window.location.reload();
      } else {
        toast.error(data?.message);
      }
    }
  };

  const handleCloseModal = () => {
    setEditFeeInterval(null);
    setRegisterFeeInterval(false);
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
              {registerFeeInterval
                ? "Create a Fee Interval"
                : `Fee Intervals (${data?.success ? feeIntervals.length : 0})`}
            </h1>
            <Button
              type="button"
className=" text-base"
              variant={registerFeeInterval ? "danger" : "info"}
              onClick={() => {
                setRegisterFeeInterval(!registerFeeInterval);
              }}
            >
              {registerFeeInterval ? "Close" : "Create a Fee Interval"}
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
                  <th className="thTag">Voucher Status</th>
                  <th className="thTag">Actions</th>
                </tr>
              </thead>
              {data?.success ? (
                feeIntervals.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-red-500 text-center w-full py-4"
                    >
                      No fee intervals were found matching the keyword:{" "}
                      {searchYear}
                    </td>
                  </tr>
                ) : (
                  <tbody>
                    {feeIntervals.map((feeInterval, index) => (
                      <>
                        <tr
                          key={feeInterval._id}
                          className={`cursor-pointer hover:bg-gray-300/80 `}
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
                          <td className="thTag">
                            {feeInterval?.voucherStatus === "generated"
                              ? "Generated"
                              : "Not Generated"}
                          </td>
                          <td className="thTag flex w-full h-full gap-2 items-center justify-around">
                            <SquarePen
                              onClick={() => {
                                if (
                                  feeInterval?.voucherStatus === "generated"
                                ) {
                                  setErrorModal(
                                    "Vouchers for this fee interval has been generated. Delete the generated vouchers first."
                                  );
                                } else {
                                  setEditFeeInterval(feeInterval);
                                }
                              }}
                              className=" cursor-pointer w-5 h-5"
                            />
                            <Trash2
                              onClick={() =>
                                handleDeleteFeeInterval(feeInterval?._id)
                              }
                              className=" cursor-pointer w-5 h-5 stroke-red-500"
                            />
                          </td>
                        </tr>
                      </>
                    ))}
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

      {/* edit fee interval  */}
      {editFeeInterval?._id && (
        <EditFeeInterval data={editFeeInterval} onClose={handleCloseModal} />
      )}

      {/* register fee interval  */}
      {registerFeeInterval && <CreateFeeInterval onClose={handleCloseModal} />}
      {/* error modal  */}
      {errorModal && (
        <Modal
          title={"Info"}
          onClose={() => {
            setErrorModal("");
          }}
        >
          <p>{errorModal}</p>
        </Modal>
      )}
    </>
  );
}
