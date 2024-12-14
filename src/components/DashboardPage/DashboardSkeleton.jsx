"use client";
import React, { useEffect, useState } from "react";
import {
  X,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
  Banknote,
  Bus,
  ChevronsLeftRightEllipsis,
  FileChartColumn,
  HandCoins,
  LayoutDashboard,
  Route,
  Tickets,
  User2Icon,
  UserSearch,
  UsersRound,
  WalletCards,
} from "lucide-react";
import Header from "../LandingPage/Layout/Header/Header";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { usePathname } from "next/navigation";

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
    icon: (
      <>
        <Bus size={22} /> <Users size={22} />
      </>
    ),
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

const DashboardSkeleton = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const [dashboardMenu, setDashboardMenu] = useState([]);
  const user = useAppSelector((state) => state.user);
  const pathname = usePathname();
  const arr = pathname.split("/");
  const currentWindow = arr[arr.length - 1];

  useEffect(() => {
    if (!user?._id) {
      window.location.href = "/login";
      toast.error("Login First.");
    } else if (checkPageAccess()) {
      window.location.href = "/dashboard";
      toast.error("Access Restricted.");
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

  const checkPageAccess = () => {
    // Define menus based on roles
    const menus = {
      admin: adminMenu,
      bank: bankMenu,
      driver: driverMenu,
    };

    // Get the menu for the user's role
    const userMenu = menus[user?.role] || [];

    // Check if the current page path exists in the user's menu
    const hasAccess = userMenu.some(
      (menuItem) => menuItem.path === currentWindow
    );

    // Return true for unauthorized access and false for authorized access
    return !hasAccess;
  };

  return (
    <div className="flex h-screen overflow-hidden  ">
      <Header />
      <Sidebar
        currentWindow={currentWindow}
        menus={dashboardMenu}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className=" md:hidden mt-[60px] w-full">
          <button
            className=" p-2 rounded-md text-ternary hover:text-ternary/90 hover:bg-gray-100 ml-2 "
            onClick={toggleMobileMenu}
          >
            <Menu size={24} />
          </button>
        </div>
        <main className="flex-1 overflow-x-scroll overflow-y-auto md:pt-[45px]">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
      <MobileMenu
        currentWindow={currentWindow}
        menus={dashboardMenu}
        isOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
    </div>
  );
};

export default DashboardSkeleton;

const Sidebar = ({ isOpen, toggleSidebar, menus, currentWindow }) => {
  return (
    <aside
      className={` mt-[72px] p-2 text-white bg-ternary/90 backdrop-blur-lg overflow-y-auto custom-scrollbar transition-all duration-700 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      } hidden md:block`}
    >
      <div
        className={`
        ${isOpen ? " px-4 justify-between " : " px-0 justify-center "}
        flex items-center bg-gradient-to-tl from-secondary to-primary bg-[length:110%_110%] hoverbg-[length:125%_125%] rounded-lg py-2 text-white font-[500] duration-300 transition-all`}
      >
        {isOpen && <span className="text-lg font-semibold">Menu</span>}
        <button
          onClick={toggleSidebar}
          className=" rounded-full custom-gradient p-1 "
        >
          {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>
      <nav>
        <ul className=" grid gap-1 my-1">
          {/* all options  */}
          {menus.map((opt, index) => {
            return (
              <Link
                className={`
                   ${!isOpen ? " justify-center " : " "}
             ${currentWindow === opt?.path && " bg-gradient-to-tl  "} 
              flex items-center gap-4 rounded-lg font-[500] hover:bg-gradient-to-tl from-primary to-secondary p-3
               `}
                href={
                  opt?.path === "dashboard"
                    ? `/${opt?.path}`
                    : `/dashboard/${opt?.path}`
                }
                key={index}
              >
                {opt.icon}
                {isOpen && <span className="ml-4">{opt?.name}</span>}
              </Link>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

const MobileMenu = ({ isOpen, toggleMobileMenu, menus, currentWindow }) => {
  return (
    <div
      onClick={toggleMobileMenu}
      className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 md:hidden transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed inset-y-0 left-0 max-w-xs w-full bg-ternary/90 overflow-y-auto custom-scrollbar  p-2 text-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-3">
          <span className="text-xl font-semibold">Menu</span>
          <button onClick={toggleMobileMenu} className="p-1 rounded-full ">
            <X size={24} />
          </button>
        </div>
        <nav className=" c">
          <ul className=" grid gap-1 my-1">
            {/* all options  */}
            {menus.map((opt, index) => {
              return (
                <Link
                  className={`
                   ${!isOpen ? " justify-center " : " "}
             ${currentWindow === opt?.path && " bg-gradient-to-tl  "} 
              flex items-center gap-4 rounded-lg font-[500] hover:bg-gradient-to-tl from-primary to-secondary p-3
               `}
                  href={
                    opt?.path === "dashboard"
                      ? `/${opt?.path}`
                      : `/dashboard/${opt?.path}`
                  }
                  key={index}
                >
                  {opt.icon}
                  {isOpen && <span className="ml-4">{opt?.name}</span>}
                </Link>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};
