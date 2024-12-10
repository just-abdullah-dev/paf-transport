"use client";
import React from "react";
import Profile from "./Profile";
import { useAppSelector } from "@/lib/hooks";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.user);
  return <Profile data={user} />;
}
