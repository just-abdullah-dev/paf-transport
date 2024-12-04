"use client";
import DashboardPage from "@/components/DashboardPage/DashboardPage";
import DashboardSkeleton from "@/components/DashboardPage/DashboardSkeleton";
import { useAppSelector } from "@/lib/hooks";
import React from "react";

export default function page() {
  const user = useAppSelector((state) => state.user);
  console.log("from redux state dashboard", user);

  return (
    <DashboardSkeleton>
      <DashboardPage />
    </DashboardSkeleton>
  );
}
