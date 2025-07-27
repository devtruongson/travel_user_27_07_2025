"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth, clearAuth } from "@/lib/redux/slices/authSlice";
import { API } from "@/lib/api";

export function useAuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      API.get("/me")
        .then((res) => {
          dispatch(setAuth({ user: res.data, accessToken }));
        })
        .catch(() => {
          dispatch(clearAuth());
          localStorage.removeItem("access_token");
        });
    }
  }, []);
}
