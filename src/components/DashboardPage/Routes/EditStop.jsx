import Button from "@/components/utils/Button";
import { Modal } from "@/components/utils/Modal";
import { toast } from "@/components/utils/Toast";
import { useAppSelector } from "@/lib/hooks";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";

export default function EditStop({ data, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [stop, setStop] = useState(data);
  const user = useAppSelector((state) => state.user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStop({ ...stop, [name]: value });
  };
  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      console.log({
        ...stop,
        stopId: stop?._id,
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/stop`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...stop,
          stopId: stop?._id,
        }),
      });
      const data = await response.json();
      if (data?.success) {
        toast.success(data?.message);
        setStop({});
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
    <Modal onClose={onClose} title={"Edit stop Details"}>
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div className=" grid grid-cols-2  gap-4 ">
          <div>
            <label className=" font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Stop Name"
              value={stop.name}
              onChange={handleInputChange}
              className="inputTag w-full"
            />
          </div>
          <div>
            <label className=" font-semibold">Pick Time:</label>
            <input
              type="time"
              name="pickTime"
              placeholder="Pick Time"
              value={stop.pickTime}
              onChange={handleInputChange}
              className="inputTag w-full col-span-1"
            />
          </div>
          <div>
            <label className=" font-semibold">Drop Time:</label>
            <input
              type="time"
              name="dropTime"
              placeholder="Drop Time"
              value={stop.dropTime}
              onChange={handleInputChange}
              className="inputTag w-full col-span-1"
            />
          </div>
        </div>

        <Button disabled={isLoading} type="submit" className="w-full ">
          {isLoading ? (
            <Loader2Icon className=" animate-spin mx-auto" />
          ) : (
            "Update Stop"
          )}
        </Button>
      </form>
    </Modal>
  );
}
