"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import Button from "@/components/utils/Button";
import { getStudents, deleteStudent } from "@/services";
import convertTo12HourFormat from "@/utils/formatTime";
import RegisterStd from "./RegisterStd";
import { Search, SquarePen, Trash2 } from "lucide-react";
import { toast } from "@/components/utils/Toast";
import EditStd from "./EditStd";
import formatISODate from "@/utils/formatDate";

export default function Students() {
  const [openStdId, setOpenStdId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [editStd, setEditStd] = useState({});
  const [registerStd, setRegisterStd] = useState(false);

  const user = useAppSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [stds, setStds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  console.log(stds);

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      const data = await getStudents(user.token);
      setData(data);
      setStds(data?.data);
      setIsLoading(false);
    };
    main();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      // Reset stds to original data when search is empty
      setStds(data?.data);
    } else {
      // Filter stds based on search query
      const lowerCaseQuery = query.toLowerCase();
      const filteredstds = data?.data.filter(
        (std) =>
          std?.name.toLowerCase().includes(lowerCaseQuery) ||
          std?.reg.toLowerCase().includes(lowerCaseQuery) ||
          std?.email.toLowerCase().includes(lowerCaseQuery) ||
          std?.department.toLowerCase().includes(lowerCaseQuery) ||
          std?.program.toLowerCase().includes(lowerCaseQuery) ||
          std?.route?.name.toLowerCase().includes(lowerCaseQuery)
      );
      setStds(filteredstds);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Do you really want to delete this student?")) {
      const data = await deleteStudent(id, user.token);
      if (data?.success) {
        toast.success(data?.message);
        window.location.reload();
      } else {
        toast.error(data?.message);
      }
    }
  };

  const handleCloseModal = () => {
    setEditStd(null);
    setRegisterStd(false);
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
              {registerStd
                ? "Register a Student"
                : `Students (${data?.success ? stds.length : 0})`}
            </h1>
            
            {user?.role === "admin" &&
            <Button
              type="button"
              className=" text-base"
              variant={registerStd ? "danger" : "info"}
              onClick={() => {
                setRegisterStd(!registerStd);
              }}
            >
              {registerStd ? "Close" : "Register a Student"}
            </Button>}
          </div>

          <div>
            <div className="  mb-6 flex items-center justify-end relative">
              <input
                type="text"
                className="inputTag w-full"
                placeholder="Search by name, email, reg, program, or department"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Search className=" absolute right-3 " />
            </div>
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

                  {user?.role === "admin" && <th className="thTag">Actions</th>}
                </tr>
              </thead>
              {data?.success ? (
                stds.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-red-500 text-center w-full py-4"
                    >
                      No students were found matching the keyword: {searchQuery}
                    </td>
                  </tr>
                ) : (
                  <tbody>
                    {stds.map((std, index) => (
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
                          {user?.role === "admin" && (
                            <td className="thTag flex w-full h-full gap-2 items-center justify-around">
                              <SquarePen
                                onClick={() => {
                                  setEditStd(std);
                                }}
                                className=" cursor-pointer w-5 h-5"
                              />
                              <Trash2
                                onClick={() => handleDeleteStudent(std?._id)}
                                className=" cursor-pointer w-5 h-5 stroke-red-500"
                              />
                            </td>
                          )}
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
                                      <span className="font-semibold">
                                        Name:
                                      </span>{" "}
                                      {std?.stop?.name}
                                    </div>
                                    <div>
                                      <span className="font-semibold">
                                        Pick Time:
                                      </span>{" "}
                                      {convertTo12HourFormat(
                                        std?.stop?.pickTime
                                      )}
                                    </div>
                                    <div>
                                      <span className="font-semibold">
                                        Drop Time:
                                      </span>{" "}
                                      {convertTo12HourFormat(
                                        std?.stop?.dropTime
                                      )}
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
                                      <span className="font-semibold">
                                        Name:
                                      </span>{" "}
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
                                              fee?.routeVoucher?.feeInterval
                                                ?.from
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
                                            {fee?.routeVoucher?.totalAmount}
                                          </td>
                                          <td className="thTag">
                                            {fee?.routeVoucher?.finePerDay}
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
                                          <td className="thTag">
                                            {fee?.notes}
                                          </td>
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
                )
              ) : (
                <tr>
                  <td
                    colSpan="8"
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

      {/* edit std  */}
      {editStd?._id && <EditStd data={editStd} onClose={handleCloseModal} />}

      {/* register std  */}
      {registerStd && <RegisterStd onClose={handleCloseModal} />}
    </>
  );
}
