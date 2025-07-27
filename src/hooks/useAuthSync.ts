import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setAuth } from "@/lib/redux/slices/authSlice";

export function useAuthSync() {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token && !isAuthenticated) {
      API.get("/me")
        .then((res) => {
          dispatch(setAuth({ user: res.data.user, accessToken: token }));
        })
        .finally(() => {
          setIsChecked(true);
        });
    } else {
      setIsChecked(true); 
    }
  }, [dispatch, isAuthenticated]);

  return isChecked;
}
