"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import Button from "@/components/utils/Button";
import { deleteFee, getRouteFee } from "@/services";
import RegisterFee from "./RegisterFee";
import { Search, SquarePen, Trash2 } from "lucide-react";
import { toast } from "@/components/utils/Toast";
import EditFee from "./EditFee";

export default function FeeStructure() {
  const [isLoading, setIsLoading] = useState(true);

  const [editFee, setEditFee] = useState({});
  const [registerFee, setRegisterFee] = useState(false);
  const user = useAppSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [fees, setFees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      const data = await getRouteFee(user.token);
      setData(data);
      setFees(data?.data);
      setIsLoading(false);
    };
    main();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      // Reset fees to original data when search is empty
      setFees(data?.data);
    } else {
      // Filter fees based on search query
      const lowerCaseQuery = query.toLowerCase();
      const filteredfees = data?.data.filter(
        (fee) =>
          fee?.route?.name.toLowerCase().includes(lowerCaseQuery) ||
          fee?.route?.city.toLowerCase().includes(lowerCaseQuery) ||
          fee?.route?.road.toLowerCase().includes(lowerCaseQuery)
      );
      setFees(filteredfees);
    }
  };

  const handleDeleteFee = async (id) => {
    if (window.confirm("Do you really want to delete this fee structure?")) {
      const data = await deleteFee(id, user.token);
      if (data?.success) {
        toast.success(data?.message);
        window.location.reload();
      } else {
        toast.error(data?.message);
      }
    }
  };

  const handleCloseModal = () => {
    setEditFee(null);
    setRegisterFee(false);
  };
  
  return (
    <>
      <div className="container mx-auto my-8 max-w-[90%] text-sm ">
        <div className="mb-8 w-full">
          <div
            className={` ${isLoading ? "animate-pulse " : ""}
            rounded-lg py-4 px-8 text-white font-[500] duration-300 transition-all cursor-
            bg-gradient-to-tl from-secondary to-primary bg-[length:110%_110%] hoverbg-[length:125%_125%] flex items-center justify-between mb-6 w-full`}
          >
            <h1 className=" text-2xl md:text-3xl font-semibold text-custom-gradien w-fit">
              {registerFee
                ? "Register a Fee Structure"
                : `Fee Structure (${data?.success ? fees.length : 0})`}
            </h1>
            <Button
              type="button"
className=" text-base"
              variant={registerFee ? "danger" : "info"}
              onClick={() => {
                setRegisterFee(!registerFee);
              }}
            >
              {registerFee ? "Close" : "Register a Fee Structure"}
            </Button>
          </div>
          <div>
            <div className="  mb-6 flex items-center justify-end relative">
              <input
                type="text"
                className="inputTag w-1/3"
                placeholder="Search by route name, road, or city"
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
                  <th className="thTag">Road</th>
                  <th className="thTag">City</th>
                  <th className="thTag">Per Day</th>
                  <th className="thTag">Per Month</th>
                  <th className="thTag">Actions</th>
                </tr>
              </thead>
              {data?.success ? (
                fees.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-red-500 text-center w-full py-4"
                    >
                      No route was found matching the keyword: {searchQuery}
                    </td>
                  </tr>
                ) : (
                  <tbody>
                    {fees.map((fee, index) => (
                      <>
                        <tr
                          key={fee._id}
                          className={` hover:bg-gray-300/80 `}
                          
                        >
                          <td className="thTag">{index + 1}</td>
                          <td className="thTag">{fee?.route?.name}</td>
                          <td className="thTag">{fee?.route?.road}</td>
                          <td className="thTag">{fee?.route?.city}</td>
                          <td className="thTag">{fee?.perDay} Rs/-</td>
                          <td className="thTag">{fee?.perMonth} Rs/-</td>
                          <td className="thTag flex w-full h-full gap-2 items-center justify-around">
                            <SquarePen
                              onClick={() => {
                                setEditFee(fee);
                              }}
                              className=" cursor-pointer w-5 h-5"
                            />
                            <Trash2
                              onClick={() => handleDeleteFee(fee._id)}
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

      {/* edit fee  */}
      {editFee?._id && <EditFee data={editFee} onClose={handleCloseModal} />}

      {/* register fee  */}
      {registerFee && <RegisterFee onClose={handleCloseModal} />}
    </>
  );
}
