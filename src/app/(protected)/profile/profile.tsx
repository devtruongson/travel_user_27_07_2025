"use client";

import styles from "./style.module.css";
import Image from "next/image";
import BannerPage from "@/layouts/banner";
import MotionFade from "@/components/motionFade";
import CustomButton from "@/components/customButton";
import { MdTour } from "react-icons/md";
import { RiHeartAddFill } from "react-icons/ri";
import UpdateInfo from "./update";
import { useState } from "react";
import { toast } from "sonner";
import { API } from "@/lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProfileClient() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateAvatar = async () => {
    if (!selectedAvatarFile || !user) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", selectedAvatarFile);

      await API.put("/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Cập nhật avatar thành công");

      setPreviewUrl(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Lỗi cập nhật avatar");
    } finally {
      setLoading(false);
    }
  };

  const info = [
    { label: "Email:", value: user?.email },
    {
      label: "Ngày tham gia:",
      value: user?.created_at
        ? new Date(user.created_at).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        : "Không rõ",
    },
    { label: "Số điện thoại:", value: user?.phone || "Chưa cập nhật" },
    {
      label: "Trạng thái:",
      value: user?.is_verified ? (
        <span className="inline-block px-2 py-1 text-[14px] font-bold text-green-800 bg-green-100 rounded-full">
          Đã xác thực
        </span>
      ) : (
        <span className="inline-block px-2 py-1 text-[14px] font-bold text-red-800 bg-red-100 rounded-full">
          Chưa xác thực
        </span>
      ),
    },
  ];

  return (
    <div>
      <BannerPage classNameSection={`${styles.banner} h-[500px] w-full`}>
        <div className="container relative z-2 h-full flex items-center justify-end">
          <MotionFade animation="fadeInBottomToTop">
            <h1 className={`${styles.mainTitle} font-[900] text-[150px] text-center leading-[1]`}>
              VTRAVEL
            </h1>
          </MotionFade>
        </div>
      </BannerPage>
      <section className="container relative pb-12 flex gap-10">
        <div className="w-[400px] h-full flex flex-col gap-4 items-center">
          <Image
            src={previewUrl || user?.avatar_url || "/images/avatar-default.png"}
            alt={user?.full_name || "avatar"}
            width={400}
            height={400}
            className="w-[400px] h-[400px] rounded-full border-6 border-white shadow-2xl object-cover"
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          <CustomButton
            onClick={handleUpdateAvatar}
            disabled={loading || !selectedAvatarFile}
            className="text-[#fff] bg-cyan-600 hover:bg-cyan-700 px-8 py-3 cursor-pointer flex text-[17px] font-bold"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật avatar"}
          </CustomButton>
        </div>
        <div>
          <p className="py-8 text-5xl font-extrabold text-[#005a69]">{user?.full_name}</p>
          <div className="grid grid-cols-2 gap-6">
            {info.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="inline-block font-bold text-[20px]">{item.label}</span>
                <span className="inline-block font-bold text-[#616161] text-[20px]">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Dialog>
              <DialogTrigger asChild>
                <CustomButton className="text-[#fff] bg-cyan-600 hover:bg-cyan-700 px-8 py-5 cursor-pointer flex text-[17px] font-bold">
                  Cập nhật hồ sơ
                </CustomButton>
              </DialogTrigger>
              <DialogContent className="w-[600px]">
                <DialogHeader>
                  <DialogTitle>Cập nhật thông tin</DialogTitle>
                  <DialogDescription>
                    Thực hiện thay đổi cho hồ sơ của bạn tại đây. Nhấp vào lưu khi bạn hoàn tất.
                  </DialogDescription>
                </DialogHeader>
                <UpdateInfo user={user} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
      <section className="container py-24">
        <Tabs defaultValue="booked" className="w-full">
          <TabsList className="flex border-b gap-5 border-gray-200 bg-transparent">
            <TabsTrigger
              value="booked"
              className="text-[18px] flex data-[state=active]:bg-transparent items-center gap-2 px-4 py-2 text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 transition-all duration-200 data-[state=active]:shadow-none cursor-pointer"
            >
              <MdTour className="h-5 w-5" />
              Tours đã đặt
            </TabsTrigger>
            <TabsTrigger
              value="favorite"
              className="text-[18px] flex data-[state=active]:bg-transparent items-center gap-2 px-4 py-2 text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 transition-all duration-200 data-[state=active]:shadow-none cursor-pointer"
            >
              <RiHeartAddFill className="h-5 w-5" />
              Tours yêu thích
            </TabsTrigger>
          </TabsList>
          <TabsContent value="booked" className="pt-4">
            Chưa có tour nào được chọn.
          </TabsContent>
          <TabsContent value="favorite" className="pt-4">
            Bạn chưa thêm tour yêu thích nào.
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
