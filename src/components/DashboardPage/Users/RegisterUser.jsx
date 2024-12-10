"use client";

import { Modal } from "@/components/utils/Modal";
import React, { useState } from "react";
import { toast } from "@/components/utils/Toast";
import { useAppSelector } from "@/lib/hooks";
import Button from "@/components/utils/Button";
import { Loader2Icon } from "lucide-react";

export default function RegisterUser({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegisterUser = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ ...formData }),
      });

      const data = await response.json();

      if (data?.success) {
        toast.success(data?.message);
        onClose();
        window.location.reload();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }

    setIsLoading(false);
  };

  return (
    <Modal title={"Register a User"} onClose={onClose}>
      <div className="container mx-auto my-8 max-w-[95%] text-sm ">
        <div className="mb-8">
          <div>
            <h1 className=" text-2xl md:text-3xl font-semibold mb-6 text-custom-gradient w-fit">
              Register User
            </h1>
          </div>
          <div>
            <form onSubmit={handleRegisterUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className=" block font-semibold" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="inputTag w-full "
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className=" block font-semibold" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="inputTag w-full disabled:opacity-85 disabled:cursor-not-allowed"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-semibold" htmlFor="role">
                    Role
                  </label>
                  <select
                    className="inputTag w-full"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    <option value="admin">Admin</option>
                    <option value="bank">Bank</option>
                    <option value="driver">Driver</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className=" block font-semibold" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className="inputTag w-full "
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label className=" block font-semibold" htmlFor="password">
                    New Password
                  </label>
                  <input
                    className="inputTag w-full "
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label
                    className=" block font-semibold"
                    htmlFor="confirmPassword"
                  >
                    Confirm New Password
                  </label>
                  <input
                    className="inputTag w-full "
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className=" col-span-2 space-y-2">
                  <label className=" block font-semibold" htmlFor="address">
                    Address
                  </label>
                  <textarea
                    className="inputTag w-full "
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading ? (
                  <Loader2Icon className=" animate-spin mx-auto" />
                ) : (
                  "Register a User"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
