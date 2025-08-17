/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { CalendarDatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { times } from "@/constants";
import { API, PUBLIC_API } from "@/lib/api";
import { RootState } from "@/lib/redux/store";
import { Dialog, Transition } from "@headlessui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function BookingModal({
    slug,
    open,
    onClose,
    isCustom,
    data,
}: {
    slug?: string;
    open: boolean;
    onClose: () => void;
    isCustom?: boolean;
    data?: {
        destination_id: number;
        vehicle: string;
        duration?: string;
        note?: string;
    };
}) {
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();
    const [tour, setTour] = useState<any>(null);
    const [form, setForm] = useState({
        quantity: 1,
        start_date: null as Date | null,
        guide_id: "",
        hotel_id: "",
        bus_route_id: "",
        motorbike_id: "",
        payment_method: "1",
        promotion_code: "",
    });
    const [services, setServices] = useState({
        guides: [] as any[],
        hotels: [] as any[],
        busRoutes: [] as any[],
        motorbikes: [] as any[],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifyingPromo, setIsVerifyingPromo] = useState(false);
    const [isLoadingPromotions, setIsLoadingPromotions] = useState(false);
    const [promoInfo, setPromoInfo] = useState<null | {
        discount_type: string;
        discount_value: number;
        discount_amount: number;
    }>(null);
    const [availablePromotions, setAvailablePromotions] = useState<any[]>([]);
    const [showPromotions, setShowPromotions] = useState(false);

    // Tính giá trước khi áp dụng mã giảm giá
    const basePrice = useMemo(() => {
        if (tour) {
            return (
                parseInt(tour?.discount_price || tour?.price || 0) *
                (form?.quantity || 1)
            );
        }

        let p = 1200000;
        const priceVehicle =
            data?.vehicle === "airplane"
                ? 2000000
                : data?.vehicle === "bus"
                ? 300000
                : data?.vehicle === "train"
                ? 200000
                : 0;

        const priceHotel =
            services?.hotels?.find(
                (h: any) =>
                    h?.hotel_id?.toString() === form?.hotel_id?.toString()
            )?.price || 0;

        const priceGuide =
            services?.guides?.find(
                (g: any) =>
                    g?.guide_id?.toString() === form?.guide_id?.toString()
            )?.price_per_day || 0;

        const priceBus =
            services?.busRoutes?.find(
                (b: any) =>
                    b?.bus_route_id?.toString() ===
                    form?.bus_route_id?.toString()
            )?.price || 0;

        const priceBike =
            services?.motorbikes?.find(
                (b: any) =>
                    b?.motorbike_id?.toString() ===
                    form?.motorbike_id?.toString()
            )?.price_per_day || 0;

        const totalPriceService =
            Number(priceBus || 0) +
            Number(priceHotel || 0) +
            Number(priceGuide || 0) +
            Number(priceBike || 0);

        if (data?.duration === "1") {
            p = 1200000 + 2 * totalPriceService;
        } else if (data?.duration === "2") {
            p = 1200000 + 3 * totalPriceService;
        } else if (data?.duration === "3") {
            p = 1200000 + 4 * totalPriceService;
        } else if (data?.duration === "4") {
            p = 1200000 + 5 * totalPriceService;
        }

        return (p + priceVehicle) * (form?.quantity || 1);
    }, [
        data?.duration,
        data?.vehicle,
        form?.bus_route_id,
        form?.guide_id,
        form?.hotel_id,
        form?.motorbike_id,
        form?.quantity,
        services?.busRoutes,
        services?.guides,
        services?.hotels,
        services?.motorbikes,
        tour,
    ]);

    // Tính giá sau khi áp dụng mã giảm giá
    const finalPrice = useMemo(() => {
        if (!promoInfo) return basePrice;

        return Math.max(0, basePrice - (promoInfo?.discount_amount || 0));
    }, [basePrice, promoInfo]);

    const handleChange = (key: string, value: any) => {
        // Kiểm tra nếu đang thay đổi quantity và có tour data với min_people
        if (key === "quantity" && tour?.min_people) {
            const minPeople = tour.min_people;
            const newQuantity = parseInt(value) || 1;

            if (newQuantity < minPeople) {
                toast.warning(`Tour này yêu cầu tối thiểu ${minPeople} người.`);
                setForm((prev) => ({ ...prev, [key]: minPeople }));
                return;
            }
        }

        setForm((prev) => ({ ...prev, [key]: value }));

        // Reset promo info if code is cleared
        if (key === "promotion_code" && !value) {
            setPromoInfo(null);
        }
    };

    // Xác thực mã giảm giá
    const verifyPromoCode = async () => {
        if (!form?.promotion_code) {
            toast.warning("Vui lòng nhập mã giảm giá");
            return;
        }

        setIsVerifyingPromo(true);
        try {
            const response = await PUBLIC_API.post("/promotions/validate", {
                code: form.promotion_code,
                order_total: basePrice,
            });

            if (response?.data?.success) {
                const { promotion, discount_amount } =
                    response?.data?.data || {};
                setPromoInfo({
                    discount_type: promotion?.discount_type || "fixed",
                    discount_value: promotion?.discount_value || 0,
                    discount_amount: discount_amount || 0,
                });
                toast.success("Áp dụng mã giảm giá thành công");
            } else {
                setPromoInfo(null);
                toast.error(
                    response?.data?.message || "Mã giảm giá không hợp lệ"
                );
            }
        } catch (error: any) {
            setPromoInfo(null);
            toast.error(
                error?.response?.data?.message ||
                    "Không thể xác thực mã giảm giá"
            );
        } finally {
            setIsVerifyingPromo(false);
        }
    };

    // Lấy danh sách mã giảm giá có sẵn
    const fetchAvailablePromotions = async () => {
        setIsLoadingPromotions(true);
        try {
            const response = await PUBLIC_API.get("/promotions/available", {
                params: {
                    order_total: basePrice, // Gửi thêm giá trị đơn hàng để server lọc mã phù hợp
                },
            });
            if (response?.data?.success) {
                setAvailablePromotions(response?.data?.data || []);
                return response?.data?.data || [];
            } else {
                setAvailablePromotions([]);
                return [];
            }
        } catch (error) {
            console.error("Error fetching promotions:", error);
            setAvailablePromotions([]);
            return [];
        } finally {
            setIsLoadingPromotions(false);
        }
    };

    // Xử lý khi click vào nút "Chọn mã"
    const handleShowPromotions = async () => {
        if (showPromotions) {
            // Nếu đang hiển thị, ẩn dropdown
            setShowPromotions(false);
        } else {
            // Nếu chưa hiển thị, gọi API lấy danh sách mã và hiển thị dropdown
            setShowPromotions(true);

            // Nếu chưa có danh sách mã hoặc muốn refresh
            if (availablePromotions.length === 0) {
                await fetchAvailablePromotions();
            }
        }
    };

    // Chọn mã giảm giá từ danh sách
    const selectPromotion = (code: string) => {
        if (!code) return;

        handleChange("promotion_code", code);
        setShowPromotions(false);
        verifyPromoCode();
    };

    const handleBooking = useCallback(async () => {
        if (!form?.start_date || !user || (!isCustom && !tour)) {
            toast.warning("Vui lòng điền đầy đủ thông tin");
            return;
        }

        // Kiểm tra số người tối thiểu cho tour thường
        if (!isCustom && tour?.min_people && form.quantity < tour.min_people) {
            toast.warning(
                `Tour này yêu cầu tối thiểu ${tour.min_people} người.`
            );
            return;
        }

        setIsLoading(true);
        try {
            let body = {
                user_id: user?.id,
                custom_tour_id: null,
                guide_id: form?.guide_id || null,
                hotel_id: form?.hotel_id || null,
                bus_route_id: form?.bus_route_id || null,
                motorbike_id: form?.motorbike_id || null,
                quantity: form?.quantity || 1,
                start_date: dayjs(form?.start_date).format("YYYY-MM-DD"),
                total_price: finalPrice, // Sử dụng giá đã trừ giảm giá
                payment_method_id: form?.payment_method || "1",
                status: "pending",
                promotion_code: promoInfo ? form?.promotion_code : null, // Thêm mã giảm giá nếu có
            } as any;

            if (isCustom && data) {
                body = {
                    ...body,
                    dataCustom: {
                        ...data,
                        duation:
                            times?.find((t) => t?.value === data?.duration)
                                ?.label || "",
                    },
                };
            } else if (tour?.tour_id) {
                body = {
                    ...body,
                    tour_id: tour.tour_id,
                };
            }

            const res = await API.post("/bookings", body);

            toast.success(
                "Đặt tour thành công, đang chuyển đến trang thanh toán! 🎉"
            );
            onClose();

            if (res?.data?.payment_url) {
                window.location.href = res.data.payment_url;
            }
        } catch (error: any) {
            console.error("Booking error: ", error);
            toast.error(
                error?.response?.data?.message
                    ? error.response.data.message
                    : "Đặt tour thất bại. Vui lòng thử lại!",
                error
            );
        } finally {
            setIsLoading(false);
        }
    }, [
        data,
        form?.bus_route_id,
        form?.guide_id,
        form?.hotel_id,
        form?.motorbike_id,
        form?.payment_method,
        form?.promotion_code,
        form?.quantity,
        form?.start_date,
        finalPrice,
        isCustom,
        onClose,
        promoInfo,
        tour,
        user,
    ]);

    useEffect(() => {
        if (!open) return;

        if (!user) {
            toast.warning("Vui lòng đăng nhập để đặt tour");
            return;
        }

        const fetchData = async () => {
            try {
                const results = await Promise.allSettled([
                    PUBLIC_API.get("/guides"),
                    PUBLIC_API.get("/hotels"),
                    PUBLIC_API.get("/bus-routes"),
                    PUBLIC_API.get("/motorbikes"),
                ]);

                // Xử lý kết quả, đảm bảo dữ liệu luôn là mảng ngay cả khi có lỗi
                const guideRes =
                    results[0].status === "fulfilled"
                        ? results[0].value?.data || []
                        : [];
                const hotelRes =
                    results[1].status === "fulfilled"
                        ? results[1].value?.data || []
                        : [];
                const busRes =
                    results[2].status === "fulfilled"
                        ? results[2].value?.data || []
                        : [];
                const bikeRes =
                    results[3].status === "fulfilled"
                        ? results[3].value?.data || []
                        : [];

                setServices({
                    guides: Array.isArray(guideRes) ? guideRes : [],
                    hotels: Array.isArray(hotelRes) ? hotelRes : [],
                    busRoutes: Array.isArray(busRes) ? busRes : [],
                    motorbikes: Array.isArray(bikeRes) ? bikeRes : [],
                });

                if (!isCustom && slug) {
                    try {
                        const tourRes = await PUBLIC_API.get(
                            `/tours/slug/${slug}`
                        );
                        const tourData = tourRes?.data || null;
                        setTour(tourData);

                        // Cập nhật quantity mặc định theo min_people của tour
                        if (tourData?.min_people) {
                            setForm((prev) => ({
                                ...prev,
                                quantity: Math.max(
                                    prev.quantity,
                                    tourData.min_people
                                ),
                            }));
                        }
                    } catch (tourErr) {
                        console.error("Error fetching tour:", tourErr);
                        toast.error("Không thể tải thông tin tour");
                    }
                }

                // Không cần gọi fetchAvailablePromotions ở đây nữa
                // Sẽ được gọi khi người dùng click vào nút "Chọn mã"
            } catch (err) {
                console.error("Error fetching data:", err);
                toast.error("Lỗi tải dữ liệu tour");
                onClose();
            }
        };

        fetchData();
    }, [open, slug, isCustom, user]);

    const endDate =
        form?.start_date && tour?.duration
            ? dayjs(form.start_date)
                  .add(parseInt(tour.duration) || 0, "day")
                  .format("DD/MM/YYYY")
            : null;

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
                                            {tour?.tour_name ||
                                                "Tour tùy chỉnh"}
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                    {/* Booking Form */}
                                    <div className="space-y-6">
                                        {/* Quantity and Date */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                                                    <span>👥</span>
                                                    <span>
                                                        Số người tham gia
                                                        {tour?.min_people &&
                                                            ` (Tối thiểu ${tour.min_people} người)`}
                                                    </span>
                                                </label>
                                                <Input
                                                    type="number"
                                                    min={tour?.min_people || 1}
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
                                                    placeholder={
                                                        tour?.min_people
                                                            ? `Tối thiểu ${tour.min_people} người`
                                                            : "Số người"
                                                    }
                                                />
                                                {tour?.min_people &&
                                                    form.quantity <
                                                        tour.min_people && (
                                                        <p className="text-red-500 text-xs">
                                                            Tour này yêu cầu tối
                                                            thiểu{" "}
                                                            {tour.min_people}{" "}
                                                            người
                                                        </p>
                                                    )}
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

                                        {/* Promotion Code Section */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                                <span>🏷️</span>
                                                <span>Mã giảm giá</span>
                                            </h3>
                                            <div className="flex space-x-2">
                                                <div className="relative flex-1">
                                                    <Input
                                                        placeholder="Nhập mã giảm giá (nếu có)"
                                                        value={
                                                            form.promotion_code ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "promotion_code",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors pr-24"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 text-sm font-medium flex items-center"
                                                        onClick={
                                                            handleShowPromotions
                                                        }
                                                    >
                                                        {isLoadingPromotions ? (
                                                            <>
                                                                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-1"></div>
                                                                <span>
                                                                    Đang tải
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>
                                                                    Chọn mã
                                                                </span>
                                                                <svg
                                                                    className={`ml-1 w-4 h-4 transition-transform ${
                                                                        showPromotions
                                                                            ? "rotate-180"
                                                                            : ""
                                                                    }`}
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M19 9l-7 7-7-7"
                                                                    ></path>
                                                                </svg>
                                                            </>
                                                        )}
                                                    </button>

                                                    {/* Dropdown mã giảm giá */}
                                                    {showPromotions && (
                                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                                                            {isLoadingPromotions ? (
                                                                <div className="flex items-center justify-center p-4 text-gray-500">
                                                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                                                                    <span>
                                                                        Đang tải
                                                                        danh
                                                                        sách
                                                                        mã...
                                                                    </span>
                                                                </div>
                                                            ) : availablePromotions?.length >
                                                              0 ? (
                                                                availablePromotions.map(
                                                                    (promo) => (
                                                                        <div
                                                                            key={
                                                                                promo?.id ||
                                                                                Math.random()
                                                                            }
                                                                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none"
                                                                            onClick={() =>
                                                                                selectPromotion(
                                                                                    promo?.code
                                                                                )
                                                                            }
                                                                        >
                                                                            <div className="flex justify-between items-center">
                                                                                <span className="font-medium text-gray-700">
                                                                                    {promo?.code ||
                                                                                        ""}
                                                                                </span>
                                                                                <span className="text-sm text-blue-600">
                                                                                    {promo?.discount_type ===
                                                                                    "percentage"
                                                                                        ? `Giảm ${
                                                                                              promo?.discount_value ||
                                                                                              0
                                                                                          }%`
                                                                                        : `Giảm ${(
                                                                                              promo?.discount_value ||
                                                                                              0
                                                                                          ).toLocaleString()}₫`}
                                                                                </span>
                                                                            </div>
                                                                            {promo?.description && (
                                                                                <p className="text-xs text-gray-500 mt-1">
                                                                                    {
                                                                                        promo.description
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                )
                                                            ) : (
                                                                <div className="p-4 text-center text-gray-500">
                                                                    Không có mã
                                                                    giảm giá khả
                                                                    dụng
                                                                </div>
                                                            )}
                                                            <div className="p-2 border-t border-gray-100">
                                                                <button
                                                                    type="button"
                                                                    className="w-full py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                                    onClick={() =>
                                                                        fetchAvailablePromotions()
                                                                    }
                                                                    disabled={
                                                                        isLoadingPromotions
                                                                    }
                                                                >
                                                                    Làm mới danh
                                                                    sách
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={verifyPromoCode}
                                                    disabled={
                                                        isVerifyingPromo ||
                                                        !form.promotion_code
                                                    }
                                                    className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium"
                                                >
                                                    {isVerifyingPromo ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        "Áp dụng"
                                                    )}
                                                </Button>
                                            </div>
                                            {promoInfo && (
                                                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
                                                    <div className="flex items-center text-green-700">
                                                        <span className="mr-2">
                                                            ✅
                                                        </span>
                                                        <span className="font-medium">
                                                            Đã áp dụng mã giảm
                                                            giá!
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 text-green-600">
                                                        Giảm{" "}
                                                        {promoInfo?.discount_type ===
                                                        "percentage"
                                                            ? `${
                                                                  promoInfo?.discount_value ||
                                                                  0
                                                              }%`
                                                            : `${(
                                                                  promoInfo?.discount_value ||
                                                                  0
                                                              ).toLocaleString()}₫`}{" "}
                                                        - Số tiền giảm:{" "}
                                                        {(
                                                            promoInfo?.discount_amount ||
                                                            0
                                                        ).toLocaleString()}
                                                        ₫
                                                    </div>
                                                </div>
                                            )}
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
                                                            services?.guides ||
                                                            [],
                                                        id: "guide_id",
                                                        name: "name",
                                                    },
                                                    {
                                                        label: "🏨 Khách sạn",
                                                        key: "hotel_id",
                                                        options:
                                                            services?.hotels ||
                                                            [],
                                                        id: "hotel_id",
                                                        name: "name",
                                                    },
                                                    {
                                                        label: "🚌 Xe khách",
                                                        key: "bus_route_id",
                                                        options:
                                                            services?.busRoutes ||
                                                            [],
                                                        id: "bus_route_id",
                                                        name: "route_name",
                                                    },
                                                    {
                                                        label: "🏍️ Xe máy",
                                                        key: "motorbike_id",
                                                        options:
                                                            services?.motorbikes ||
                                                            [],
                                                        id: "motorbike_id",
                                                        name: "bike_type",
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
                                                                    (form[
                                                                        // @ts-ignore
                                                                        key as keyof typeof form
                                                                    ] as string) ||
                                                                    ""
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
                                                                {(
                                                                    options ||
                                                                    []
                                                                ).map(
                                                                    (
                                                                        item: any
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                (item?.[
                                                                                    id
                                                                                ] ||
                                                                                    "") +
                                                                                "_fstack"
                                                                            }
                                                                            value={
                                                                                item?.[
                                                                                    id
                                                                                ] ||
                                                                                ""
                                                                            }
                                                                        >
                                                                            {item?.[
                                                                                name
                                                                            ] ||
                                                                                ""}
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
                                            <div className="grid grid-cols-1 gap-3">
                                                {[
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
                                    <div className="flex flex-col mb-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600">
                                                Tạm tính
                                            </p>
                                            <p className="text-lg font-medium text-gray-700">
                                                {basePrice.toLocaleString()}₫
                                            </p>
                                        </div>

                                        {promoInfo && (
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-sm text-green-600 flex items-center">
                                                    <span className="mr-1">
                                                        🏷️
                                                    </span>
                                                    Giảm giá
                                                </p>
                                                <p className="text-lg font-medium text-green-600">
                                                    -
                                                    {(
                                                        promoInfo?.discount_amount ||
                                                        0
                                                    ).toLocaleString()}
                                                    ₫
                                                </p>
                                            </div>
                                        )}

                                        <div className="border-t border-gray-200 my-3"></div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-600">
                                                Tổng thanh toán
                                            </p>
                                            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                {finalPrice.toLocaleString()}₫
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <Button
                                            type="button"
                                            onClick={onClose}
                                            variant="outline"
                                            className="flex-1 rounded-xl border-2 border-gray-300 hover:bg-gray-50"
                                        >
                                            Hủy bỏ
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleBooking}
                                            disabled={
                                                isLoading ||
                                                !form.start_date ||
                                                (tour?.min_people &&
                                                    form.quantity <
                                                        tour.min_people)
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
