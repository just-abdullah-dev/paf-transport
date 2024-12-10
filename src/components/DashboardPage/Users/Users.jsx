"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import Button from "@/components/utils/Button";
import { deleteUser, getUsers } from "@/services";
import convertTo12HourFormat from "@/utils/formatTime";
import RegisterUser from "./RegisterUser";
import { Search, SquarePen, Trash2 } from "lucide-react";
import { toast } from "@/components/utils/Toast";
import formatISODate from "@/utils/formatDate";
import { setUser } from "@/lib/features/user/userSlice";
import Link from "next/link";
import EditUser from "./EditUser";

export default function Users() {
  const [openUserId, setOpenUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [editUser, setEditUser] = useState({});
  const [registerUser, setRegisterUser] = useState(false);

  const user = useAppSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      const data = await getUsers(user.token);
      setData(data);
      setUsers(data?.data);
      setIsLoading(false);
    };
    main();
  }, []);

  const handleSearch = (query) => {
    setRole("all");
    setSearchQuery(query);

    if (query.trim() === "") {
      // Reset users to original data when search is empty
      setUsers(data?.data);
    } else {
      // Filter users based on search query
      const lowerCaseQuery = query.toLowerCase();
      const filteredusers = data?.data.filter(
        (user) =>
          user?.name.toLowerCase().includes(lowerCaseQuery) ||
          user?.role.toLowerCase().includes(lowerCaseQuery) ||
          user?.email.toLowerCase().includes(lowerCaseQuery) ||
          user?.address.toLowerCase().includes(lowerCaseQuery)
      );
      setUsers(filteredusers);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Do you really want to delete this user?")) {
      const data = await deleteUser(id, user.token);
      if (data?.success) {
        toast.success(data?.message);
        window.location.reload();
      } else {
        toast.error(data?.message);
      }
    }
  };

  const handleRoleUpdate = (value) => {
    setRole(value);
    if (value === "all") {
      setUsers(data?.data);
    } else {
      setUsers(() => {
        return data?.data.filter((user) => user.role === value);
      });
    }
  };

  const handleCloseModal = () => {
    setEditUser(null);
    setRegisterUser(false);
  };

  return (
    <>
      <div className="container mx-auto my-8 max-w-[95%] text-sm ">
        <div className="mb-8 w-full">
          <div
            className={` ${isLoading ? "animate-pulse " : ""}
            rounded-lg py-4 px-8 text-white font-[500] duration-300 transition-all cursor-
            bg-gradient-to-tl from-secondary to-primary bg-[length:110%_110%] hoverbg-[length:125%_125%] flex items-center justify-between mb-6 w-full`}
          >
            <h1 className=" text-2xl md:text-3xl font-semibold text-custom-gradien w-fit">
              {registerUser
                ? "Register a User"
                : `${
                    role === "all"
                      ? "Users"
                      : role === "admin"
                      ? "Admins"
                      : role === "bank"
                      ? "Bank Staffs"
                      : role === "driver"
                      ? "Drivers"
                      : ""
                  } (${data?.success ? users.length : 0})`}
            </h1>
            <Button
              type="button"
              className=" text-base"
              variant={registerUser ? "danger" : "info"}
              onClick={() => {
                setRegisterUser(!registerUser);
              }}
            >
              {registerUser ? "Close" : "Register a User"}
            </Button>
          </div>

          <div>
            <div className=" flex items-center gap-4 mb-6 w-full relative ">
              <div className=" w-full flex items-center gap-6 flex-wrap">
                <Button
                  onClick={() => {
                    handleRoleUpdate("all");
                  }}
                >
                  All
                </Button>
                <Button
                  onClick={() => {
                    handleRoleUpdate("admin");
                  }}
                >
                  Only Admins
                </Button>
                <Button
                  onClick={() => {
                    handleRoleUpdate("bank");
                  }}
                >
                  Only Bank Staff
                </Button>
                <Button
                  onClick={() => {
                    handleRoleUpdate("driver");
                  }}
                >
                  Only Drivers
                </Button>
              </div>

              <input
                type="text"
                className="inputTag w-[40%]"
                placeholder="Search by name, email, reg, program, or department"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Search className=" absolute right-3 " />
            </div>
            <table
              className={` ${
                isLoading ? "animate-pulse " : ""
              } w-full border-collapse border border-gray-200 `}
            >
              <thead>
                <tr className="bg-gray-200">
                  <th className="thTag">Sr #</th>
                  <th className="thTag">Name</th>
                  <th className="thTag">Email</th>
                  <th className="thTag">Role</th>
                  <th className="thTag">Phone</th>
                  <th className="thTag">Address</th>
                  {role === "driver" && <th className="thTag">Bus</th>}
                  <th className="thTag">Actions</th>
                </tr>
              </thead>
              {data?.success ? (
                users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-red-500 text-center w-full py-4"
                    >
                      No users were found matching the keyword: {searchQuery}
                    </td>
                  </tr>
                ) : (
                  <tbody>
                    {users.map((user, index) => (
                      <>
                        <tr
                          key={user?._id}
                          className={` hover:bg-gray-300/80 ${
                            openUserId === user._id ? "bg-gray-300/80" : ""
                          }`}
                          onClick={() => {
                            if (openUserId === user._id) {
                              setOpenUserId("");
                            } else {
                              setOpenUserId(user._id);
                            }
                          }}
                        >
                          <td className="thTag">{index + 1}</td>
                          <td className="thTag">{user?.name}</td>
                          <td className="thTag">{user?.email}</td>
                          <td className="thTag">{user?.role}</td>
                          <td className="thTag">
                            <Link className=" text-blue-600 hover:underline" href={`tel:${user?.phone}`}>
                              {user?.phone}
                            </Link>
                          </td>
                          <td className="thTag">{user?.address}</td>
                          {role === "driver" && (
                            <td className="thTag">
                              {user?.bus?._id
                                ? user?.bus?.name
                                : <span className=" text-red-600">No bus assigned.</span>}
                            </td>
                          )}
                          <td className="thTag flex w-full h-full gap-2 items-center justify-around">
                            <SquarePen
                              onClick={() => {
                                setEditUser(user);
                              }}
                              className=" cursor-pointer w-5 h-5"
                            />
                            <Trash2
                              onClick={() => handleDeleteUser(user?._id)}
                              className=" cursor-pointer w-5 h-5 stroke-red-500"
                            />
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                )
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className=" text-red-500 text-center w-full py-4"
                  >
                    {data?.message}
                  </td>
                </tr>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* edit user  */}
      {editUser?._id && <EditUser data={editUser} onClose={handleCloseModal} />}

      {/* register user  */}
      {registerUser && <RegisterUser onClose={handleCloseModal} />}
    </>
  );
}
