"use client";

import { useState } from "react";
import { toast } from "@/components/utils/Toast";
import { setUser } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Button from "@/components/utils/Button";
import { Loader2Icon } from "lucide-react";

export default function Profile() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    busId: user.busId,
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (showPasswordForm) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        setIsLoading(false)
        return;
      }
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(
          showPasswordForm
            ? { ...formData, password, userId: user._id }
            : { ...formData, userId: user._id }
        ),
      });

      const data = await response.json();

      if (data?.success) {
        toast.success(data?.message);
        if(showPasswordForm){
            setShowPasswordForm(false);
        }
        dispatch(setUser({ ...data?.data, token: user.token }));
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto my-8 max-w-[90%] ">
      <div className="mb-8">
        <div>
          <h1 className=" text-2xl md:text-3xl font-semibold mb-6 text-custom-gradient w-fit">
            Update Profile
          </h1>
        </div>
        <div>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
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
                  disabled={true}
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
              <div className="space-y-2">
                <label className=" block font-semibold" htmlFor="address">
                  Address
                </label>
                <input
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
                "Update Profile"
              )}
            </Button>
          </form>
        </div>
      </div>

      <div>
        <div>
          <h1 className=" text-2xl md:text-3xl font-semibold mb-6 text-custom-gradient w-fit">
            Password Management
          </h1>
        </div>
        <div>
          {!showPasswordForm ? (
            <Button
              disabled={isLoading}
              onClick={() => {
                setShowPasswordForm(true);
                setPassword("");
                setConfirmPassword("");
              }}
              className="w-full"
            >
              Change Password
            </Button>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-4 ">
              <div className=" flex gap-4 w-full">
                <div className="space-y-2 w-full">
                  <label className=" block font-semibold" htmlFor="password">
                    New Password
                  </label>
                  <input
                    className="inputTag w-full "
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className=" flex gap-4">
                <Button
                  disabled={isLoading}
                  type="reset"
                  onClick={() => setShowPasswordForm(false)}
                  variant="danger"
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading ? (
                    <Loader2Icon className=" animate-spin mx-auto" />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
