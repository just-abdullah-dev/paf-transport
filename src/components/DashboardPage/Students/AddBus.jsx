import Button from "@/components/utils/Button";
import { Modal } from "@/components/utils/Modal";
import { toast } from "@/components/utils/Toast";
import { useAppSelector } from "@/lib/hooks";
import { getAvailableDrivers } from "@/services";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function AddBus({ routeId, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [bus, setBus] = useState({
    name: "",
    number: "",
    status: "active",
    seats: "",
    driver: "",
  });
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
    setBus({ ...bus, [name]: value });
  };
  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      console.log({
        ...bus,
        routeId,
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...bus,
          routeId,
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
            <label className=" font-semibold">Select Driver:</label>
            <select
              name="driver"
              value={bus.driver}
              onChange={handleInputChange}
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
          </div>
        </div>

        <Button disabled={isLoading} type="submit" className="w-full ">
          {isLoading ? (
            <Loader2Icon className=" animate-spin mx-auto" />
          ) : (
            "Add Bus"
          )}
        </Button>
      </form>
    </Modal>
  );
}
