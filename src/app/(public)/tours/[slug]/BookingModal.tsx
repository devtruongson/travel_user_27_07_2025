/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { CalendarDatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { API, PUBLIC_API } from "@/lib/api";
import { RootState } from "@/lib/redux/store";
import { Dialog, Transition } from "@headlessui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function BookingModal({
    slug,
    open,
    onClose,
}: {
    slug: string;
    open: boolean;
    onClose: () => void;
}) {
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();

    const [tour, setTour] = useState<any>(null);
    const [services, setServices] = useState({
        guides: [],
        hotels: [],
        busRoutes: [],
        motorbikes: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        quantity: 1,
        start_date: null as Date | null,
        guide_id: "",
        hotel_id: "",
        bus_route_id: "",
        motorbike_id: "",
        payment_method: "COD",
    });

    const handleChange = (key: string, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleBooking = async () => {
        if (!form.start_date || !user || !tour) {
            toast.warning("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setIsLoading(true);
        try {
            const body = {
                user_id: user.id,
                tour_id: tour.tour_id,
                custom_tour_id: null,
                guide_id: form.guide_id || null,
                hotel_id: form.hotel_id || null,
                bus_route_id: form.bus_route_id || null,
                motorbike_id: form.motorbike_id || null,
                quantity: form.quantity,
                start_date: dayjs(form.start_date).format("YYYY-MM-DD"),
                total_price:
                    parseInt(tour.discount_price || tour.price) * form.quantity,
                payment_method_id: form.payment_method,
                status: "pending",
            };

            const res = await API.post("/bookings", body);

            toast.success("Đặt tour thành công! 🎉");
            onClose();

            if (res.data.payment_url) {
                window.open(res.data.payment_url, "_blank");
            }
        } catch (error: any) {
            toast.error("Đặt tour thất bại. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!open) return;

        if (!user) {
            toast.warning("Vui lòng đăng nhập để đặt tour");
            return;
        }

        const fetchData = async () => {
            try {
                const [tourRes, guideRes, hotelRes, busRes, bikeRes] =
                    await Promise.all([
                        PUBLIC_API.get(`/tours/slug/${slug}`),
                        PUBLIC_API.get("/guides"),
                        PUBLIC_API.get("/hotels"),
                        PUBLIC_API.get("/bus-routes"),
                        PUBLIC_API.get("/motorbikes"),
                    ]);

                setTour(tourRes.data);
                setServices({
                    guides: guideRes.data,
                    hotels: hotelRes.data,
                    busRoutes: busRes.data,
                    motorbikes: bikeRes.data,
                });
            } catch (err) {
                toast.error("Lỗi tải dữ liệu tour");
                onClose();
            }
        };

        fetchData();
    }, [open]);

    const endDate =
        form.start_date && tour?.duration
            ? dayjs(form.start_date)
                  .add(tour.duration, "day")
                  .format("DD/MM/YYYY")
            : null;

    const totalPrice = tour
        ? parseInt(tour.discount_price || tour.price) * form.quantity
        : 0;

    if (!user) return null;

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                                {/* Header */}
                                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-6 text-white">
                                    <button
                                        onClick={onClose}
                                        className="absolute right-4 top-4 rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">✈️</div>
                                        <Dialog.Title className="text-2xl font-bold mb-2">
                                            Đặt Tour Du Lịch
                                        </Dialog.Title>
                                        <p className="text-lg opacity-90">
                                            {tour?.tour_name}
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                    {/* Tour Info Card */}
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Giá tour
                                                </p>
                                                {tour?.discount_price ? (
                                                    <div>
                                                        <p className="text-sm text-gray-400 line-through">
                                                            {parseInt(
                                                                tour.price
                                                            ).toLocaleString()}
                                                            ₫
                                                        </p>
                                                        <p className="text-xl font-bold text-red-600">
                                                            {parseInt(
                                                                tour.discount_price
                                                            ).toLocaleString()}
                                                            ₫
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xl font-bold text-blue-600">
                                                        {tour?.price
                                                            ? parseInt(
                                                                  tour.price
                                                              ).toLocaleString()
                                                            : 0}
                                                        ₫
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">
                                                    Thời gian
                                                </p>
                                                <p className="font-semibold text-gray-800">
                                                    {tour?.duration}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Form */}
                                    <div className="space-y-6">
                                        {/* Quantity and Date */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                                                    <span>👥</span>
                                                    <span>
                                                        Số người tham gia
                                                    </span>
                                                </label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={form.quantity}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "quantity",
                                                            parseInt(
                                                                e.target.value
                                                            ) || 1
                                                        )
                                                    }
                                                    className="rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                                                    <span>📅</span>
                                                    <span>Ngày khởi hành</span>
                                                </label>
                                                <CalendarDatePicker
                                                    value={form.start_date}
                                                    onChange={(date) =>
                                                        handleChange(
                                                            "start_date",
                                                            date
                                                        )
                                                    }
                                                />
                                                {endDate && (
                                                    <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                                                        🏁 Ngày kết thúc dự
                                                        kiến:{" "}
                                                        <strong>
                                                            {endDate}
                                                        </strong>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Services Selection */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                                <span>⚙️</span>
                                                <span>
                                                    Dịch vụ bổ sung (tùy chọn)
                                                </span>
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    {
                                                        label: "🗣️ Hướng dẫn viên",
                                                        key: "guide_id",
                                                        options:
                                                            services.guides,
                                                        id: "guide_id",
                                                        name: "name",
                                                    },
                                                    {
                                                        label: "🏨 Khách sạn",
                                                        key: "hotel_id",
                                                        options:
                                                            services.hotels,
                                                        id: "hotel_id",
                                                        name: "name",
                                                    },
                                                    {
                                                        label: "🚌 Xe khách",
                                                        key: "bus_route_id",
                                                        options:
                                                            services.busRoutes,
                                                        id: "route_id",
                                                        name: "name",
                                                    },
                                                    {
                                                        label: "🏍️ Xe máy",
                                                        key: "motorbike_id",
                                                        options:
                                                            services.motorbikes,
                                                        id: "bike_id",
                                                        name: "name",
                                                    },
                                                ].map(
                                                    ({
                                                        label,
                                                        key,
                                                        options,
                                                        id,
                                                        name,
                                                    }) => (
                                                        <div
                                                            key={key}
                                                            className="space-y-2"
                                                        >
                                                            <label className="text-sm font-medium text-gray-700">
                                                                {label}
                                                            </label>
                                                            <select
                                                                value={
                                                                    form[
                                                                        key as keyof typeof form
                                                                    ] as any
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(
                                                                        key,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                                                            >
                                                                <option value="">
                                                                    Không chọn
                                                                </option>
                                                                {options.map(
                                                                    (
                                                                        item: any
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                item[
                                                                                    id
                                                                                ] +
                                                                                "_fstack"
                                                                            }
                                                                            value={
                                                                                item[
                                                                                    id
                                                                                ]
                                                                            }
                                                                        >
                                                                            {
                                                                                item[
                                                                                    name
                                                                                ]
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* Payment Method */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                                <span>💳</span>
                                                <span>
                                                    Phương thức thanh toán
                                                </span>
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    {
                                                        value: "0",
                                                        label: "💵 Thanh toán khi nhận",
                                                        color: "from-green-400 to-green-600",
                                                    },
                                                    {
                                                        value: "1",
                                                        label: "🏧 VNPay",
                                                        color: "from-red-400 to-red-600",
                                                    },
                                                ].map((method) => (
                                                    <label
                                                        key={method.value}
                                                        className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                            form.payment_method ===
                                                            method.value
                                                                ? "border-blue-500 bg-blue-50"
                                                                : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="payment_method"
                                                            value={method.value}
                                                            checked={
                                                                form.payment_method ===
                                                                method.value
                                                            }
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    "payment_method",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="sr-only"
                                                        />
                                                        <div className="text-center">
                                                            <div className="text-sm font-medium text-gray-700">
                                                                {method.label}
                                                            </div>
                                                        </div>
                                                        {form.payment_method ===
                                                            method.value && (
                                                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                                                ✓
                                                            </div>
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="bg-gray-50 px-8 py-6 rounded-b-3xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Tổng thanh toán
                                            </p>
                                            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                {totalPrice.toLocaleString()}₫
                                            </p>
                                        </div>
                                        <div className="text-right text-sm text-gray-500">
                                            <p>
                                                {form.quantity} người ×{" "}
                                                {tour?.discount_price
                                                    ? parseInt(
                                                          tour.discount_price
                                                      ).toLocaleString()
                                                    : tour?.price
                                                    ? parseInt(
                                                          tour.price
                                                      ).toLocaleString()
                                                    : "0"}
                                                ₫
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <Button
                                            onClick={onClose}
                                            variant="outline"
                                            className="flex-1 rounded-xl border-2 border-gray-300 hover:bg-gray-50"
                                        >
                                            Hủy bỏ
                                        </Button>
                                        <Button
                                            onClick={handleBooking}
                                            disabled={
                                                isLoading || !form.start_date
                                            }
                                            className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Đang xử lý...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <span>🎯</span>
                                                    <span>
                                                        Xác nhận đặt tour
                                                    </span>
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
