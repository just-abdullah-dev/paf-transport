"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import Button from "../utils/Button";
import { toast } from "../utils/Toast";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearUser, setUser } from "@/lib/features/user/userSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    if (user?._id) {
      window.location.href = "/dashboard";
    }
  }, [user]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      console.log(data);

      if (data?.success) {
        toast.success(data?.message);
        dispatch(setUser(data?.data));      
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row-reverse">
      {/* right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-2xl md:text-4xl font-bold tracking-tight text-custom-gradient">
              Log in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold" htmlFor="email">
                  Email
                </label>
                <input
                  className=" inputTag w-full"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block font-semibold" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    className=" inputTag w-full"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-6 w-6 text-gray-500" />
                    ) : (
                      <Eye className="h-6 w-6 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading ? <Loader2Icon className=" animate-spin mx-auto" /> : "Log in"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* left side - Content (hidden on mobile) */}
      <div className="flex-1 hidden md:flex items-center justify-center p-10">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-bold mb-6 text-custom-gradient">
            Welcome Back!
          </h1>
          <p className="text-xl">
            Log in to access your account and enjoy our amazing features.
          </p>
        </div>
      </div>
    </div>
  );
}
