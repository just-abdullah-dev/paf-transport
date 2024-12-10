"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import Button from "@/components/utils/Button";
import { getRoutes, deleteBus, deleteStop, deleteRoute } from "@/services";
import Link from "next/link";
import convertTo12HourFormat from "@/utils/formatTime";
import RegisterRoute from "./RegisterRoute";
import { Search, SquarePen, Trash2 } from "lucide-react";
import EditBus from "./EditBus";
import EditStop from "./EditStop";
import { toast } from "@/components/utils/Toast";
import EditRoute from "./EditRoute";
import AddBus from "./AddBus";
import AddStop from "./AddStop";

export default function Routes() {
  const [openRouteId, setOpenRouteId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [editRoute, setEditRoute] = useState({});
  const [editBus, setEditBus] = useState({});
  const [editStop, setEditStop] = useState({});

  const [addBus, setAddBus] = useState("");
  const [addStop, setAddStop] = useState("");
  const [registerRoute, setRegisterRoute] = useState(false);
  
  const user = useAppSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      const data = await getRoutes(user.token);
      setData(data);
      setRoutes(data?.data);
      setIsLoading(false);
    };
    main();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      // Reset routes to original data when search is empty
      setRoutes(data?.data);
    } else {
      // Filter routes based on search query
      const lowerCaseQuery = query.toLowerCase();
      const filteredRoutes = data?.data.filter(
        (route) =>
          route.name.toLowerCase().includes(lowerCaseQuery) ||
          route.city.toLowerCase().includes(lowerCaseQuery) ||
          route.road.toLowerCase().includes(lowerCaseQuery)
      );
      setRoutes(filteredRoutes);
    }
  };

  const handleDeleteRoute = async (id) => {
    if (window.confirm("Do you really want to delete this route?")) {
      const data = await deleteRoute(id, user.token);
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
    setEditRoute(null);
    setAddBus(false);
    setAddStop(false);
  };

  return (
    <>
      <div className="container mx-auto my-8 max-w-[90%] text-sm ">
        <div className="mb-8 w-full">
          <div
            className={` ${isLoading ? "animate-pulse " : ""}
            rounded-lg py-4 px-8 text-white font-[500] duration-300 transition-all cursor-
            bg-gradient-to-tl from-secondary to-primary bg-[length:110%_110%] hoverbg-[length:125%_125%] flex items-center justify-between mb-6 w-full`}
          >
            <h1 className=" text-2xl md:text-3xl font-semibold text-custom-gradien w-fit">
              {registerRoute
                ? "Register a Route"
                : `Routes (${data?.success ? routes.length : 0})`}
            </h1>
            <Button
              type="button"
className=" text-base"
              variant={registerRoute ? "danger" : "info"}
              onClick={() => {
                setRegisterRoute(!registerRoute);
              }}
            >
              {registerRoute ? "Close" : "Register a Route"}
            </Button>
          </div>
          {registerRoute ? (
            <RegisterRoute
              goBack={() => {
                setRegisterRoute(false);
                window.location.reload();
              }}
            />
          ) : (
            <div>
              <div className="  mb-6 flex items-center justify-end relative">
                <input
                  type="text"
                  className="inputTag w-1/3"
                  placeholder="Search by name, road, or city"
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
                    <th className="thTag">Road</th>
                    <th className="thTag">City</th>
                    <th className="thTag">Buses</th>
                    <th className="thTag">Stops</th>
                    <th className="thTag">Students</th>
                    <th className="thTag">Actions</th>
                  </tr>
                </thead>
                {data?.success ? (
                  routes.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-red-500 text-center w-full py-4"
                      >
                        No routes were found matching the keyword: {searchQuery}
                      </td>
                    </tr>
                  ) : (
                    <tbody>
                      {routes.map((route, index) => (
                        <>
                          <tr
                            key={route._id}
                            className={`cursor-pointer hover:bg-gray-300/80 ${
                              openRouteId === route._id ? "bg-gray-300/80" : ""
                            }`}
                            onClick={() => {
                              if (openRouteId === route._id) {
                                setOpenRouteId("");
                              } else {
                                setOpenRouteId(route._id);
                              }
                            }}
                          >
                            <td className="thTag">{index + 1}</td>
                            <td className="thTag">{route.name}</td>
                            <td className="thTag">{route.road}</td>
                            <td className="thTag">{route.city}</td>
                            <td className="thTag">{route.buses.length}</td>
                            <td className="thTag">{route.stops.length}</td>
                            <td className="thTag">{route.totalStudents}</td>
                            <td className="thTag flex w-full h-full gap-2 items-center justify-around">
                              <SquarePen
                                onClick={() => {
                                  setEditRoute(route);
                                }}
                                className=" cursor-pointer w-5 h-5"
                              />
                              <Trash2
                                onClick={() => handleDeleteRoute(route._id)}
                                className=" cursor-pointer w-5 h-5 stroke-red-500"
                              />
                            </td>
                          </tr>

                          {openRouteId === route._id && (
                            <tr className=" bg-gray-300/50">
                              <td colSpan="8" className="thTag">
                                {/* Buses Table */}
                                <div className=" flex items-center justify-between p-2">
                                  <h3 className="font-semibold text-base mb-2">
                                    Buses
                                  </h3>
                                  <Button 
                                  onClick={()=>{setAddBus(route._id)}}
                                  variant="info">Add Bus</Button>
                                </div>
                                {route.buses.length > 0 && (
                                  <>
                                    <table className="w-full border-collapse border border-gray-200 mb-4">
                                      <thead>
                                        <tr className="bg-gray-200 ">
                                          <th className="thTag">Sr #</th>
                                          <th className="thTag">Name</th>
                                          <th className="thTag">Number</th>
                                          <th className="thTag">Seats</th>
                                          <th className="thTag">Status</th>
                                          <th className="thTag">Students</th>
                                          <th className="thTag">Free Seats</th>
                                          <th className="thTag">Driver</th>
                                          <th className="thTag">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {route.buses.map((bus, index) => (
                                          <tr
                                            key={index}
                                            className=" hover:bg-gray-300/80"
                                          >
                                            <td className="thTag">
                                              {index + 1}
                                            </td>
                                            <td className="thTag">
                                              {bus?.name}
                                            </td>
                                            <td className="thTag">
                                              {bus?.number}
                                            </td>
                                            <td className="thTag">
                                              {bus?.seats}
                                            </td>
                                            <td className="thTag">
                                              {bus?.status}
                                            </td>
                                            <td className="thTag">
                                              {bus?.totalStudents}
                                            </td>
                                            <td className="thTag">
                                              {bus?.seats-bus?.totalStudents}
                                            </td>
                                            <td className="thTag">
                                              <p className=" font-semibold">
                                                {bus?.driver?.name}
                                              </p>
                                              <Link
                                                className=" text-blue-500 hover:underline"
                                                href={`tel:${bus?.driver?.phone}`}
                                              >
                                                {bus?.driver?.phone}
                                              </Link>
                                              <br />
                                              <Link
                                                className=" text-blue-500 hover:underline"
                                                href={`mailto:${bus?.driver?.email}`}
                                              >
                                                {bus?.driver?.email}
                                              </Link>
                                              <p>{bus?.driver?.address}</p>
                                            </td>
                                            
                                            <td className="thTag flex w-full h-full gap-2 items-center justify-around">
                                              <SquarePen
                                                onClick={() => {
                                                  setEditBus(bus);
                                                }}
                                                className=" cursor-pointer w-5 h-5"
                                              />
                                              <Trash2
                                                onClick={() =>
                                                  handleDeleteBus(bus._id)
                                                }
                                                className=" cursor-pointer w-5 h-5 stroke-red-500"
                                              />
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </>
                                )}

                                {/* Stops Table */}
                                <div className=" flex items-center justify-between p-2">
                                  <h3 className="font-semibold text-base mb-2">
                                    Stops
                                  </h3>
                                  <Button 
                                  onClick={()=>{setAddStop(route._id)}}
                                  variant="info">Add Stop</Button>
                                </div>
                                {route.stops.length > 0 && (
                                  <>
                                    <table className="w-full border-collapse border border-gray-200 mb-6">
                                      <thead>
                                        <tr className="bg-gray-200">
                                          <th className="thTag">Sr #</th>
                                          <th className="thTag">Name</th>
                                          <th className="thTag">Pick Time</th>
                                          <th className="thTag">Drop Time</th>
                                          <th className="thTag">Students</th>
                                          <th className="thTag">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {route.stops
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
                                              <td className="thTag">
                                                {stop?.totalStudents}
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
          )}
        </div>
      </div>

      {/* edit route  */}
      {editRoute?._id && (
        <EditRoute data={editRoute} onClose={handleCloseModal} />
      )}

      {/* add bus  */}
      {addBus && <AddBus routeId={addBus} onClose={handleCloseModal} />}
      {/* edit bus  */}
      {editBus?._id && <EditBus data={editBus} onClose={handleCloseModal} />}

      {/* add stop  */}
      {addStop && <AddStop routeId={addStop} onClose={handleCloseModal} />}
      {/* edit stop  */}
      {editStop?._id && <EditStop data={editStop} onClose={handleCloseModal} />}
    </>
  );
}
