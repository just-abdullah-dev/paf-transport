import Button from "@/components/utils/Button";
import { Modal } from "@/components/utils/Modal";
import { toast } from "@/components/utils/Toast";
import { useAppSelector } from "@/lib/hooks";
import { getFeeIntervals } from "@/services";
import formatISODate from "@/utils/formatDate";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function GenerateVouchers({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [feeInterval, setFeeInterval] = useState({});
  const user = useAppSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [feeIntervals, setFeeIntervals] = useState([]);

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      const data = await getFeeIntervals(user.token, { year: "", month: "" });
      setData(data);
      setFeeIntervals(
        data?.data.filter((item) => item?.voucherStatus === "not-generated")
      );
      setIsLoading(false);
    };
    main();
  }, []);

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

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let body = {
        feeIntervalId: feeInterval?._id,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/fee/generate-voucher`,
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
        <div className="space-y-2 w-full">
          <label className=" font-semibold">Select Fee Interval:</label>
          <select
            name="feeIntervalId"
            value={feeInterval?._id}
            onChange={(e) => {
              setFeeInterval(
                feeIntervals.find((item) => item?._id === e.target.value)
              );
            }}
            className="inputTag w-full"
          >
            <option value="">Select Fee Interval</option>
            {data?.success ? (
              feeIntervals.map((feeInterval, index) => (
                <option key={feeInterval._id} value={feeInterval._id}>
                  {`From ${formatISODate(feeInterval?.from)} to ${formatISODate(
                    feeInterval?.to
                  )}.`}
                </option>
              ))
            ) : (
              <option>{data?.message}</option>
            )}
          </select>
        </div>
        {feeInterval?._id && (
          <Button disabled={isLoading} type="submit" className="w-full ">
            {isLoading ? (
              <Loader2Icon className=" animate-spin mx-auto" />
            ) : (
              "Generate Vouchers"
            )}
          </Button>
        )}
      </form>
    </Modal>
  );
}
