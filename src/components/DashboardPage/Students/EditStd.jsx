import Button from "@/components/utils/Button";
import { Modal } from "@/components/utils/Modal";
import { toast } from "@/components/utils/Toast";
import { useAppSelector } from "@/lib/hooks";
import { getRoutes } from "@/services";
import convertTo12HourFormat from "@/utils/formatTime";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function EditStd({ data, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [std, setStd] = useState(data);
  const user = useAppSelector((state) => state.user);

  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState({});

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      const resData = await getRoutes(user.token);
      setRoutes(resData);
      let route = resData?.data.find((route) => route?._id === std?.route?._id);

      setSelectedRoute(route);
      setIsLoading(false);
    };
    main();
  }, []);

  const handleInputChange = (e) => {
    setStd({ ...std, [e.target.name]: e.target.value });
    if (e.target.name === "route") {
      setSelectedRoute(
        routes?.data.find((route) => route._id === e.target.value)
      );
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let body = {
        ...std,
        stdId: std?._id,
        routeId: std?.route,
        busId: std?.bus,
        stopId: std?.stop,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/student`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      if (data?.success) {
        toast.success(data?.message);
        setStd({});
        onClose();
        window.location.reload();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <Modal onClose={onClose} title={"Edit Student Details"}>
      <form
        onSubmit={handleSubmit}
        className={` ${
          isLoading
            ? " pointer-events-none animate-pulse "
            : " pointer-events-auto animate-none"
        } space-y-4`}
      >
        <div className=" grid grid-cols-2 gap-4 ">
          <div className="space-y-2 col-span-1 w-full">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={std?.name}
              onChange={handleInputChange}
              className="inputTag w-full"
              required
            />
          </div>

          <div className="space-y-2 col-span-1 w-full">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={std?.email}
              onChange={handleInputChange}
              className="inputTag w-full"
              required
            />
          </div>

          <div className="space-y-2 col-span-1 w-full">
            <label>Reg #</label>
            <input
              type="text"
              name="reg"
              value={std?.reg}
              onChange={handleInputChange}
              className="inputTag w-full"
              required
            />
          </div>
          <div className="space-y-2 col-span-1 w-full">
            <label>Program</label>
            <input
              type="text"
              name="program"
              value={std?.program}
              onChange={handleInputChange}
              className="inputTag w-full"
              required
            />
          </div>
          <div className="space-y-2 col-span-1 w-full">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={std?.department}
              onChange={handleInputChange}
              className="inputTag w-full"
              required
            />
          </div>

          <div>
            <label className=" font-semibold">Select Route:</label>
            <select
              name="route"
              value={std?.route?._id}
              onChange={handleInputChange}
              className="inputTag w-full"
            >
              <option value="">Select Route</option>
              {routes?.success ? (
                routes?.data.map((route) => (
                  <option key={route._id} value={route._id}>
                    {route?.name}, {route?.city} By {route?.road}.
                  </option>
                ))
              ) : (
                <option>{routes?.message}</option>
              )}
            </select>
          </div>

          {selectedRoute?._id && (
            <div>
              <label className=" font-semibold">Select Stop:</label>
              <select
                name="stop"
                value={std?.stop?._id}
                onChange={handleInputChange}
                className="inputTag w-full"
              >
                <option value="">Select Stop</option>

                {selectedRoute?.stops.length > 0 ? (
                  selectedRoute?.stops.map((stop) => (
                    <option key={stop?._id} value={stop?._id}>
                      {stop?.name} {convertTo12HourFormat(stop?.pickTime)}-
                      {convertTo12HourFormat(stop?.dropTime)}
                    </option>
                  ))
                ) : (
                  <option>No stop was found for this route.</option>
                )}
              </select>
            </div>
          )}
          {selectedRoute?._id && (
            <div>
              <label className=" font-semibold">Select Bus:</label>
              <select
                name="bus"
                value={std?.bus?._id}
                onChange={handleInputChange}
                className="inputTag w-full"
              >
                <option value="">Select Bus</option>

                {selectedRoute?.buses.length > 0 ? (
                  selectedRoute?.buses.map((bus) => (
                    <option key={bus?._id} value={bus?._id}>
                      {bus?.name} [{bus?.number}] (
                      {bus?.seats - bus?.totalStudents})
                    </option>
                  ))
                ) : (
                  <option>No bus was found for this route.</option>
                )}
              </select>
            </div>
          )}
        </div>
        <Button disabled={isLoading} type="submit" className="w-full ">
          {isLoading ? (
            <Loader2Icon className=" animate-spin mx-auto" />
          ) : (
            "Update Student"
          )}
        </Button>
      </form>
    </Modal>
  );
}
