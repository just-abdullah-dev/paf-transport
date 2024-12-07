import Button from "@/components/utils/Button";
import { Modal } from "@/components/utils/Modal";
import { toast } from "@/components/utils/Toast";
import { useAppSelector } from "@/lib/hooks";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";

export default function EditRoute({ data, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState(data);
  const user = useAppSelector((state) => state.user);

  const handleInputChange = (e) => {
    setRoute({ ...route, [e.target.name]: e.target.value });
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
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            routeId: route?._id,
            name: route?.name,
            road: route?.road,
            city: route?.city,
          }),
        }
      );
      const data = await response.json();
      if (data?.success) {
        toast.success(data?.message);
        setRoute({});
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
    <Modal onClose={onClose} title={"Edit Route Details"}>
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div className=" grid grid-cols-2 gap-4 ">
          <div className="space-y-2 col-span-1 w-full">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={route?.name}
              onChange={handleInputChange}
              className="inputTag w-full"
              required
            />
          </div>

          <div className="space-y-2 col-span-1 w-full">
            <label>Road</label>
            <input
              type="text"
              name="road"
              value={route?.road}
              onChange={handleInputChange}
              className="inputTag w-full"
              required
            />
          </div>

          <div className="space-y-2 col-span-1 w-full">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={route?.city}
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
            "Update Route"
          )}
        </Button>
      </form>
    </Modal>
  );
}
