/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { PUBLIC_API } from "@/lib/api";
import TourCard from "@/components/tourCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ButtonGlobal from "@/components/buttonGlobal";
import CustomButton from "@/components/customButton";
import { TbRefresh } from "react-icons/tb";
import { createSlug } from "@/utils/slug";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const selectPrice = [
    { id: "price1", label: "Dưới 1 triệu" },
    { id: "price2", label: "1 - 3 triệu" },
    { id: "price3", label: "3 - 5 triệu" },
    { id: "price4", label: "Trên 5 triệu" },
];

export default function TourFilterSection({ cate }: { cate: any }) {
    console.log("Client cate:", cate);
    const [region, setRegion] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [tours, setTours] = useState<any[]>([]);
    // const [filteredTours, setFilteredTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const selectRegion = useMemo(() => {
        return (cate || []).map((i: any) => ({
            id: i.category_id,
            label: i.category_name,
        }));
    }, [cate]);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                let query = "/tours?";
                if (region) {
                    query += `category_id=${region}&`;
                }
                const itemPrice = selectPrice.find((p) => p.id === price);
                if (itemPrice) {
                    if (itemPrice.id === "price1") {
                        query += "price_min=0&price_max=1000000&";
                    }
                    if (itemPrice.id === "price2") {
                        query += "price_min=1000000&price_max=3000000&";
                    }
                    if (itemPrice.id === "price3") {
                        query += "price_min=3000000&price_max=5000000&";
                    }
                    if (itemPrice.id === "price4") {
                        query += "price_min=5000000&";
                    }
                }

                const res = await PUBLIC_API.get(query);
                const data = Array.isArray(res.data) ? res.data : [];
                setTours(data);
                // setFilteredTours(data);
            } catch (err: any) {
                console.error("Lỗi khi fetch tours:", err);
                setError(err?.response?.data?.message || "Lỗi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, [region, price]);

    // useEffect(() => {
    //     let filtered = [...tours];

    //     if (regionFilter.length > 0) {
    //         filtered = filtered.filter((tour) =>
    //             regionFilter.includes(tour.category?.category_name)
    //         );
    //     }

    //     if (priceFilter.length > 0) {
    //         filtered = filtered.filter((tour) => {
    //             const price = parseFloat(tour.discount_price || tour.price);
    //             return priceFilter.some(
    //                 (p) =>
    //                     (p === "price1" && price < 1000000) ||
    //                     (p === "price2" &&
    //                         price >= 1000000 &&
    //                         price <= 3000000) ||
    //                     (p === "price3" &&
    //                         price > 3000000 &&
    //                         price <= 5000000) ||
    //                     (p === "price4" && price > 5000000)
    //             );
    //         });
    //     }

    //     setFilteredTours(filtered);
    // }, [regionFilter, priceFilter, tours]);

    const resetFilter = () => {
        setRegion("");
        setPrice("");
        // setFilteredTours(tours);
    };

    const toggleRegion = (id: string) => {
        setRegion(id);
    };

    const togglePrice = (id: string) => {
        setPrice(id);
    };

    const getFullImageUrl = (path: string) =>
        `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${path}`;

    return (
        <section id="tourlist" className="container m-auto mb-20 pt-28">
            <h1 className="text-center mb-10 text-[45px] font-extrabold text-blue-800">
                Khám phá tour du lịch tốt nhất
            </h1>

            <div className="mb-5 flex gap-4 flex-wrap">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <CustomButton className="bg-[#2a0094] text-[#fff] cursor-pointer">
                            <span>Theo miền</span>
                        </CustomButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <ul>
                            {selectRegion.map(
                                (i: { id: string; label: string }) => (
                                    <li
                                        key={i.id}
                                        className="flex items-center gap-2 my-3"
                                    >
                                        <Checkbox
                                            id={i.id}
                                            className="custom-checkbox size-4"
                                            checked={region === i.id}
                                            onCheckedChange={() =>
                                                toggleRegion(i.id)
                                            }
                                        />
                                        <Label
                                            htmlFor={i.id}
                                            className="text-[15px]"
                                        >
                                            {i.label}
                                        </Label>
                                    </li>
                                )
                            )}
                        </ul>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <CustomButton className="bg-[#2a0094] text-[#fff] cursor-pointer">
                            <span>Theo giá</span>
                        </CustomButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <ul>
                            {selectPrice.map((i) => (
                                <li
                                    key={i.id}
                                    className="flex items-center gap-2 my-3"
                                >
                                    <Checkbox
                                        id={i.id}
                                        className="custom-checkbox size-4"
                                        checked={price === i.id}
                                        onCheckedChange={() =>
                                            togglePrice(i.id)
                                        }
                                    />
                                    <Label
                                        htmlFor={i.id}
                                        className="text-[15px]"
                                    >
                                        {i.label}
                                    </Label>
                                </li>
                            ))}
                        </ul>
                    </DropdownMenuContent>
                </DropdownMenu>

                <CustomButton
                    className="bg-[#2a0094] text-[#fff] cursor-pointer"
                    onClick={resetFilter}
                >
                    <TbRefresh />
                </CustomButton>
            </div>

            <div className="flex gap-8">
                <div className="flex-1">
                    {loading ? (
                        <p className="text-center w-full">
                            Đang tải dữ liệu...
                        </p>
                    ) : error ? (
                        <p className="text-center text-red-600 w-full">
                            {error}
                        </p>
                    ) : tours.length > 0 ? (
                        <div className="grid grid-cols-3 gap-6">
                            {tours.map((tour) => (
                                <TourCard
                                    key={tour.tour_id}
                                    href={`/tours/${createSlug(
                                        tour.tour_name
                                    )}`}
                                    imgUrl={getFullImageUrl(tour.image)}
                                    nameTour={tour.tour_name}
                                    originalPrice={parseFloat(tour.price)}
                                    promotionPrice={parseFloat(
                                        tour.discount_price
                                    )}
                                    time={tour.duration}
                                    startAddress={tour.destination}
                                    rating={5}
                                    category={tour.category?.category_name}
                                    clasName="h-[500px]"
                                    bottomClassName="flex-col"
                                    startAddressHidden
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full gap-10 mt-10">
                            <p className="text-center text-[25px] text-fuchsia-700 col-span-3">
                                Không tìm thấy tour phù hợp
                            </p>
                            <ButtonGlobal
                                text="Xem tất cả tour"
                                onClick={resetFilter}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
