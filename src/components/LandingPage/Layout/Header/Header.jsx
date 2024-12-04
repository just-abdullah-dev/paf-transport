"use client";
import Button from "@/components/utils/Button";
import { clearUser } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className=" bg-transparent fixed w-full top-0 left-0 z-50 backdrop-blur-md">
      <div className="container flex w-full py-4 items-center max-w-7xl px-8 xl:px-0 mx-auto">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1">
            <Link
              href="/"
              className="text-lg md:text-3xl font-bold text-custom-gradient"
            >
              PAF Transport
            </Link>
          </div>
          <nav className="flex items-center relative">
            {user?._id ? (
              <div
                className="flex items-center gap-1 cursor-pointer group"
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                }}
              >
                <p className="">{user?.name}</p>
                <ChevronDown
                  className={` w-5 h-5 ${
                    isProfileOpen ? " top-[2px]" : "top-0"
                  } duration-300 transition-all relative `}
                />
                <div
                  className={` ${
                    isProfileOpen ? "opacity-100" : "opacity-0"
                  } duration-500 transition-all bg-white rounded-lg overflow-hidden backdrop-blur-sm absolute top-[28px] right-0 text-sm`}
                >
                  <p
                    onClick={() => {
                      window.location.href = "/dashboard";
                    }}
                    className=" hover:bg-gray-300 duration-300 transition-all cursor-pointer px-3 py-1"
                  >
                    Dashboard
                  </p>
                  <p
                    onClick={() => {
                      dispatch(clearUser());
                    }}
                    className=" hover:bg-gray-300 duration-300 transition-all cursor-pointer text-red-600 px-3 py-1"
                  >
                    Logout
                  </p>
                </div>
              </div>
            ) : (
              <Button>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}