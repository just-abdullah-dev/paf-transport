import Button from "@/components/utils/Button";
import { Modal } from "@/components/utils/Modal";
import { toast } from "@/components/utils/Toast";
import { useAppSelector } from "@/lib/hooks";
import { getRoutes } from "@/services";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function RegisterFee({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [feeStructure, setFeeStructure] = useState({
    perDay: 0,
    perMonth: 0,
  });
  const user = useAppSelector((state) => state.user);

  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState({});

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      const resData = await getRoutes(user.token);
      setRoutes(resData);
      let route = resData?.data.find(
        (route) => route?._id === feeStructure?.route?._id
      );

      setSelectedRoute(route);
      setIsLoading(false);
    };
    main();
  }, []);

  const handleInputChange = (e) => {
    setFeeStructure({ ...feeStructure, [e.target.name]: e.target.value });
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
        ...feeStructure,
        routeId: selectedRoute?._id,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/fee`,
        {
          method: "POST",
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
        setFeeStructure({});
        setSelectedRoute({})
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
    <Modal onClose={onClose} title={"Register a Fee Structure"}>
      <div  className={` ${
            isLoading
              ? " pointer-events-none animate-pulse "
              : " pointer-events-auto animate-none"
          } `}>
        <label className=" font-semibold">Select Route:</label>
        <select
          name="route"
          value={selectedRoute?._id}
          onChange={(e) => {
            setSelectedRoute(
              routes?.data.find((route) => route._id === e.target.value)
            );
          }}
          className="inputTag w-full"
        >
          <option value="">{isLoading? "Loading...": "Select Route"}</option>
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
              <label className=" font-semibold ">Per Day in PKR</label>
              <input
                type="number"
                name="perDay"
                value={feeStructure?.perDay}
                onChange={handleInputChange}
                className="inputTag w-full"
                required
              />
            </div>

            <div className="space-y-2 col-span-1 w-full">
              <label className=" font-semibold ">Per Month in PKR</label>
              <input
                type="number"
                name="perMonth"
                value={feeStructure?.perMonth}
                onChange={handleInputChange}
                className="inputTag w-full"
                required
              />
            </div>
          </div>
          <Button disabled={isLoading} type="submit" className="w-full ">
            {isLoading ? (
              <Loader2Icon className=" animate-spin mx-auto" />
            ) : (
              "Register a Fee Structure"
            )}
          </Button>
        </form>
      )}
    </Modal>
  );
}
