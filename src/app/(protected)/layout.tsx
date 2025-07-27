"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useAuthSync } from "@/hooks/useAuthSync";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const isChecked = useAuthSync();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isChecked && !isAuthenticated) {
      notFound();
    }
  }, [isChecked, isAuthenticated]);

  if (!isChecked) {
    return (
      <div className="absolute w-screen h-screen z-50 bg-white text-black flex justify-center items-center">
        <p>Đang kiểm tra đăng nhập...</p>
      </div>
    );
  }

  return <>{children}</>;
}
