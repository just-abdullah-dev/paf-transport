"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import Button from "@/components/utils/Button";
import {
  getstds,
  deleteBus,
  deleteStop,
  deleteRoute,
  getStudents,
  deleteStudent,
} from "@/services";
import Link from "next/link";
import convertTo12HourFormat from "@/utils/formatTime";
import RegisterStd from "./RegisterStd";
import { Search, SquarePen, Trash2 } from "lucide-react";
import EditBus from "./EditBus";
import EditStop from "./EditStop";
import { toast } from "@/components/utils/Toast";
import EditStd from "./EditStd";
import AddBus from "./AddBus";
import AddStop from "./AddStop";

export default function Students() {
  const [openStdId, setOpenStdId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [editStd, setEditStd] = useState({});
  const [editBus, setEditBus] = useState({});
  const [editStop, setEditStop] = useState({});

  const [addBus, setAddBus] = useState("");
  const [addStop, setAddStop] = useState("");
  const [registerStd, setRegisterStd] = useState(false);

  const user = useAppSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [stds, setStds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleDeleteBus = async (id) => {
    if (window.confirm("Do you really want to delete this bus?")) {
      const data = await deleteBus(id, user.token);
      if (data?.success) {
        toast.success(data?.message);
        window.location.reload();
      } else {
        toast.error(data?.message);
      }
    }
  };

  const handleDeleteStop = async (id) => {
    if (window.confirm("Do you really want to delete this stop?")) {
      const data = await deleteStop(id, user.token);
      if (data?.success) {
        toast.success(data?.message);
        window.location.reload();
      } else {
        toast.error(data?.message);
      }
    }
  };

  const handleCloseModal = () => {
    setEditBus(null);
    setEditStop(null);
    setEditStd(null);
    setAddBus(false);
    setAddStop(false);

    setRegisterStd(false);
    window.location.reload();
  };

  return (
    <>
      <div className="container mx-auto my-8 max-w-[90%] ">
        <div className="mb-8 w-full">
          <div
            className={` ${isLoading ? "animate-pulse " : ""}
            rounded-lg py-4 px-8 text-white font-[500] duration-300 transition-all cursor-
            bg-gradient-to-tl from-secondary to-primary bg-[length:110%_110%] hoverbg-[length:125%_125%] flex items-center justify-between mb-6 w-full`}
          >
            <h1 className=" text-2xl md:text-3xl font-semibold text-custom-gradien w-fit">
              {registerStd
                ? "Register a Student"
                : `Students (${data?.success ? stds.length : 0})`}
            </h1>
            <Button
              type="button"
              variant={registerStd ? "danger" : "info"}
              onClick={() => {
                setRegisterStd(!registerStd);
              }}
            >
              {registerStd ? "Close" : "Register a Student"}
            </Button>
          </div>

          <div>
            <div className="  mb-6 flex items-center justify-end relative">
              <input
                type="text"
                className="inputTag w-[40%]"
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
                  <th className="thTag">Route</th>
                  <th className="thTag">Actions</th>
                </tr>
              </thead>
              {data?.success ? (
                stds.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
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
                          <td className="thTag">
                            {std?.route?.name
                              ? std?.route?.name
                              : "No route assigned."}
                          </td>
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
                        </tr>

                        {openStdId === std?._id && (
                          <tr className=" bg-gray-300/50">
                            <td colSpan="7" className="thTag">
                              <div className="space-y-4 px-8 py-4">
                                {/* Program Information */}
                                <div>
                                  <span className="font-semibold">
                                    Program:
                                  </span>{" "}
                                  {std?.program}
                                </div>

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

                              {/* fees Table 
                                <div className=" flex items-center justify-between p-2">
                                  <h3 className="font-semibold text-base mb-2">
                                    Stops
                                  </h3>
                                  <Button 
                                  onClick={()=>{setAddStop(std?._id)}}
                                  variant="info">Add Stop</Button>
                                </div>
                                {std?.stops.length > 0 && (
                                  <>
                                    <table className="w-full border-collapse border border-gray-200 mb-6">
                                      <thead>
                                        <tr className="bg-gray-200">
                                          <th className="thTag">Sr #</th>
                                          <th className="thTag">Name</th>
                                          <th className="thTag">Pick Time</th>
                                          <th className="thTag">Drop Time</th>
                                          <th className="thTag">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {std?.stops
                                          .sort((a, b) =>
                                            a.pickTime.localeCompare(b.pickTime)
                                          )
                                          .map((stop, index) => (
                                            <tr
                                              key={index}
                                              className=" hover:bg-gray-300/80"
                                            >
                                              <td className="thTag">
                                                {index + 1}
                                              </td>
                                              <td className="thTag">
                                                {stop?.name}
                                              </td>
                                              <td className="thTag">
                                                {convertTo12HourFormat(
                                                  stop?.pickTime
                                                )}
                                              </td>
                                              <td className="thTag">
                                                {convertTo12HourFormat(
                                                  stop?.dropTime
                                                )}
                                              </td>
                                              <td className="thTag flex w-full h-full gap-2 items-center justify-around">
                                                <SquarePen
                                                  onClick={() => {
                                                    setEditStop(stop);
                                                  }}
                                                  className=" cursor-pointer w-5 h-5"
                                                />
                                                <Trash2
                                                  onClick={() =>
                                                    handleDeleteStop(stop._id)
                                                  }
                                                  className=" cursor-pointer w-5 h-5 stroke-red-500"
                                                />
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
                                )} */}
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

      {/* edit std  */}
      {editStd?._id && <EditStd data={editStd} onClose={handleCloseModal} />}

      {/* register std  */}
      {registerStd && <RegisterStd onClose={handleCloseModal} />}
      {/* edit bus  */}
      {editBus?._id && <EditBus data={editBus} onClose={handleCloseModal} />}

      {/* add stop  */}
      {addStop && <AddStop routeId={addStop} onClose={handleCloseModal} />}
      {/* edit stop  */}
      {editStop?._id && <EditStop data={editStop} onClose={handleCloseModal} />}
    </>
  );
}
