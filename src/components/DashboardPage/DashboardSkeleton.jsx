"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Banknote,
  Bus,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftRightEllipsis,
  Coins,
  FileChartColumn,
  HandCoins,
  LayoutDashboard,
  Route,
  Tickets,
  User2Icon,
  Users,
  UserSearch,
  UsersRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "../LandingPage/Layout/Header/Header";
import { toast } from "../utils/Toast";

export default function DashboardSkeleton({ children }) {
  const [dashboardMenu, setDashboardMenu] = useState([]);

  const user = useAppSelector((state) => state.user);
  const pathname = usePathname();
  const arr = pathname.split("/");
  const currentWindow = arr[arr.length - 1];

  useEffect(() => {
    if (!user?._id) {
      window.location.href = "/login";
      toast.error("Login First.")
    } else {
      switch (user.role) {
        case "admin":
          setDashboardMenu(adminMenu);
          break;
        case "bank":
          setDashboardMenu(bankMenu);
          break;
        case "driver":
          setDashboardMenu(driverMenu);
          break;

        default:
          break;
      }
    }
  }, [user]);

  const [openSidebar, setOpenSidebar] = useState(true);
  const adminMenu = [
    {
      name: "Dashboard",
      path: "dashboard",
      icon: <LayoutDashboard size={28} />,
    },
    {
      name: "Profile",
      path: "profile",
      icon: <User2Icon size={28} />,
    },
    {
      name: "Routes",
      path: "routes",
      icon: <Route size={28} />,
    },
    {
      name: "Buses",
      path: "buses",
      icon: <Bus size={28} />,
    },
    {
      name: "Students",
      path: "students",
      icon: <Users size={28} />,
    },
    {
      name: "Fee Structure",
      path: "fee-structure",
      icon: <WalletCards size={28} />,
    },
    {
      name: "Fee Interval",
      path: "fee-intervals",
      icon: <ChevronsLeftRightEllipsis size={28} />,
    },
    {
      name: "Fee Vouchers",
      path: "fee-vouchers",
      icon: <Tickets size={28} />,
    },
    {
      name: "Check Fee",
      path: "check-fee",
      icon: <UserSearch size={28} />,
    },
    {
      name: "Update Fee",
      path: "update-fee",
      icon: <HandCoins size={28} />,
    },
    {
      name: "Reports",
      path: "reports",
      icon: <FileChartColumn size={28} />,
    },
    {
      name: "Users",
      path: "users",
      icon: <UsersRound size={28} />,
    },
  ];

  const bankMenu = [
    {
      name: "Dashboard",
      path: "dashboard",
      icon: <LayoutDashboard size={28} />,
    },
    {
      name: "Profile",
      path: "profile",
      icon: <User2Icon size={28} />,
    },
    {
      name: "Students",
      path: "students",
      icon: <Users size={28} />,
    },
    {
      name: "Fee Intervals",
      path: "fee-intervals",
      icon: <ChevronsLeftRightEllipsis size={28} />,
    },
    {
      name: "Update Fee",
      path: "update-fee",
      icon: <Banknote size={28} />,
    },
  ];

  const driverMenu = [
    {
      name: "Dashboard",
      path: "dashboard",
      icon: <LayoutDashboard size={28} />,
    },
    {
      name: "Profile",
      path: "profile",
      icon: <User2Icon size={28} />,
    },
    {
      name: "Bus & Students",
      path: "bus-&-students",
      icon: <><Bus size={22} /> <Users size={22} /></>,
    },
    {
      name: "Fee Intervals",
      path: "fee-intervals",
      icon: <ChevronsLeftRightEllipsis size={28} />,
    },
    {
      name: "Check Fee",
      path: "check-fee",
      icon: <UserSearch size={28} />,
    },
  ];

  return (
    <div className="">
      <Header />
      <div className=" flex items-start">
        <div
          className={`${
            openSidebar
              ? "w-[64%] sm:w-[44%] md:w-[30%] lg:w-[16%]"
              : "w-[10%] sm:w-[8%] md:w-[6%] lg:w-[4%]"
          } h-screen overflow-hidden transition-all duration-1000 `}
        ></div>
        <div
          className={`
            ${
              openSidebar
                ? "w-[64%] sm:w-[44%] md:w-[30%] lg:w-[16%] px-2"
                : "w-[10%] sm:w-[8%] md:w-[6%] lg:w-[4%] px-[2px]"
            }
                h-screen flex flex-col overflow-hidden fixed top-[69px] z-50 transition-all duration-1000 `}
        >
          {/* side bar open & close btn  */}
          <button
            onClick={() => {
              setOpenSidebar(!openSidebar);
            }}
            title={openSidebar ? "Close Sidebar" : "Open Sidebar"}
            className="hover:scale-105 duration-300 "
          >
            {openSidebar ? (
              <div
                className={`${
                  !openSidebar && " justify-center"
                } flex items-center gap-4  py-2 `}
              >
                <ChevronLeftIcon className=" ml-2" size={32} />
                <p className="">Close Sidebar</p>
              </div>
            ) : (
              <div className=" py-2 pl-2">
                <ChevronRightIcon size={32} />
              </div>
            )}
          </button>
          {/* all options  */}
          {dashboardMenu.map((opt, index) => {
            return (
              <Link
                className={`${!openSidebar && " justify-center"} ${
                  currentWindow === opt?.path &&
                  " bg-gradient-to-tl text-white  "
                } 
              flex items-center gap-4 rounded-lg hover:text-white font-[500] hover:bg-gradient-to-tl from-primary to-secondary  py-2 px-2`}
                href={
                  opt?.path === "dashboard"
                    ? `/${opt?.path}`
                    : `/dashboard/${opt?.path}`
                }
                key={index}
                title={opt?.name}
              >
                {opt?.icon}
                {openSidebar && opt?.name}
              </Link>
            );
          })}
        </div>
        <div
          className={`${
            openSidebar
              ? "w-[36%] sm:w-[56%] md:w-[70%] lg:w-[84%]"
              : "w-[90%] sm:w-[92%] md:w-[94%] lg:w-[96%]"
          } transition-all duration-1000 h-fit min-h-screen mt-16 `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}