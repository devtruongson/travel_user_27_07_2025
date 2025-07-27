import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "@/lib/api";
import { clearAuth } from "../slices/authSlice";
import { toast } from "sonner";

export const logout = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  try {
    console.log("Đang gọi API logout trên server...");
    await API.post("/logout");
    console.log("Đã gọi API logout");
    toast.success("Đăng xuất thành công");
  } catch (error: any) {
    console.warn("⚠️ Logout failed on server, proceeding with local logout");
  } finally {
    localStorage.removeItem("access_token");
    dispatch(clearAuth());
  }
});
