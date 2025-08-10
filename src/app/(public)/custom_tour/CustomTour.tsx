"use client";

import { Button } from "@/components/ui/button";
import { CalendarDatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { times, vehicles } from "@/constants";
import { API, PUBLIC_API } from "@/lib/api";
import { RootState } from "@/lib/redux/store";
import { GuideType } from "@/types/guide";
import { HotelType } from "@/types/hotel";
import { DestinationType } from "@/types/location";
import { MotorbikeType } from "@/types/motorbike";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import styles from "./style.module.css";

type Props = {
    hotels: HotelType[] | null;
    motorbikes: MotorbikeType[] | null;
    guides: GuideType[] | null;
    destinations?: DestinationType[] | null;
};

const CustomTour = ({ hotels, motorbikes, guides, destinations }: Props) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Tour data
    const [data, setData] = useState({
        destination_id: 0,
        vehicle: "",
        duration: "",
        note: "",
        customDuration: "",
    });

    // Booking form data
    const [form, setForm] = useState({
        quantity: 1,
        start_date: null as Date | null,
        guide_id: "",
        hotel_id: "",
        bus_route_id: "",
        motorbike_id: "",
        payment_method: "1", // Default to VNPay
    });

    // Services data
    const [services, setServices] = useState({
        guides: [],
        hotels: [],
        busRoutes: [],
        motorbikes: [],
    });

    // State để kiểm soát hiển thị form
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [isCustomDuration, setIsCustomDuration] = useState(false);

    // Tính giá tour
    const price = useMemo(() => {
        let p = 1200000; // Giá cơ bản
        const priceVehicle =
            data.vehicle === "airplane"
                ? 2000000
                : data.vehicle === "bus"
                ? 300000
                : data.vehicle === "train"
                ? 200000
                : 0;

        const priceHotel =
            services.hotels.find((h: any) => h.hotel_id == form.hotel_id)
                ?.price || 0;

        const priceGuide =
            services.guides.find((g: any) => g.guide_id == form.guide_id)
                ?.price_per_day || 0;

        const priceBus =
            services.busRoutes.find(
                (b: any) => b.bus_route_id == form.bus_route_id
            )?.price || 0;

        const priceBike =
            services.motorbikes.find(
                (b: any) => b.motorbike_id == form.motorbike_id
            )?.price_per_day || 0;

        const totalPriceService =
            Number(priceBus) +
            Number(priceHotel) +
            Number(priceGuide) +
            Number(priceBike);

        if (data.duration === "1") {
            p = 1200000 + 2 * totalPriceService;
        }
        if (data.duration === "2") {
            p = 1200000 + 3 * totalPriceService;
        }
        if (data.duration === "3") {
            p = 1200000 + 4 * totalPriceService;
        }
        if (data.duration === "4") {
            p = 1200000 + 5 * totalPriceService;
        }

        return (p + priceVehicle) * form.quantity;
    }, [
        data.vehicle,
        data.duration,
        form.bus_route_id,
        form.guide_id,
        form.hotel_id,
        form.motorbike_id,
        form.quantity,
        services.busRoutes,
        services.guides,
        services.hotels,
        services.motorbikes,
    ]);

    // Xử lý thay đổi form booking
    const handleChange = (key: string, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // Xử lý dữ liệu cuối cùng
    const getFinalData = () => {
        return {
            ...data,
            duration:
                data.duration === "custom"
                    ? data.customDuration
                    : data.duration,
        };
    };

    // Hiển thị form đặt tour
    const handleShowBookingForm = async () => {
        const tourData = getFinalData();

        // Kiểm tra các trường bắt buộc
        if (!tourData.destination_id || tourData.destination_id === 0) {
            toast.error("Vui lòng chọn điểm đến");
            return;
        }

        if (!tourData.vehicle) {
            toast.error("Vui lòng chọn phương tiện di chuyển");
            return;
        }

        if (!tourData.duration) {
            toast.error("Vui lòng chọn thời gian");
            return;
        }

        if (tourData.duration === "custom" && !tourData.customDuration) {
            toast.error("Vui lòng nhập thời gian tùy chỉnh");
            return;
        }

        // Kiểm tra đăng nhập
        if (!user) {
            toast.warning("Vui lòng đăng nhập để đặt tour");
            // TODO: redirect to login page
            return;
        }

        // Fetch services
        try {
            const [guideRes, hotelRes, busRes, bikeRes] = await Promise.all([
                PUBLIC_API.get("/guides"),
                PUBLIC_API.get("/hotels"),
                PUBLIC_API.get("/bus-routes"),
                PUBLIC_API.get("/motorbikes"),
            ]);

            setServices({
                guides: guideRes.data,
                hotels: hotelRes.data,
                busRoutes: busRes.data,
                motorbikes: bikeRes.data,
            });

            // Hiển thị form đặt tour
            setShowBookingForm(true);
        } catch (err) {
            toast.error("Lỗi tải dữ liệu dịch vụ");
        }
    };

    // Xử lý đặt tour
    const handleBookTour = useCallback(async () => {
        if (!form.start_date || !user) {
            toast.warning("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setLoading(true);
        try {
            const tourData = getFinalData();

            // Dữ liệu gửi đi
            let body = {
                user_id: user.id,
                custom_tour_id: null,
                guide_id: form.guide_id || null,
                hotel_id: form.hotel_id || null,
                bus_route_id: form.bus_route_id || null,
                motorbike_id: form.motorbike_id || null,
                quantity: form.quantity,
                start_date: dayjs(form.start_date).format("YYYY-MM-DD"),
                total_price: price,
                payment_method_id: form.payment_method,
                status: "pending",
                dataCustom: {
                    ...tourData,
                    duration:
                        times.find((t) => t.value === tourData.duration)
                            ?.label || tourData.customDuration,
                },
            };

            const res = await API.post("/bookings", body);

            toast.success(
                "Đặt tour thành công, đang chuyển đến trang thanh toán! 🎉"
            );

            if (res.data.payment_url) {
                window.location.href = res.data.payment_url;
            } else {
                router.push("/thank-you");
            }
        } catch (error: any) {
            console.error("Booking error: ", error?.response?.data?.message);
            toast.error(
                error?.response?.data?.message
                    ? error?.response?.data?.message
                    : "Đặt tour thất bại. Vui lòng thử lại!",
                error
            );
        } finally {
            setLoading(false);
        }
    }, [
        data,
        form.bus_route_id,
        form.guide_id,
        form.hotel_id,
        form.motorbike_id,
        form.payment_method,
        form.quantity,
        form.start_date,
        price,
        router,
        user,
    ]);

    if (!hotels || !motorbikes || !guides || !destinations) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-6 py-8 border border-gray-300 rounded-lg mb-20">
            <p className={`${styles.subTitle} text-center text-4xl mb-6`}>
                Tạo tour của bạn
            </p>

            {/* Form tạo tour - luôn hiển thị */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor=""
                        className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-bold"
                    >
                        Điểm đến
                    </label>
                    <div>
                        <Select
                            value={String(data.destination_id)}
                            onValueChange={(e) => {
                                setData({
                                    ...data,
                                    destination_id: Number(e),
                                });
                            }}
                        >
                            <div className="h-[60px] rounded-xl border border-blue-400 cursor-pointer mt-2 px-0 py-3">
                                <SelectTrigger>
                                    <div className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-medium px-0">
                                        <SelectValue placeholder="Chọn điểm đến" />
                                    </div>
                                </SelectTrigger>
                            </div>
                            <SelectContent>
                                <SelectGroup className="xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-medium rounded-xl">
                                    {destinations?.length > 0 &&
                                        destinations.map((i) => {
                                            return (
                                                <SelectItem
                                                    key={i.destination_id}
                                                    className="xl:text-lg lg:text-lg md:text-sm sm:text-sm px-5 h-12"
                                                    value={i.destination_id.toString()}
                                                >
                                                    {i.name}
                                                </SelectItem>
                                            );
                                        })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="">
                    <label
                        htmlFor=""
                        className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-bold"
                    >
                        Ghi Chú
                    </label>
                    <div>
                        <div className="w-full border border-blue-400 rounded-xl mb-3 mt-2">
                            <Input
                                placeholder="Nhập nội dung của bạn ở đây!"
                                value={data.note}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        note: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor=""
                        className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-bold"
                    >
                        Phương tiện di chuyển
                    </label>
                    <div>
                        <Select
                            value={data.vehicle}
                            onValueChange={(e) =>
                                setData({ ...data, vehicle: e })
                            }
                        >
                            <div className="h-[60px] rounded-xl border border-blue-400 cursor-pointer mt-2 px-0 py-3">
                                <SelectTrigger>
                                    <div className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-medium px-0">
                                        <SelectValue placeholder="Chọn phương tiện di chuyển" />
                                    </div>
                                </SelectTrigger>
                            </div>
                            <SelectContent>
                                <SelectGroup className="xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-medium rounded-xl">
                                    {vehicles?.length > 0 &&
                                        vehicles.map((i) => {
                                            return (
                                                <SelectItem
                                                    key={i.value}
                                                    className="xl:text-lg lg:text-lg md:text-sm sm:text-sm px-5 h-12"
                                                    value={i.value}
                                                >
                                                    {i.name}
                                                </SelectItem>
                                            );
                                        })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor=""
                        className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-bold"
                    >
                        Thời gian
                    </label>
                    <div>
                        <Select
                            value={data.duration}
                            onValueChange={(e) => {
                                if (e === "custom") {
                                    setIsCustomDuration(true);
                                } else {
                                    setIsCustomDuration(false);
                                }
                                setData({ ...data, duration: e });
                            }}
                        >
                            <div className="h-[60px] rounded-xl border border-blue-400 cursor-pointer mt-2 px-0 py-3">
                                <SelectTrigger>
                                    <div className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-medium px-0">
                                        <SelectValue placeholder="Chọn thời gian" />
                                    </div>
                                </SelectTrigger>
                            </div>
                            <SelectContent>
                                <SelectGroup className="xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-medium rounded-xl">
                                    {times?.length > 0 &&
                                        times.map((i) => {
                                            return (
                                                <SelectItem
                                                    key={i.value}
                                                    className="xl:text-lg lg:text-lg md:text-sm sm:text-sm px-5 h-12"
                                                    value={i.value}
                                                >
                                                    {i.label}
                                                </SelectItem>
                                            );
                                        })}
                                    {/* Thêm lựa chọn tùy chỉnh */}
                                    <SelectItem
                                        className="xl:text-lg lg:text-lg md:text-sm sm:text-sm px-5 h-12"
                                        value="custom"
                                    >
                                        Tùy chỉnh thời gian
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {/* Hiển thị input field nếu người dùng chọn "Tùy chỉnh" */}
                        {isCustomDuration && (
                            <div className="mt-3">
                                <Input
                                    className="h-[60px] rounded-xl border border-blue-400"
                                    placeholder="Nhập thời gian mong muốn (Ví dụ: 5 ngày 4 đêm)"
                                    value={data.customDuration}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            customDuration: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Nút Tiếp tục đặt tour - luôn hiển thị */}
            <div className="mt-5 flex justify-center">
                <Button
                    onClick={handleShowBookingForm}
                    className="bg-blue-600 text-white px-8 py-6 text-lg hover:bg-blue-700"
                >
                    Tiếp tục đặt tour
                </Button>
            </div>

            {/* Form đặt tour - chỉ hiển thị khi showBookingForm = true */}
            {showBookingForm && (
                <div className="mt-10 pt-10 border-t-2 border-gray-200">
                    <p
                        className={`${styles.subTitle} text-center text-3xl mb-6`}
                    >
                        Đặt tour du lịch
                    </p>

                    {/* Tour Info Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">
                                    Điểm đến:
                                </p>
                                <p className="text-lg text-blue-600">
                                    {
                                        destinations.find(
                                            (d) =>
                                                d.destination_id ===
                                                data.destination_id
                                        )?.name
                                    }
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-gray-700">
                                    Phương tiện:
                                </p>
                                <p className="text-lg text-blue-600">
                                    {
                                        vehicles.find(
                                            (v) => v.value === data.vehicle
                                        )?.name
                                    }
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-gray-700">
                                    Thời gian:
                                </p>
                                <p className="text-lg text-blue-600">
                                    {data.duration === "custom"
                                        ? data.customDuration
                                        : times.find(
                                              (t) => t.value === data.duration
                                          )?.label}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="space-y-6 mt-8">
                        {/* Quantity and Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                                    <span>👥</span>
                                    <span>Số người tham gia</span>
                                </label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={form.quantity}
                                    onChange={(e) =>
                                        handleChange(
                                            "quantity",
                                            parseInt(e.target.value) || 1
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
                                        handleChange("start_date", date)
                                    }
                                />
                            </div>
                        </div>

                        {/* Services Selection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                <span>⚙️</span>
                                <span>Dịch vụ bổ sung (tùy chọn)</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    {
                                        label: "🗣️ Hướng dẫn viên",
                                        key: "guide_id",
                                        options: services.guides,
                                        id: "guide_id",
                                        name: "name",
                                    },
                                    {
                                        label: "🏨 Khách sạn",
                                        key: "hotel_id",
                                        options: services.hotels,
                                        id: "hotel_id",
                                        name: "name",
                                    },
                                    {
                                        label: "🚌 Xe khách",
                                        key: "bus_route_id",
                                        options: services.busRoutes,
                                        id: "bus_route_id",
                                        name: "route_name",
                                    },
                                    {
                                        label: "🏍️ Xe máy",
                                        key: "motorbike_id",
                                        options: services.motorbikes,
                                        id: "motorbike_id",
                                        name: "bike_type",
                                    },
                                ].map(({ label, key, options, id, name }) => (
                                    <div key={key} className="space-y-2">
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
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                                        >
                                            <option value="">Không chọn</option>
                                            {options.map((item: any) => (
                                                <option
                                                    key={item[id] + "_fstack"}
                                                    value={item[id]}
                                                >
                                                    {item[name]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                <span>💳</span>
                                <span>Phương thức thanh toán</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                            form.payment_method === method.value
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
                                                    e.target.value
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

                    {/* Summary and Buttons */}
                    <div className="bg-gray-50 p-6 rounded-xl mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Tổng thanh toán
                                </p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {price?.toLocaleString()}₫
                                </p>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                                <p>{form.quantity} người</p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                onClick={handleBookTour}
                                disabled={loading || !form.start_date}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Đang xử lý...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span>🎯</span>
                                        <span>Xác nhận đặt tour</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomTour;
