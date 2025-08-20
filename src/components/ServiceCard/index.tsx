import Image from "next/image";
import Link from "next/link";
import type { ServiceItem } from "@/types/services";

interface ServiceCardProps {
    title: string;
    description: string;
    image: string;
    data: ServiceItem[];
    linkText: string;
    linkHref: string;
    reversed?: boolean;
}

const getItemDisplayInfo = (item: ServiceItem) => {
    console.log("Processing item:", item);

    if ("brand" in item) {
        // Motorbike
        return {
            name: item.name,
            description: `${item.brand} - ${
                item.description || "Chất lượng cao, giá cả hợp lý"
            }`,
        };
    } else if ("route" in item) {
        // Bus
        return {
            name: item.name,
            description: `Tuyến: ${item.route} - ${
                item.description || "Đặt vé nhanh chóng"
            }`,
        };
    } else if ("location" in item) {
        // Guide
        console.log("Processing guide:", item);
        return {
            name: item.name,
            description: `Khu vực: ${item.location} - ${
                item.description || "Hướng dẫn viên chuyên nghiệp"
            }`,
        };
    } else if ("hotel_name" in item) {
        // Hotel
        return {
            name: item.hotel_name,
            description: `${item.address} - ${
                item.description || "Phòng nghỉ chất lượng"
            }`,
        };
    }

    console.log("Unknown item type:", item);
    return {
        name: item?.name || "Unknown",
        description: "Chất lượng cao, giá cả hợp lý",
    };
};

export default function ServiceCard({
    title,
    description,
    image,
    data,
    linkText,
    linkHref,
    reversed = false,
}: ServiceCardProps) {
    console.log(`ServiceCard ${title} data:`, data);

    return (
        <div
            className={`mb-20 ${
                reversed ? "md:flex-row-reverse" : ""
            } flex flex-col md:flex-row items-center gap-6 md:gap-8`}
        >
            {/* Service Image */}
            <div className="w-full md:w-1/2">
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </div>

            {/* Service Content */}
            <div className="w-full md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    {title}
                </h3>
                <p className="text-gray-600 mb-6 text-base md:text-lg">
                    {description}
                </p>

                {/* Service Items */}
                <div className="space-y-4 mb-6">
                    {data.length > 0 ? (
                        data.map((item: ServiceItem, itemIndex: number) => (
                            <div
                                key={itemIndex}
                                className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">
                                            {getItemDisplayInfo(item).name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {
                                                getItemDisplayInfo(item)
                                                    .description
                                            }
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-cyan-600">
                                            {item.price
                                                ? `${item.price.toLocaleString()}đ`
                                                : "Liên hệ"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.unit || "ngày"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 italic">
                            Đang cập nhật dữ liệu...
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <Link
                    href={linkHref}
                    className="cssbuttons-io-button inline-flex"
                >
                    {linkText}
                    <div className="icon">
                        <svg
                            height="24"
                            width="24"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M0 0h24v24H0z" fill="none"></path>
                            <path
                                d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </div>
                </Link>
            </div>
        </div>
    );
}
