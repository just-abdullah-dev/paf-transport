"use client";
import Button from "@/components/utils/Button";
import { useAppSelector } from "@/lib/hooks";
import { getBuses } from "@/services";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Buses() {
  const [openBusId, setOpenBusId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [buses, setBuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      const data = await getBuses(user.token);
      setData(data);
      setBuses(data?.data);
      setIsLoading(false);
    };
    main();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      // Reset routes to original data when search is empty
      setBuses(data?.data);
    } else {
      // Filter routes based on search query
      const lowerCaseQuery = query.toLowerCase();
      const filteredItems = data?.data.filter(
        (bus) =>
          bus?.name.toLowerCase().includes(lowerCaseQuery) ||
          bus?.number.toLowerCase().includes(lowerCaseQuery) ||
          bus?.status.toLowerCase().includes(lowerCaseQuery) ||
          bus?.driver?.name.toLowerCase().includes(lowerCaseQuery)
      );
      setBuses(filteredItems);
    }
  };

  return (
    <div className="container mx-auto my-8 max-w-[90%] text-sm ">
      <div className="mb-8 w-full">
        {/* heading  */}
        <div
          className={` ${isLoading ? "animate-pulse " : ""}
            rounded-lg py-4 px-8 text-white font-[500] duration-300 transition-all cursor-
            bg-gradient-to-tl from-secondary to-primary bg-[length:110%_110%] hoverbg-[length:125%_125%] flex items-center justify-between mb-6 w-full`}
        >
          <h1 className=" text-2xl md:text-3xl font-semibold text-custom-gradien w-fit">
            Buses ({data?.success ? buses.length : 0})
          </h1>
        </div>
        <div>
          <div className="  mb-6 flex items-center justify-end relative">
            <input
              type="text"
              className="inputTag w-[40%]"
              placeholder="Search by name, number, driver name or status"
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
                <th className="thTag">Number</th>
                <th className="thTag">Seats</th>
                <th className="thTag">Status</th>
                <th className="thTag">Route</th>
                <th className="thTag">Driver</th>
              </tr>
            </thead>
            {data?.success ? (
              buses.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-red-500 text-center w-full py-4"
                  >
                    No bus were found matching the keyword: {searchQuery}
                  </td>
                </tr>
              ) : (
                <tbody>
                  {buses.map((bus, index) => (
                    <>
                      <tr
                        key={bus?._id}
                        className={`cursor-pointer hover:bg-gray-300/80 ${
                          openBusId === bus?._id ? "bg-gray-300/80" : ""
                        }`}
                        onClick={() => {
                          if (openBusId === bus?._id) {
                            setOpenBusId("");
                          } else {
                            setOpenBusId(bus?._id);
                          }
                        }}
                      >
                        <td className="thTag">{index + 1}</td>
                        <td className="thTag">{bus?.name}</td>
                        <td className="thTag">{bus?.number}</td>
                        <td className="thTag">{bus?.seats}</td>
                        <td className="thTag">{bus?.status}</td>
                        <td className="thTag">{bus?.route?.name}</td>
                        <td className="thTag">
                          <p className=" font-semibold">{bus?.driver?.name}</p>
                          <Link
                            className=" text-blue-500 hover:underline"
                            href={`tel:${bus?.driver?.phone}`}
                          >
                            {bus?.driver?.phone}
                          </Link>
                          <br />
                          <Link
                            className=" text-blue-500 hover:underline"
                            href={`mailto:${bus?.driver?.email}`}
                          >
                            {bus?.driver?.email}
                          </Link>
                          <p>{bus?.driver?.address}</p>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              )
            ) : (
              <tr>
                <td
                  colSpan="7"
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
  );
}
