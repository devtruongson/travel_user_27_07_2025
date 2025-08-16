/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import styles from "./style.module.css";
import Image from "next/image";
import BannerPage from "@/layouts/banner";
import MotionFade from "@/components/motionFade";
import CustomButton from "@/components/customButton";
import UpdateInfo from "./update";
import { useCallback, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { API } from "@/lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Booking {
    booking_id: number;
    user_id: number;
    tour_id: number;
    guide_id: number | null;
    hotel_id: number | null;
    bus_route_id: number | null;
    motorbike_id: number | null;
    custom_tour_id: number | null;
    quantity: number;
    start_date: string;
    end_date: string | null;
    total_price: string;
    status: string;
    cancel_reason: string | null;
    is_deleted: string;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        full_name: string;
        email: string;
        phone: string;
        avatar: string | null;
        role: string;
        is_deleted: string;
        is_verified: number;
        created_at: string;
        updated_at: string;
        avatar_url: string | null;
    };
    tour: {
        tour_id: number;
        category_id: number;
        album_id: number;
        guide_id: number | null;
        bus_route_id: number | null;
        tour_name: string;
        description: string;
        itinerary: string;
        image: string;
        price: string;
        discount_price: string;
        duration: string;
        status: string;
        is_deleted: string;
        slug: string;
        created_at: string;
        updated_at: string;
    };
    guide: {
        guide_id: number;
        name: string;
        gender: string;
        language: string;
        experience_years: number;
        album_id: number;
        price_per_day: string;
        description: string | null;
        phone: string;
        email: string;
        average_rating: number;
        is_available: boolean;
        is_deleted: string;
        created_at: string;
        updated_at: string;
    } | null;
    hotel: {
        hotel_id: number;
        name: string;
        location: string;
        room_type: string;
        price: string;
        description: string;
        image: string;
        album_id: number;
        contact_phone: string;
        contact_email: string;
        average_rating: number;
        is_available: boolean;
        max_guests: number;
        facilities: string;
        bed_type: string;
        is_deleted: string;
        created_at: string;
        updated_at: string;
    } | null;
    bus_route: any | null;
    motorbike: any | null;
    custom_tour: any | null;
}

// Badge component
const Badge = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
        {children}
    </span>
);

