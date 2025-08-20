/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { toast } from "sonner";
import { PUBLIC_API, API } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";

export default function BookingPage() {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    const params = useParams();

    const [tour, setTour] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [slug, setSlug] = useState<string>("");
    const [form, setForm] = useState({
        quantity: 2, // Sẽ được cập nhật theo min_people của tour
        start_date: null,
        end_date: null,
        guide_id: null,
        hotel_id: null,
        bus_route_id: null,
        motorbike_id: null,
        payment_method: "COD",
    });

    const [services, setServices] = useState({
        guides: [],
        hotels: [],
        busRoutes: [],
        motorbikes: [],
    });

    useEffect(() => {
        const getSlug = async () => {
            if (params.slug) {
                const resolvedSlug =
                    typeof params.slug === "string"
                        ? params.slug
                        : params.slug[0];
                setSlug(resolvedSlug);
            }
        };
        getSlug();
    }, [params]);

    useEffect(() => {
        if (!user) {
            toast.warning("Vui lòng đăng nhập để đặt tour.");
            router.push("/");
            return;
        }

        if (!slug) return;

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

                // Cập nhật quantity mặc định theo min_people của tour
                const minPeople = tourRes.data?.min_people || 2;
                setForm((prev) => ({ ...prev, quantity: minPeople }));

                setServices({
                    guides: guideRes.data,
                    hotels: hotelRes.data,
                    busRoutes: busRes.data,
                    motorbikes: bikeRes.data,
                });
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Không thể tải dữ liệu tour.");
                router.push("/");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, user, router]);

    const handleChange = (key: string, value: any) => {
        // Kiểm tra nếu đang thay đổi quantity và tour đã được load
        if (key === "quantity" && tour?.min_people) {
            const minPeople = tour.min_people;
            const newQuantity = parseInt(value);

            if (newQuantity < minPeople) {
                toast.warning(
                    `Số người tối thiểu cho tour này là ${minPeople} người.`
                );
                setForm({ ...form, [key]: minPeople });
                return;
            }
        }

        setForm({ ...form, [key]: value });
    };

    const handleBooking = async () => {
        if (!form.start_date) {
            toast.warning("Vui lòng chọn ngày bắt đầu.");
            return;
        }

        // Kiểm tra số người tối thiểu
        if (tour?.min_people && form.quantity < tour.min_people) {
            toast.warning(
                `Số người tối thiểu cho tour này là ${tour.min_people} người.`
            );
            return;
        }

        const body = {
            user_id: user?.id,
            tour_id: tour?.tour_id,
            custom_tour_id: null,
            ...form,
            total_price:
                parseInt(tour?.discount_price || tour?.price) * form.quantity,
        };

        try {
            await API.post("/bookings", body);
            toast.success("Đặt tour thành công!");
            router.push("/my-bookings");
        } catch (error) {
            console.error("Error booking tour:", error);
            toast.error("Đặt tour thất bại.");
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (!tour) return <p>Không tìm thấy tour.</p>;

    return (
        <section className="container m-auto py-12 px-4 max-w-3xl">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">
                Đặt tour: {tour.tour_name}
            </h1>

            <div className="bg-white rounded shadow p-6 space-y-4">
                <div>
                    <label className="block mb-1 font-semibold">
                        Số người{" "}
                        {tour?.min_people &&
                            `(Tối thiểu ${tour.min_people} người)`}
                    </label>
                    <Input
                        type="number"
                        min={tour?.min_people || 1}
                        value={form.quantity}
                        onChange={(e) =>
                            handleChange("quantity", parseInt(e.target.value))
                        }
                        placeholder={`Tối thiểu ${tour?.min_people || 1} người`}
                    />
                    {tour?.min_people && form.quantity < tour.min_people && (
                        <p className="text-red-500 text-sm mt-1">
                            Tour này yêu cầu tối thiểu {tour.min_people} người
                        </p>
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-semibold">
                        Ngày khởi hành / kết thúc
                    </label>
                    <CalendarDateRangePicker
                        onChange={(dates) => {
                            handleChange("start_date", dates?.from);
                            handleChange("end_date", dates?.to);
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-semibold">
                            Thuê hướng dẫn viên
                        </label>
                        <Select
                            onValueChange={(val) =>
                                handleChange("guide_id", val)
                            }
                            defaultValue=""
                        >
                            <option value="">Không chọn</option>
                            {services.guides.map((g: any) => (
                                <option key={g.guide_id} value={g.guide_id}>
                                    {g.name}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">
                            Thuê khách sạn
                        </label>
                        <Select
                            onValueChange={(val) =>
                                handleChange("hotel_id", val)
                            }
                            defaultValue=""
                        >
                            <option value="">Không chọn</option>
                            {services.hotels.map((h: any) => (
                                <option key={h.hotel_id} value={h.hotel_id}>
                                    {h.name}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">
                            Xe khách
                        </label>
                        <Select
                            onValueChange={(val) =>
                                handleChange("bus_route_id", val)
                            }
                            defaultValue=""
                        >
                            <option value="">Không chọn</option>
                            {services.busRoutes.map((b: any) => (
                                <option key={b.route_id} value={b.route_id}>
                                    {b.name}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">
                            Thuê xe máy
                        </label>
                        <Select
                            onValueChange={(val) =>
                                handleChange("motorbike_id", val)
                            }
                            defaultValue=""
                        >
                            <option value="">Không chọn</option>
                            {services.motorbikes.map((m: any) => (
                                <option key={m.bike_id} value={m.bike_id}>
                                    {m.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">
                        Phương thức thanh toán
                    </label>
                    <Select
                        onValueChange={(val) =>
                            handleChange("payment_method", val)
                        }
                        defaultValue={form.payment_method}
                    >
                        <option value="COD">COD</option>
                        <option value="bank_transfer">Chuyển khoản</option>
                        <option value="VNPay">VNPay</option>
                        <option value="MoMo">MoMo</option>
                    </Select>
                </div>

                {/* Hiển thị thông tin giá và tổng tiền */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Chi tiết giá</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Giá tour:</span>
                            <span>
                                {parseInt(
                                    tour?.discount_price || tour?.price || 0
                                ).toLocaleString("vi-VN")}{" "}
                                VND/người
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Số người:</span>
                            <span>{form.quantity} người</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Tổng tiền:</span>
                            <span className="text-blue-600">
                                {(
                                    parseInt(
                                        tour?.discount_price || tour?.price || 0
                                    ) * form.quantity
                                ).toLocaleString("vi-VN")}{" "}
                                VND
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-right mt-6">
                    <Button
                        onClick={handleBooking}
                        disabled={
                            tour?.min_people && form.quantity < tour.min_people
                        }
                        className="w-full md:w-auto"
                    >
                        Xác nhận đặt tour
                    </Button>
                </div>
            </div>
        </section>
    );
}
