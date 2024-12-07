import Button from "@/components/utils/Button";
import { Modal } from "@/components/utils/Modal";
import { toast } from "@/components/utils/Toast";
import { useAppSelector } from "@/lib/hooks";
import { getAvailableDrivers } from "@/services";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function EditBus({ data, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [bus, setBus] = useState(data);
  const [currentDriver, setCurrentDriver] = useState(data?.driver);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "driver") {
      setCurrentDriver(drivers?.data.find((driver) => driver._id === value));
    } else {
      setBus({ ...bus, [name]: value });
    }
  };
  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      console.log({
        ...bus,
        busId: bus?._id,
        driver:
          currentDriver?._id === bus.driver?._id ? "" : currentDriver?._id,
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...bus,
          busId: bus?._id,
          driver:
            currentDriver?._id === bus.driver?._id ? "" : currentDriver?._id,
        }),
      });
      const data = await response.json();
      if (data?.success) {
        toast.success(data?.message);
        setBus({});
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
    <Modal onClose={onClose} title={"Edit Bus Details"}>
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div className=" grid grid-cols-2  gap-4 ">
          <div>
            <label className=" font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Bus Name"
              value={bus.name}
              onChange={handleInputChange}
              className="inputTag w-full"
            />
          </div>
          <div>
            <label className=" font-semibold">Number:</label>
            <input
              type="text"
              name="number"
              placeholder="Bus Number"
              value={bus.number}
              onChange={handleInputChange}
              className="inputTag w-full"
            />
          </div>
          <div>
            <label className=" font-semibold">Status:</label>
            <select
              name="status"
              value={bus.status}
              onChange={handleInputChange}
              className="inputTag w-full"
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className=" font-semibold">Seats:</label>
            <input
              type="number"
              name="seats"
              placeholder="Seats"
              value={bus.seats}
              onChange={handleInputChange}
              className="inputTag w-full"
            />
          </div>

          <div>
            <label className=" font-semibold">
              {currentDriver?._id ? "Change" : "Select"} Driver:
            </label>
            <select
              name="driver"
              value={currentDriver?._id}
              onChange={handleInputChange}
              className="inputTag w-full"
            >
              {/* <option value="">Select Driver</option> */}

              <option value="">
                {bus.driver?.name}, {bus.driver?.phone}, {bus.driver?.address}.
              </option>
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
          </div>
          {bus?.driver?._id && (
            <div className=" col-span-2 ">
              <label className=" font-semibold">Current Driver:</label>
              <div key={bus?.driver?._id} value={bus?.driver?._id}>
                {bus?.driver?.name}, {bus?.driver?.phone},{" "}
                {bus?.driver?.address}.
              </div>
            </div>
          )}
        </div>

        <Button disabled={isLoading} type="submit" className="w-full ">
          {isLoading ? (
            <Loader2Icon className=" animate-spin mx-auto" />
          ) : (
            "Update Bus"
          )}
        </Button>
      </form>
    </Modal>
  );
}
