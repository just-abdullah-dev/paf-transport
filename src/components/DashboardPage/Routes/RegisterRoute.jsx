"use client";
import Button from "@/components/utils/Button";
import { toast } from "@/components/utils/Toast";
import { useAppSelector } from "@/lib/hooks";
import { getAvailableDrivers } from "@/services";
import convertTo12HourFormat from "@/utils/formatTime";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

function RegisterRoute({ goBack }) {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector((state) => state.user);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      const data = await getAvailableDrivers(user.token);
      setDrivers(data);
      setIsLoading(false);
    };
    main();
  }, []);

  const [route, setRoute] = useState({
    name: "",
    road: "",
    city: "",
    stops: [],
    buses: [],
  });

  const [stop, setStop] = useState({ name: "", pickTime: "", dropTime: "" });
  const [bus, setBus] = useState({
    name: "",
    number: "",
    status: "active",
    seats: "",
    driver: "",
  });

  // Handle input changes for route, stops, and buses
  const handleInputChange = (e) => {
    setRoute({ ...route, [e.target.name]: e.target.value });
  };

  const handleStopChange = (e) => {
    setStop({ ...stop, [e.target.name]: e.target.value });
  };

  const handleBusChange = (e) => {
    setBus({ ...bus, [e.target.name]: e.target.value });
  };

  // Add stop to stops array
  const addStop = () => {
    if (stop.name && stop.pickTime && stop.dropTime) {
      setRoute((prev) => ({ ...prev, stops: [...prev.stops, stop] }));
      setStop({ name: "", pickTime: "", dropTime: "" }); // Reset stop form
    }
  };

  // Remove stop by index
  const removeStop = (index) => {
    setRoute((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }));
  };

  // Add bus to buses array
  const addBus = () => {
    if (bus.name && bus.number && bus.status && bus.seats) {
      if (
        bus.driver &&
        route.buses.some((existingBus) => existingBus.driver === bus.driver)
      ) {
        toast.error(`Selected driver is already assigned to another bus.`);
        return;
      }
      setRoute((prev) => ({ ...prev, buses: [...prev.buses, bus] }));
      setBus({
        name: "",
        number: "",
        status: "active",
        seats: "",
        driver: "",
      });
    }
  };

  // Remove bus by index
  const removeBus = (index) => {
    setRoute((prev) => ({
      ...prev,
      buses: prev.buses.filter((_, i) => i !== index),
    }));
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      console.log(route);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/route`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(route),
        }
      );
      const data = await response.json();
      if (data?.success) {
        toast.success(data?.message);
        setRoute({});
        goBack();
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
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <div className=" flex  gap-4 ">
        <div className="space-y-2 w-full">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={route.name}
            onChange={handleInputChange}
            className="inputTag w-full"
            required
          />
        </div>

        <div className="space-y-2 w-full">
          <label>Road</label>
          <input
            type="text"
            name="road"
            value={route.road}
            onChange={handleInputChange}
            className="inputTag w-full"
            required
          />
        </div>

        <div className="space-y-2 w-full">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={route.city}
            onChange={handleInputChange}
            className="inputTag w-full"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3>Stops</h3>
        <div className=" grid grid-cols-3  gap-4 ">
          <div>
            <label className=" labelTag block">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Stop Name"
              value={stop.name}
              onChange={handleStopChange}
              className="inputTag w-full col-span-1"
            />
          </div>
          <div>
            <label className=" labelTag block">Pick Time</label>
            <input
              type="time"
              name="pickTime"
              placeholder="Pick Time"
              value={stop.pickTime}
              onChange={handleStopChange}
              className="inputTag w-full col-span-1"
            />
          </div>

          <div>
            <label className=" labelTag block">Drop Time</label>
            <input
              type="time"
              name="dropTime"
              placeholder="Drop Time"
              value={stop.dropTime}
              onChange={handleStopChange}
              className="inputTag w-full col-span-1"
            />
          </div>
          <div></div>
          <div></div>
          <Button type="button" onClick={addStop} className="col-span-1">
            Add Stop
          </Button>
        </div>
        <ul>
          {route.stops.map((s, index) => (
            <li key={index} className="flex justify-between mb-2">
              {index + 1}. {s.name} - {convertTo12HourFormat(s.pickTime)} to{" "}
              {convertTo12HourFormat(s.dropTime)}
              <Button
                variant="danger"
                onClick={() => removeStop(index)}
                className="btn"
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h3>Buses</h3>

        <div className=" grid grid-cols-3  gap-4 ">
          <input
            type="text"
            name="name"
            placeholder="Bus Name"
            value={bus.name}
            onChange={handleBusChange}
            className="inputTag w-full"
          />
          <input
            type="text"
            name="number"
            placeholder="Bus Number"
            value={bus.number}
            onChange={handleBusChange}
            className="inputTag w-full"
          />
          <select
            name="status"
            value={bus.status}
            onChange={handleBusChange}
            className="inputTag w-full"
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <input
            type="number"
            name="seats"
            placeholder="Seats"
            value={bus.seats}
            onChange={handleBusChange}
            className="inputTag w-full"
          />
          <select
            name="driver"
            value={bus.driver}
            onChange={handleBusChange}
            className="inputTag w-full"
          >
            <option value="">Select Driver</option>
            {drivers.success ? (
              drivers?.data.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.name}, {driver.phone}, {driver.address}.
                </option>
              ))
            ) : (
              <option>{drivers?.message}</option>
            )}
          </select>
          <Button type="button" onClick={addBus} className="">
            Add Bus
          </Button>
        </div>
        <ul>
          {route.buses.map((b, index) => (
            <li key={index} className="flex justify-between mb-2">
              {index + 1}. {b.name} - {b.number} ({b.status})
              <Button variant="danger" onClick={() => removeBus(index)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <Button disabled={isLoading} type="submit" className="w-full">
        {isLoading ? (
          <Loader2Icon className=" animate-spin mx-auto" />
        ) : (
          "Register Route"
        )}
      </Button>
    </form>
  );
}

export default RegisterRoute;