export default function CombinedProfileClient() {
    const user = useSelector((state: RootState) => state.auth.user);

    // Profile states
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
        null
    );
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);

    // Booking states
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingLoading, setBookingLoading] = useState(true);
    const [filter, setFilter] = useState<
        "all" | "pending" | "confirmed" | "cancelled"
    >("all");

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            setBookingLoading(true);
            const response = await API.get("/bookings/me/my-booking");
            setBookings(response.data.data);
        } catch (error: any) {
            toast.error("Không thể tải danh sách đặt tour");
            console.log("Error fetching bookings:", error);
        } finally {
            setBookingLoading(false);
        }
    };

    // Profile handlers
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdateAvatar = useCallback(async () => {
        if (!selectedAvatarFile || !user) return;
        setProfileLoading(true);
        try {
            const formData = new FormData();
            formData.append("avatar", selectedAvatarFile);

            await API.put(`/user/${user?.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Cập nhật avatar thành công");
            setPreviewUrl(null);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Lỗi cập nhật avatar"
            );
        } finally {
            setProfileLoading(false);
        }
    }, [selectedAvatarFile, user]);

    // Booking handlers
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed":
                return "bg-green-100 text-green-800 border-green-200";
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed":
                return "✅ Đã xác nhận";
            case "pending":
                return "⏳ Đang chờ";
            case "cancelled":
                return "❌ Đã hủy";
            default:
                return status;
        }
    };

    const filteredBookings = useMemo(
        () =>
            !bookings?.length
                ? []
                : bookings.filter((booking) => {
                      if (filter === "all") return true;
                      return booking.status.toLowerCase() === filter;
                  }),
        [bookings, filter]
    );

    const handleCancelBooking = async (bookingId: number) => {
        if (!confirm("Bạn có chắc chắn muốn hủy booking này?")) return;

        try {
            await API.put(`/bookings/${bookingId}/cancel`);
            toast.success("Hủy booking thành công");
            fetchBookings();
        } catch (error) {
            toast.error("Không thể hủy booking");
        }
    };

    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === "string" ? parseFloat(price) : price;
        return numPrice.toLocaleString("vi-VN");
    };

    const getEndDate = (startDate: string, duration: string) => {
        const start = dayjs(startDate);
        const daysMatch = duration.match(/(\d+)\s*ngày/);
        const days = daysMatch ? parseInt(daysMatch[1]) : 1;
        return start.add(days - 1, "day");
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

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Yêu cầu đăng nhập
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Vui lòng đăng nhập để xem thông tin cá nhân
                    </p>
                    <Link href="/login">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            Đăng nhập ngay
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <BannerPage classNameSection={`${styles.banner} h-[500px] w-full`}>
                <div className="container relative z-2 h-full flex items-center justify-end">
                    <MotionFade animation="fadeInBottomToTop">
                        <h1
                            className={`${styles.mainTitle} font-[900] text-[150px] text-center leading-[1]`}
                        >
                            VTRAVEL
                        </h1>
                    </MotionFade>
                </div>
            </BannerPage>

            <div className="container mx-auto px-4 py-12">
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="profile" className="text-lg py-3">
                            👤 Thông tin cá nhân
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="text-lg py-3">
                            📋 Đơn hàng của tôi
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex flex-col lg:flex-row gap-10">
                                <div className="lg:w-[400px] flex flex-col gap-4 items-center">
                                    <Image
                                        src={
                                            previewUrl ||
                                            user?.avatar_url ||
                                            "/images/avatar-default.png"
                                        }
                                        alt={user?.full_name || "avatar"}
                                        width={400}
                                        height={400}
                                        className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] rounded-full border-6 border-white shadow-2xl object-cover"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <CustomButton
                                        onClick={handleUpdateAvatar}
                                        disabled={
                                            profileLoading ||
                                            !selectedAvatarFile
                                        }
                                        className="text-[#fff] bg-cyan-600 hover:bg-cyan-700 px-8 py-3 cursor-pointer flex text-[17px] font-bold rounded-lg"
                                    >
                                        {profileLoading
                                            ? "Đang cập nhật..."
                                            : "Cập nhật avatar"}
                                    </CustomButton>
                                </div>
                                <div className="flex-1">
                                    <p className="py-8 text-4xl lg:text-5xl font-extrabold text-[#005a69]">
                                        {user?.full_name}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {info.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-2 items-center"
                                            >
                                                <span className="inline-block font-bold text-[18px] lg:text-[20px]">
                                                    {item.label}
                                                </span>
                                                <span className="inline-block font-bold text-[#616161] text-[18px] lg:text-[20px]">
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <CustomButton className="text-[#fff] bg-cyan-600 hover:bg-cyan-700 px-8 py-5 cursor-pointer flex text-[17px] font-bold rounded-lg">
                                                    Cập nhật hồ sơ
                                                </CustomButton>
                                            </DialogTrigger>
                                            <DialogContent className="w-[600px]">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Cập nhật thông tin
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Thực hiện thay đổi cho
                                                        hồ sơ của bạn tại đây.
                                                        Nhấp vào lưu khi bạn
                                                        hoàn tất.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <UpdateInfo user={user} />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Orders Tab */}
                    <TabsContent value="orders" className="space-y-6">
                        {/* Filter Tabs */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {[
                                    {
                                        key: "all",
                                        label: "📊 Tất cả",
                                        count: bookings?.length || 0,
                                    },
                                    {
                                        key: "pending",
                                        label: "⏳ Chờ xử lý",
                                        count: !bookings?.length
                                            ? 0
                                            : bookings.filter(
                                                  (b) => b.status === "pending"
                                              ).length,
                                    },
                                    {
                                        key: "confirmed",
                                        label: "✅ Đã xác nhận",
                                        count: !bookings?.length
                                            ? 0
                                            : bookings.filter(
                                                  (b) =>
                                                      b.status === "confirmed"
                                              ).length,
                                    },
                                    {
                                        key: "cancelled",
                                        label: "❌ Đã hủy",
                                        count: !bookings?.length
                                            ? 0
                                            : bookings.filter(
                                                  (b) =>
                                                      b.status === "cancelled"
                                              ).length,
                                    },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() =>
                                            setFilter(tab.key as any)
                                        }
                                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                                            filter === tab.key
                                                ? "bg-blue-600 text-white shadow-lg scale-105"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {tab.label} ({tab.count})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Loading State */}
                        {bookingLoading && (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center space-x-3">
                                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    <span className="text-lg text-gray-600">
                                        Đang tải dữ liệu...
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!bookingLoading && filteredBookings.length === 0 && (
                            <div className="text-center py-16">
                                <div className="text-8xl mb-6">🌴</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    {filter === "all"
                                        ? "Chưa có booking nào"
                                        : `Không có booking ${filter}`}
                                </h3>
                                <p className="text-gray-600 mb-8">
                                    Hãy khám phá và đặt những chuyến du lịch
                                    tuyệt vời!
                                </p>
                                <Link href="/tours">
                                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl cursor-pointer">
                                        🎯 Khám phá tour ngay
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Bookings List */}
                        {!bookingLoading && filteredBookings.length > 0 && (
                            <div className="space-y-6">
                                {filteredBookings.map((booking) => (
                                    <div
                                        key={booking.booking_id}
                                        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
                                    >
                                        {/* Card Header */}
                                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                <div className="mb-2 md:mb-0">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                        {booking.tour
                                                            ?.tour_name ||
                                                            "Custom Tour"}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Booking ID: #
                                                        {booking.booking_id} •
                                                        Đặt lúc:{" "}
                                                        {dayjs(
                                                            booking.created_at
                                                        ).format(
                                                            "DD/MM/YYYY HH:mm"
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge
                                                        className={`${getStatusColor(
                                                            booking.status
                                                        )} border`}
                                                    >
                                                        {getStatusText(
                                                            booking.status
                                                        )}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {/* Tour Info */}
                                                <div className="space-y-3">
                                                    <h4 className="font-semibold text-gray-800 flex items-center">
                                                        <span className="mr-2">
                                                            🎯
                                                        </span>
                                                        Thông tin tour
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center">
                                                            <span className="w-6">
                                                                👥
                                                            </span>
                                                            <span>
                                                                {
                                                                    booking.quantity
                                                                }{" "}
                                                                người
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="w-6">
                                                                📅
                                                            </span>
                                                            <span>
                                                                {dayjs(
                                                                    booking.start_date
                                                                ).format(
                                                                    "DD/MM/YYYY"
                                                                )}
                                                                {booking?.tour
                                                                    ?.duration && (
                                                                    <>
                                                                        {" "}
                                                                        -{" "}
                                                                        {getEndDate(
                                                                            booking.start_date,
                                                                            booking
                                                                                .tour
                                                                                .duration
                                                                        ).format(
                                                                            "DD/MM/YYYY"
                                                                        )}
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="w-6">
                                                                ⏱️
                                                            </span>
                                                            <span>
                                                                {
                                                                    booking
                                                                        ?.tour
                                                                        ?.duration
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="w-6">
                                                                💰
                                                            </span>
                                                            <span className="font-bold text-blue-600">
                                                                {formatPrice(
                                                                    booking.total_price
                                                                )}
                                                                ₫
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Services */}
                                                <div className="space-y-3">
                                                    <h4 className="font-semibold text-gray-800 flex items-center">
                                                        <span className="mr-2">
                                                            ⚙️
                                                        </span>
                                                        Dịch vụ
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        {booking.guide && (
                                                            <div className="flex items-center">
                                                                <span className="w-6">
                                                                    🗣️
                                                                </span>
                                                                <span>
                                                                    {
                                                                        booking
                                                                            .guide
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        {booking.hotel && (
                                                            <div className="flex items-center">
                                                                <span className="w-6">
                                                                    🏨
                                                                </span>
                                                                <span>
                                                                    {
                                                                        booking
                                                                            .hotel
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        {booking.bus_route && (
                                                            <div className="flex items-center">
                                                                <span className="w-6">
                                                                    🚌
                                                                </span>
                                                                <span>
                                                                    Xe buýt
                                                                </span>
                                                            </div>
                                                        )}
                                                        {booking.motorbike && (
                                                            <div className="flex items-center">
                                                                <span className="w-6">
                                                                    🏍️
                                                                </span>
                                                                <span>
                                                                    Xe máy
                                                                </span>
                                                            </div>
                                                        )}
                                                        {!booking.guide &&
                                                            !booking.hotel &&
                                                            !booking.bus_route &&
                                                            !booking.motorbike && (
                                                                <p className="text-gray-500 italic">
                                                                    Không có
                                                                    dịch vụ bổ
                                                                    sung
                                                                </p>
                                                            )}
                                                    </div>
                                                </div>

                                                {/* Contact Info */}
                                                <div className="space-y-3">
                                                    <h4 className="font-semibold text-gray-800 flex items-center">
                                                        <span className="mr-2">
                                                            📞
                                                        </span>
                                                        Thông tin liên hệ
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center">
                                                            <span className="w-6">
                                                                👤
                                                            </span>
                                                            <span>
                                                                {
                                                                    booking.user
                                                                        .full_name
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="w-6">
                                                                📱
                                                            </span>
                                                            <span>
                                                                {
                                                                    booking.user
                                                                        .phone
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="w-6">
                                                                📧
                                                            </span>
                                                            <span className="break-all">
                                                                {
                                                                    booking.user
                                                                        .email
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tour Description */}
                                            {booking.tour?.description && (
                                                <div className="mt-6 pt-4 border-t border-gray-100">
                                                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                                        <span className="mr-2">
                                                            📝
                                                        </span>
                                                        Mô tả tour
                                                    </h4>
                                                    <p className="text-sm text-gray-600 line-clamp-3">
                                                        {
                                                            booking.tour
                                                                ?.description
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {/* Cancel Reason */}
                                            {booking.cancel_reason && (
                                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-sm text-red-800">
                                                        <strong>
                                                            Lý do hủy:
                                                        </strong>{" "}
                                                        {booking.cancel_reason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
