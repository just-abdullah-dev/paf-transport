"use client";
import { useAppSelector } from "@/lib/hooks";
import React from "react";

export default function DashboardPage() {
  let user = useAppSelector((state) => state.user);
  return (
    <div className=" flex items-center justify-center h-96 mt-12">
      <div className=" w-full text-4xl font-bold px-6 py-12 grid gap-6">
        <h1 className=" text-center text-5xl text-custom-gradient w-fit mx-auto">
          PAF Transport System
        </h1>
        <div className=" dark:text-gray-900 text-custom-gradient">
          <h1 className=" text-custom-gradien text-ternary w-fit">
            <span className="">Welcome</span> <span className="">Back!</span>
          </h1>
          <h1 className=" text-custom-gradient w-fit mx-auto text-center">
            {user?.name}
          </h1>
        </div>
      </div>
    </div>
  );
}
