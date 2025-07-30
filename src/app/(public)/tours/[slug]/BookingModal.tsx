/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PUBLIC_API, API } from "@/lib/api";
import { RootState } from "@/lib/redux/store";
import dayjs from "dayjs";

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
                end_date: dayjs(form.start_date)
                    .add(tour.duration, "day")
                    .format("YYYY-MM-DD"),
                total_price:
                    parseInt(tour.discount_price || tour.price) * form.quantity,
                payment_method: form.payment_method,
                status: "pending",
            };

            await API.post("/bookings", body);

            toast.success("Đặt tour thành công");
            onClose();
            router.push("/my-bookings");
        } catch (error: any) {
            toast.error("Đặt tour thất bại");
        }
    };

    useEffect(() => {
        if (!open) return;

        if (!user) {
            toast.warning("Vui lòng đăng nhập để đặt tour");
            // router.push("/");
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

    if (!user) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            className="fixed z-50 inset-0 overflow-y-auto"
        >
            <div className="flex items-center justify-center min-h-screen p-4 bg-[#0000006a] bg-opacity-30">
                <Dialog.Panel className="bg-white p-6 rounded max-w-lg w-full shadow">
                    <Dialog.Title className="text-xl font-bold mb-4">
                        Đặt tour: {tour?.tour_name}
                    </Dialog.Title>

                    <div className="space-y-4">
                        {/* Quantity */}
                        <div>
                            <label className="block mb-1 font-semibold">
                                Số người
                            </label>
                            <Input
                                type="number"
                                min={1}
                                value={form.quantity}
                                onChange={(e) =>
                                    handleChange(
                                        "quantity",
                                        parseInt(e.target.value)
                                    )
                                }
                            />
                        </div>

                        {/* Start date */}
                        <div>
                            <label className="block mb-1 font-semibold">
                                Ngày khởi hành
                            </label>
                            <CalendarDatePicker
                                value={form.start_date}
                                onChange={(date) =>
                                    handleChange("start_date", date)
                                }
                            />
                            {endDate && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Ngày kết thúc dự kiến:{" "}
                                    <strong>{endDate}</strong>
                                </p>
                            )}
                        </div>

                        {/* Services */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                {
                                    label: "Hướng dẫn viên",
                                    key: "guide_id",
                                    options: services.guides,
                                    id: "guide_id",
                                    name: "name",
                                },
                                {
                                    label: "Khách sạn",
                                    key: "hotel_id",
                                    options: services.hotels,
                                    id: "hotel_id",
                                    name: "name",
                                },
                                {
                                    label: "Xe khách",
                                    key: "bus_route_id",
                                    options: services.busRoutes,
                                    id: "route_id",
                                    name: "name",
                                },
                                {
                                    label: "Xe máy",
                                    key: "motorbike_id",
                                    options: services.motorbikes,
                                    id: "bike_id",
                                    name: "name",
                                },
                            ].map(({ label, key, options, id, name }) => (
                                <div key={key}>
                                    <label className="block mb-1 font-semibold">
                                        {label}
                                    </label>
                                    <select
                                        value={form[key as keyof typeof form]}
                                        onChange={(e) =>
                                            handleChange(key, e.target.value)
                                        }
                                        className="w-full border rounded px-2 py-1"
                                    >
                                        <option value="">Không chọn</option>
                                        {options.map((item: any) => (
                                            <option
                                                key={item[id]}
                                                value={item[id]}
                                            >
                                                {item[name]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        {/* Payment method */}
                        <div>
                            <label className="block mb-1 font-semibold">
                                Phương thức thanh toán
                            </label>
                            <div className="space-y-2">
                                {[
                                    { value: "COD", label: "COD" },
                                    {
                                        value: "bank_transfer",
                                        label: "Chuyển khoản",
                                    },
                                    { value: "VNPay", label: "VNPay" },
                                    { value: "MoMo", label: "MoMo" },
                                ].map((method) => (
                                    <label
                                        key={method.value}
                                        className="flex items-center space-x-2"
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
                                        />
                                        <span>{method.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Total + Submit */}
                        <div className="text-right mt-4">
                            <p className="text-lg mb-2">
                                Tổng tiền:{" "}
                                <span className="font-bold text-red-600">
                                    {(
                                        parseInt(
                                            tour?.discount_price || tour?.price
                                        ) * form.quantity
                                    ).toLocaleString() || "Đang tính toán"}
                                    ₫
                                </span>
                            </p>
                            <Button
                                onClick={handleBooking}
                                className="text-black"
                            >
                                Xác nhận đặt tour
                            </Button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
