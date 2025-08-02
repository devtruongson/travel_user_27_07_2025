"use client";

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

type Props = {
    hotels: HotelType[] | null;
    motorbikes: MotorbikeType[] | null;
    guides: GuideType[] | null;
    destinations?: DestinationType[] | null;
};
const CustomTour = ({ hotels, motorbikes, guides, destinations }: Props) => {
    const [data, setData] = useState({
        destination: 0,
        vehicle: "",
        duration: "",
    });
    if (!hotels || !motorbikes || !guides || !destinations) {
        return <div className="text-center">Loading...</div>;
    }
    return (
        <div className="container mx-auto px-4 py-8 border border-gray-300 rounded-lg">
            <p className="text-center">Tạo tour của bạn</p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor=""
                        className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-bold"
                    >
                        Điểm đến
                    </label>
                    <div>
                        <Select>
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
                                                    value="apple"
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
                        Phương tiện di chuyển
                    </label>
                    <div>
                        <Select>
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
                                                    value="apple"
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
                        <Select>
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
                                                    key={i}
                                                    className="xl:text-lg lg:text-lg md:text-sm sm:text-sm px-5 h-12"
                                                    value="apple"
                                                >
                                                    {i}
                                                </SelectItem>
                                            );
                                        })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* <div>
                    <label
                        htmlFor=""
                        className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-bold"
                    >
                        Khách sạn
                    </label>
                    <div>
                        <Select>
                            <div className="h-[60px] rounded-xl border border-blue-400 cursor-pointer mt-2 px-0 py-3">
                                <SelectTrigger>
                                    <div className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-medium px-0">
                                        <SelectValue placeholder="Chọn khách sạn" />
                                    </div>
                                </SelectTrigger>
                            </div>
                            <SelectContent>
                                <SelectGroup className="xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-medium rounded-xl">
                                    {hotels?.length > 0 &&
                                        hotels.map((hotel) => {
                                            return (
                                                <SelectItem
                                                    key={hotel.hotel_id}
                                                    className="xl:text-lg lg:text-lg md:text-sm sm:text-sm px-5 h-12"
                                                    value="apple"
                                                >
                                                    {hotel.name} -{" "}
                                                    {hotel.location}
                                                </SelectItem>
                                            );
                                        })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div> */}
                <div className="mt-5">
                    <BookTourButton isCustom data={data} />
                </div>
            </div>
        </div>
    );
};

export default CustomTour;
