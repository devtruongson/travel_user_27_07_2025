/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { PUBLIC_API } from "@/lib/api";
import TourCard from "@/components/tourCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ButtonGlobal from "@/components/buttonGlobal";
import { createSlug } from "@/utils/slug";
import CustomButton from "@/components/customButton";
import { CiFilter } from "react-icons/ci";
import { TbRefresh } from "react-icons/tb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Destination {
    destination_id: number;
    category_id: number;
    name: string;
    description: string;
    area: string;
    img_banner_url: string;
}

export default function DestinationFilterSection() {
    // const [regionFilter, setRegionFilter] = useState<string[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [filteredDestination, setFilteredDestination] = useState<
        Destination[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<
        { category_id: number; category_name: string }[]
    >([]);
    const [categoryFilter, setCategoryFilter] = useState<number[]>([]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                setLoading(true);
                const res = await PUBLIC_API.get("/destinations");
                const data = Array.isArray(res.data) ? res.data : [];

                setDestinations(data);
                setFilteredDestination(data);
            } catch (err: any) {
                console.log("❌ Lỗi khi fetch destinations:", err);
                setError(err?.response?.data?.message || "Lỗi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        const fetchCategories = async () => {
            try {
                const res = await PUBLIC_API.get("/destination-categories"); // giả định endpoint này
                const data = Array.isArray(res.data) ? res.data : [];
                setCategories(data);
            } catch (err) {
                console.log("❌ Lỗi khi fetch categories:", err);
            }
        };

        fetchCategories();

        fetchDestinations();
    }, []);

    // const toggleRegion = (id: string) => {
    //   setRegionFilter((prev) =>
    //     prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    //   );
    // };

    useEffect(() => {
        if (categoryFilter.length === 0) {
            setFilteredDestination(destinations);
        } else {
            setFilteredDestination(
                destinations.filter((d) =>
                    categoryFilter.includes(d.category_id)
                )
            );
        }
    }, [categoryFilter, destinations]);

    return (
        <section id="destinationlist" className="container m-auto mb-20 pt-28">
            <h1 className="text-center mb-10 text-[45px] font-extrabold text-blue-800">
                Khám phá các địa điểm du lịch Việt Nam
            </h1>

            {/* Bộ lọc */}
            <div className="mb-5 flex gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <CustomButton className="bg-[#2a0094] text-[#fff] cursor-pointer">
                            <CiFilter size={25} />
                            <span>Theo khu vực</span>
                        </CustomButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-transparent border-0 shadow-none">
                        <div
                            className="rounded-[20px] px-6 py-8 sticky top-28 shadow-lg"
                            style={{
                                background:
                                    "linear-gradient(60deg,rgba(176, 252, 255, 1) 0%, rgba(232, 234, 255, 1) 51%, rgba(255, 255, 255, 1) 100%)",
                            }}
                        >
                            <h4 className="font-bold text-[23px] text-[#6169db]">
                                Theo danh mục
                            </h4>
                            <ul>
                                {categories.map((category) => (
                                    <li
                                        key={category.category_id}
                                        className="flex items-center gap-2 my-3"
                                    >
                                        <Checkbox
                                            id={`cat-${category.category_id}`}
                                            className="custom-checkbox size-4"
                                            checked={categoryFilter.includes(
                                                category.category_id
                                            )}
                                            onCheckedChange={() =>
                                                setCategoryFilter((prev) =>
                                                    prev.includes(
                                                        category.category_id
                                                    )
                                                        ? prev.filter(
                                                              (item) =>
                                                                  item !==
                                                                  category.category_id
                                                          )
                                                        : [
                                                              ...prev,
                                                              category.category_id,
                                                          ]
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor={`cat-${category.category_id}`}
                                            className="text-[15px]"
                                        >
                                            {category.category_name}
                                        </Label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
                <CustomButton
                    className="bg-[#2a0094] text-[#fff] cursor-pointer"
                    onClick={() => setCategoryFilter([])}
                >
                    <TbRefresh />
                </CustomButton>
            </div>

            {/* Danh sách điểm đến */}
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
                    ) : filteredDestination.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDestination.map((destination) => (
                                <TourCard
                                    key={destination.destination_id}
                                    href={`/destination/${createSlug(
                                        destination.name
                                    )}`}
                                    imgUrl={destination.img_banner_url}
                                    nameDestination={destination.name}
                                    descDestination={destination.description}
                                    area={destination.area}
                                    clasName="h-[500px]"
                                    bottomClassName="flex-col"
                                    isDestination
                                    btnCard="Khám phá điểm đến"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full gap-10 mt-10">
                            <p className="text-center text-[25px] text-fuchsia-700 col-span-3">
                                Không tìm thấy điểm đến phù hợp
                            </p>
                            <ButtonGlobal
                                text="Xem tất cả điểm đến"
                                onClick={() => setCategoryFilter([])}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
