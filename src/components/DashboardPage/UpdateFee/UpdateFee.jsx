"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { deleteVoucher, getStudents } from "@/services";
import { Search, SquarePen, Trash2 } from "lucide-react";
import { toast } from "@/components/utils/Toast";
import formatISODate from "@/utils/formatDate";
import convertTo12HourFormat from "@/utils/formatTime";
import EditFee from "./EditFee";
import { QRCodeScanner } from "../CheckFee/ScanQRCode";

export default function UpdateFee({ checkFee = false }) {
  const [openStdId, setOpenStdId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user);
  const [editFee, setEditFee] = useState(false);

  const [students, setStudents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchKeyword) {
      toast.error("Enter student name or registration #.");
      return;
    }

    setIsLoading(true);
    const data = await getStudents(user.token, { search: searchKeyword });
    if (data?.success) {
      setStudents(data?.data);
    } else {
      setError(`No students found matching ${searchKeyword}.`);
      setSearchKeyword("");
      setStudents([]);
    }
    setIsLoading(false);
  };

  const handleSearchReg = async (reg) => {
    if (!reg) {
      toast.error("Can't fetched the registration # from qr code.");
      return;
    }

    setIsLoading(true);
    const data = await getStudents(user.token, { reg });
    if (data?.success) {
      setStudents(data?.data);
    } else {
      setError(`No student found matching ${reg}.`);
      setSearchKeyword("");
      setStudents([]);
    }
    setIsLoading(false);
  };

  const handleDeleteVoucher = async (id) => {
    if (
      window.confirm(
        "Do you really want to remove this voucher for this student?"
      )
    ) {
      const data = await deleteVoucher(id, user.token);
      if (data?.success) {
        toast.success(data?.message);
        window.location.reload();
      } else {
        toast.error(data?.message);
      }
    }
  };

  return (
    <>
      <div className="container mx-auto my-8 max-w-[95%] text-sm ">
        <div className="mb-8 w-full">
          <div
            className={` ${isLoading ? "animate-pulse " : ""}
            rounded-lg py-4 px-8 text-white font-[500] duration-300 transition-all cursor-
            bg-gradient-to-tl from-secondary to-primary bg-[length:110%_110%] hover:bg-[length:125%_125%] flex md:items-center justify-between mb-6 w-full flex-col md:flex-row`}
          >
            <h1 className=" text-xl md:text-3xl font-semibold text-custom-gradien w-fit">
              {checkFee ? "Check" : "Update"} Fee
            </h1>
          </div>

          <div>
            {/* search input div  */}
            <div className="  mb-6 flex items-center justify-end relative gap-6">
              <div className="  flex items-center justify-end gap-6 w-full">
                <input
                  type="text"
                  className="inputTag w-full"
                  placeholder="Search by name, reg"
                  value={searchKeyword}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setStudents([]);
                    }
                    setSearchKeyword(e.target.value);
                  }}
                />
              </div>
              <Search
                onClick={handleSearch}
                className=" hover:scale-[1.04] duration-300 transition-all cursor-pointer "
              />
            </div>
            {checkFee && (
              <QRCodeScanner
                onError={(e) => {
                  console.log(e);
                }}
                onScan={(data) => {
                  setSearchKeyword(data);
                  setStudents([]);
                  handleSearchReg(data);
                }}
              />
            )}
            <table
              className={` ${
                isLoading ? "animate-pulse " : ""
              } w-full border-collapse border border-gray-200 `}
            >
              <thead>
                <tr className="bg-gray-200">
                  <th className="thTag">Sr #</th>
                  <th className="thTag">Name</th>
                  <th className="thTag">Reg #</th>
                  <th className="thTag">Email</th>
                  <th className="thTag">Department</th>
                  <th className="thTag">Program</th>
                  <th className="thTag">Route</th>
                </tr>
              </thead>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className={`${
                      error ? "text-red-600" : "text-ternary"
                    } text-center w-full py-4`}
                  >
                    {error
                      ? error
                      : "Search student by name or registration number."}
                  </td>
                </tr>
              ) : (
                <tbody>
                  {students.map((std, index) => (
                    <>
                      <tr
                        key={std._id}
                        className={`cursor-pointer hover:bg-gray-300/80 ${
                          openStdId === std._id ? "bg-gray-300/80" : ""
                        }`}
                        onClick={() => {
                          if (openStdId === std._id) {
                            setOpenStdId("");
                          } else {
                            setOpenStdId(std._id);
                          }
                        }}
                      >
                        <td className="thTag">{index + 1}</td>
                        <td className="thTag">{std?.name}</td>
                        <td className="thTag">{std?.reg}</td>
                        <td className="thTag">{std?.email}</td>
                        <td className="thTag">{std?.department}</td>
                        <td className="thTag">{std?.program}</td>
                        <td className="thTag">
                          {std?.route?.name
                            ? std?.route?.name
                            : "No route assigned."}
                        </td>
                      </tr>

                      {openStdId === std?._id && (
                        <tr className=" bg-gray-300/50">
                          <td colSpan="8" className="thTag">
                            <div className=" px-8 py-4 flex justify-around">
                              {/* Stop Information */}
                              {std?.stop?._id && (
                                <div className="flex flex-col space-y-2">
                                  <h1 className="text-xl font-semibold">
                                    Stop Information
                                  </h1>
                                  <div>
                                    <span className="font-semibold">Name:</span>{" "}
                                    {std?.stop?.name}
                                  </div>
                                  <div>
                                    <span className="font-semibold">
                                      Pick Time:
                                    </span>{" "}
                                    {convertTo12HourFormat(std?.stop?.pickTime)}
                                  </div>
                                  <div>
                                    <span className="font-semibold">
                                      Drop Time:
                                    </span>{" "}
                                    {convertTo12HourFormat(std?.stop?.dropTime)}
                                  </div>
                                </div>
                              )}

                              {/* Bus Information */}
                              {std?.bus?._id && (
                                <div className="flex flex-col space-y-2">
                                  <h1 className="text-xl font-semibold">
                                    Bus Information
                                  </h1>
                                  <div>
                                    <span className="font-semibold">Name:</span>{" "}
                                    {std?.bus?.name}
                                  </div>
                                  <div>
                                    <span className="font-semibold">
                                      Number:
                                    </span>{" "}
                                    {std?.bus?.number}
                                  </div>
                                </div>
                              )}
                            </div>

                            <h3 className="font-semibold text-center text-2xl my-4 ">
                              Fee Record
                            </h3>
                            {std?.fees.length > 0 ? (
                              <>
                                <table className="w-full border-collapse border border-gray-200 mb-6">
                                  <thead>
                                    <tr className="bg-gray-200">
                                      <th className="thTag">Sr #</th>
                                      <th className="thTag">Interval</th>

                                      <th className="thTag">
                                        Issue & Due Date
                                      </th>
                                      <th className="thTag">Total Amount</th>
                                      <th className="thTag">Fine Per Day</th>
                                      <th className="thTag">Status</th>
                                      <th className="thTag">Notes</th>
                                      {!checkFee && (
                                        <th className="thTag">Actions</th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {std?.fees.map((fee, index) => (
                                      <tr
                                        key={fee?._id}
                                        className={`cursor-pointer hover:bg-gray-300/80 `}
                                      >
                                        <td className="thTag">{index + 1}</td>
                                        <td className="thTag">
                                          {formatISODate(
                                            fee?.routeVoucher?.feeInterval?.from
                                          )}{" "}
                                          to{" "}
                                          {formatISODate(
                                            fee?.routeVoucher?.feeInterval?.to
                                          )}
                                          <br />
                                          {fee?.routeVoucher?.feeInterval
                                            ?.namesOfMonths.length > 0
                                            ? fee?.routeVoucher?.feeInterval?.namesOfMonths.join(
                                                ", "
                                              )
                                            : ""}{" "}
                                          (
                                          {
                                            fee?.routeVoucher?.feeInterval
                                              ?.noOfMonths
                                          }
                                          )
                                        </td>
                                        <td className="thTag">
                                          {formatISODate(
                                            fee?.routeVoucher?.feeInterval
                                              ?.issueDate
                                          )}{" "}
                                          -{" "}
                                          {formatISODate(
                                            fee?.routeVoucher?.feeInterval
                                              ?.dueDate
                                          )}
                                        </td>
                                        <td className="thTag">
                                          {fee?.routeVoucher?.totalAmount} Rs/-
                                        </td>
                                        <td className="thTag">
                                          {fee?.routeVoucher?.finePerDay} Rs/-
                                        </td>

                                        <td className="thTag">
                                          {fee?.status === "paid" ? (
                                            <span className=" text-green-600 font-semibold">
                                              Paid
                                            </span>
                                          ) : (
                                            <span className=" text-red-600 font-semibold">
                                              Not Paid
                                            </span>
                                          )}
                                        </td>

                                        <td className="thTag">{fee?.notes}</td>
                                        {!checkFee && (
                                          <td className="thTag flex w-full h-full gap-2 items-center justify-around">
                                            <SquarePen
                                              onClick={() => {
                                                console.log(fee);

                                                setEditFee({
                                                  ...fee,
                                                  name: std?.name,
                                                  reg: std?.reg,
                                                });
                                              }}
                                              className=" cursor-pointer w-5 h-5"
                                            />
                                            <Trash2
                                              onClick={() =>
                                                handleDeleteVoucher(fee?._id)
                                              }
                                              className=" cursor-pointer w-5 h-5 stroke-red-500"
                                            />
                                          </td>
                                        )}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                <div className=" flex items-center justify-center mb-4">
                                  <p className=" mx-auto">
                                    *--------------*--------------*--------------*--------------*--------------*--------------*
                                  </p>
                                </div>
                              </>
                            ) : (
                              <div className=" mx-auto text-center text-red-600 font-semibold">
                                No fee record was found.
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* update fee status */}
      {editFee?._id && (
        <EditFee
          onClose={() => {
            setEditFee({});
            handleSearch();
          }}
          data={editFee}
        />
      )}
    </>
  );
}
