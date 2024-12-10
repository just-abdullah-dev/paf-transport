"use client";

import Button from "@/components/utils/Button";
import { Modal } from "@/components/utils/Modal";
import { toast } from "@/components/utils/Toast";
import { useAppSelector } from "@/lib/hooks";
import formatISODate from "@/utils/formatDate";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";

export default function EditFee({ onClose, data }) {
  const [isLoading, setIsLoading] = useState(false);
  const [fee, setFee] = useState( data );
  const user = useAppSelector((state) => state.user);

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let body = {
        voucherId: fee?._id,
        status: fee?.status,
        notes: fee?.notes,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/fee/student-voucher`,
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
        setFee({});
        onClose();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
    setIsLoading(false);
  };
  console.log(fee);

  return (
    <Modal onClose={onClose} title={"Update Fee Status"}>
      <div className=" text-sm">
        <div className=" flex items-center">
          <p className="thTag w-1/2">
            <span className=" font-semibold">Student Name: </span>
            {fee?.name}
          </p>
          <p className="thTag w-1/2">
            <span className=" font-semibold">Student Reg #: </span>
            {fee?.reg}
          </p>
        </div>
        <p className="thTag">
          <span className=" font-semibold">Interval: </span>
          {formatISODate(fee?.routeVoucher?.feeInterval?.from)} to{" "}
          {formatISODate(fee?.routeVoucher?.feeInterval?.to)}
          <br />
          {fee?.routeVoucher?.feeInterval?.namesOfMonths.length > 0
            ? fee?.routeVoucher?.feeInterval?.namesOfMonths.join(", ")
            : ""}{" "}
          ({fee?.routeVoucher?.feeInterval?.noOfMonths})
        </p>
        <p className="thTag">
          <span className=" font-semibold">Issue & Due Date: </span>
          {formatISODate(fee?.routeVoucher?.feeInterval?.issueDate)} -{" "}
          {formatISODate(fee?.routeVoucher?.feeInterval?.dueDate)}
        </p>
        
        <div className=" flex items-center">
        <p className="thTag w-1/2">
          <span className=" font-semibold">Total Amount: </span>
          {fee?.routeVoucher?.totalAmount} Rs/-
        </p>
        <p className="thTag w-1/2">
          <span className=" font-semibold">Fine Per Day: </span>
          {fee?.routeVoucher?.finePerDay} Rs/-
        </p>
        </div>

        <p className="thTag">
          <span className=" font-semibold">Status: </span>
          {fee?.status === "paid" ? (
            <span className=" text-green-600 font-semibold">Paid</span>
          ) : (
            <span className=" text-red-600 font-semibold">Not Paid</span>
          )}
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className={` ${
          isLoading
            ? " pointer-events-none animate-pulse "
            : " pointer-events-auto animate-none"
        } space-y-4 text-sm`}
      >
        <div className=" grid ">
          <div className="space-y-2 w-full thTag">
            <label className=" font-semibold">Select Status:</label>
            <select
              name="feeIntervalId"
              value={fee?.status}
              onChange={(e)=>{
                setFee((prevData)=>{
                    return {...prevData, status: e.target.value}
                })
              }}
              className="inputTag w-full"
            >
              <option key={"paid"} value={"paid"}>
                Paid
              </option>
              <option key={"unpaid"} value={"unpaid"}>
                Not Paid
              </option>
            </select>
          </div>

          <div className="space-y-2 w-full thTag">
            <label className=" font-semibold ">Notes</label>
            <textarea
              type="text"
              name="notes"
              value={fee?.notes} 
              onChange={(e)=>{
                setFee((prevData)=>{
                    return {...prevData, notes: e.target.value}
                })
              }}
              className="inputTag w-full"
              required
            />
          </div>
        </div>

        <Button disabled={isLoading} type="submit" className="w-full ">
          {isLoading ? (
            <Loader2Icon className=" animate-spin mx-auto" />
          ) : (
            "Update Fee Status"
          )}
        </Button>
      </form>
    </Modal>
  );
}
