"use client";

import styles from "./style.module.css";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { times, vehicles } from "@/constants";
import { GuideType } from "@/types/guide";
import { HotelType } from "@/types/hotel";
import { DestinationType } from "@/types/location";
import { MotorbikeType } from "@/types/motorbike";
import BookTourButton from "../tours/[slug]/BookTourButton";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type Props = {
    hotels: HotelType[] | null;
    motorbikes: MotorbikeType[] | null;
    guides: GuideType[] | null;
    destinations?: DestinationType[] | null;
};
const CustomTour = ({ hotels, motorbikes, guides, destinations }: Props) => {
    const [data, setData] = useState({
        destination_id: 0,
        vehicle: "",
        duration: "",
        note: "",
    });
    if (!hotels || !motorbikes || !guides || !destinations) {
        return <div className="text-center">Loading...</div>;
    }
    return (
        <div className="container mx-auto px-6 py-8 border border-gray-300 rounded-lg mb-20">
            <p className={`${styles.subTitle} text-center text-4xl mb-6`}>
                Tạo tour của bạn
            </p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
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
                                setData({ ...data, destination_id: Number(e) });
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
                                    {/* <SelectLabel className="text-xl font-medium">
                                        Chọn điểm đến
                                    </SelectLabel> */}
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
                                    setData({ ...data, note: e.target.value })
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
                            onValueChange={(e) =>
                                setData({ ...data, duration: e })
                            }
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
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <BookTourButton isCustom data={data} />
            </div>
        </div>
    );
};

export default CustomTour;
