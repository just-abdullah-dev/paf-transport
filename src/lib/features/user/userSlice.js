"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

// Define the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("Yes setUser run.", action.payload);
      return { ...action.payload };
    },
    clearUser: () => {
      return {}; 
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
