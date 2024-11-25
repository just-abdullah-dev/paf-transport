import User from "@/models/User";
const { verify } = require("jsonwebtoken");

export const userAuthGuard = async (req) => {
  try {
    const headers = req.headers;
    const token = headers.get("authorization").split(" ")[1];
    const { id } = verify(token, process.env.JWT_SECRET);
    const data = await User.findById(id).select("-password");
    return { success: true, message: "Token verified", data };
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userAdminGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (authData?.data?.role === "admin") {
        return {
          success: true,
          message: "Token verified - User is Admin",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not an admin",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userDriverGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (authData?.data?.role === "driver") {
        return {
          success: true,
          message: "Token verified - User is driver",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not a driver",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userBankGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (authData?.data?.role === "bank") {
        return {
          success: true,
          message: "Token verified - User is bank member",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not a bank member",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};
