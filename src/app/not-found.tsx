"use client";
import Link from "next/link";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function NotFoundPage() {
  return (
    <div className="bg-[#fff] text-center absolute w-screen h-screen z-50 flex justify-center items-center">
      <div>
        <h1 className="text-3xl font-bold text-red-500">404 - Không tìm thấy trang</h1>
        <div className="flex justify-center items-center my-10">
          <DotLottieReact
            src="/lottie/not-fount.lottie"
            loop
            autoplay
            className="w-[600px]"
          />
        </div>
        <p className="mt-2 text-gray-600">Bạn không có quyền truy cập trang này hoặc đường dẫn không tồn tại.</p>
        <div>
          <Link href="/" className="inline-block bg-blue-300 rounded-[6px] cursor-pointer py-3 px-20 mt-10 hover:bg-cyan-500">Quay về trang chủ</Link>
        </div>
      </div>
    </div>
  );
}
