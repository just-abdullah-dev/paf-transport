import Button from "@/components/utils/Button";
import { Modal } from "@/components/utils/Modal";
import { toast } from "@/components/utils/Toast";
import { useAppSelector } from "@/lib/hooks";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";

export default function CreateFeeInterval({ data, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [feeInterval, setFeeInterval] = useState({
    from: "",
    to: "",
    namesOfMonths: [],
    issueDate: "",
    dueDate: "",
  });
  const user = useAppSelector((state) => state.user);
  const [currentMonthInput, setCurrentMonthInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "namesOfMonths") {
      // Update the input value for real-time feedback
      setCurrentMonthInput(value);

      // Check if a comma is pressed to add the current value to the array
      if (value.endsWith(",")) {
        const trimmedValue = value.slice(0, -1).trim(); // Remove trailing comma
        if (trimmedValue) {
          setFeeInterval((prev) => ({
            ...prev,
            namesOfMonths: [...prev.namesOfMonths, trimmedValue],
          }));
        }
        setCurrentMonthInput(""); // Reset the input field
      }
    } else {
      const isoDate = new Date(value).toISOString();
      setFeeInterval((prev) => ({
        ...prev,
        [name]: isoDate,
      }));
    }
  };
  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      !currentMonthInput &&
      feeInterval.namesOfMonths.length
    ) {
      // Remove the last item in the array if backspace is pressed on an empty input
      setFeeInterval((prev) => ({
        ...prev,
        namesOfMonths: prev.namesOfMonths.slice(0, -1),
      }));
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let body = {
        ...feeInterval,
        feeIntervalId: feeInterval?._id,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/fee/interval`,
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
        setFeeInterval({});
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
    <Modal onClose={onClose} title={"Create a Fee Interval"}>
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
            <label className=" font-semibold">From Date</label>
            <input
              type="date"
              name="from"
              value={feeInterval?.from?.split("T")[0]}
              onChange={handleInputChange}
              className="inputTag w-full"
              required
            />
          </div>

          <div className="space-y-2 col-span-1 w-full">
            <label className=" font-semibold">To Date</label>
            <input
              type="date"
              name="to"
              value={feeInterval?.to?.split("T")[0]}
              onChange={handleInputChange}
              className="inputTag w-full"
              required
            />
          </div>

          {/* Input for Names of Months */}
          <div className="space-y-2 col-span-2 w-full">
            <label className=" font-semibold">Type month and press comma</label>
            <input
              type="text"
              name="namesOfMonths"
              value={currentMonthInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="inputTag w-full"
              placeholder="Type month names and press comma"
            />
          </div>

          {/* Display Array */}
          <div className="space-y-2 col-span-2 w-full">
            <h4>
              <span className=" font-semibold">Names of Months:</span> (Press
              Backspace for to remove month)
            </h4>
            <p>{feeInterval.namesOfMonths.join(", ")}</p>
          </div>

          <div className="space-y-2 col-span-1 w-full">
            <label className=" font-semibold">Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={feeInterval?.issueDate?.split("T")[0]}
              onChange={handleInputChange}
              className="inputTag w-full"
              required
            />
          </div>

          <div className="space-y-2 col-span-1 w-full">
            <label className=" font-semibold">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={feeInterval?.dueDate?.split("T")[0]}
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
            "Create a Fee Interval"
          )}
        </Button>
      </form>
    </Modal>
  );
}
