import Button from "@/components/utils/Button";
import { Modal } from "@/components/utils/Modal";
import { toast } from "@/components/utils/Toast";
import { useAppSelector } from "@/lib/hooks";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";

export default function EditFee({ data, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [feeStructure, setFeeStructure] = useState(data);
  const user = useAppSelector((state) => state.user);

  const handleInputChange = (e) => {
    setFeeStructure({ ...feeStructure, [e.target.name]: e.target.value });
  };
  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      console.log(feeStructure);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/fee`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            feeId: feeStructure?._id,
            perDay: feeStructure?.perDay,
            perMonth: feeStructure?.perMonth,
          }),
        }
      );
      const data = await response.json();
      if (data?.success) {
        toast.success(data?.message);
        setFeeStructure({});
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
    <Modal onClose={onClose} title={"Edit Fee Structure"}>
      <form onSubmit={handleSubmit} className="space-y-4 ">
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
            "Update Fee Structure"
          )}
        </Button>
      </form>
    </Modal>
  );
}
