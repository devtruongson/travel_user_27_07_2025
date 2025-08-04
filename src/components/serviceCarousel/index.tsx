"use client";

import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import "keen-slider/keen-slider.min.css";
import styles from "./style.module.css";
import "./btnanimation.css";
import CustomButton from "@/components/customButton";
import { FaStar } from "react-icons/fa6";

interface IService {
    id?: number;
    title?: string;
    description?: string;
    ImgUrl?: string;
    price?: number;
    buttonText?: string;
    unit?: string;
    rating?: number;
    slug?: string;
}

type TProps = {
    services: IService[];
    href?: string;
};

export default function ServiceCarousel({ services, href = "/service" }: TProps) {
    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        loop: true,
        slides: { perView: 1 },
        breakpoints: {
            "(min-width: 640px)": {
                slides: { perView: 2, spacing: 15 },
            },
            "(min-width: 1024px)": {
                slides: { perView: 4, spacing: 20 },
            },
        },
    });

    const prev = () => slider.current?.prev();
    const next = () => slider.current?.next();

    function formatCurrency(value?: number) {
        return value?.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    }

    return (
        <div className="relative">
            <div ref={sliderRef} className="keen-slider">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`${styles.keenSliderSlid} keen-slider__slide`}
                    >
                        <div className="relative rounded-[10px] h-full flex flex-col shadow-lg bg-[#ffffff80]">
                            <Image
                                src={
                                    service.ImgUrl ?? "/images/avt-default.jpg"
                                }
                                alt={service.title ?? "dịch vụ"}
                                width={300}
                                height={200}
                                className="object-cover w-full h-[200px] rounded-[10px]"
                            />
                            <div className="p-4 flex flex-col justify-between gap-8 flex-1">
                                <div className="flex-1">
                                    <h3>
                                        <Link
                                            href={`/service/${service.slug}`}
                                            className="font-bold text-[#2d2d2d] text-[24px] inline-block transition-all duration-300 hover:text-[#01b5f3] hover:underline"
                                        >
                                            {service.title}
                                        </Link>
                                    </h3>
                                    <p className="text-[#4a4a4a]">
                                        {service.description}
                                    </p>
                                    <div className="mt-3">
                                        <span className="mr-1">Chỉ từ</span>
                                        <span className="inline-block font-bold text-3xl text-[#fb0011] mx-1">
                                            {formatCurrency(service.price)}
                                        </span>
                                        <span>/ {service.unit}</span>
                                    </div>
                                </div>
                                <div>
                                    <Link
                                        href={`/service/${service.slug}`}
                                        className="cssbuttons-io-button"
                                    >
                                        {service.buttonText ?? "Xem chi tiết"}
                                        <div className="icon">
                                            <svg
                                                height="24"
                                                width="24"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M0 0h24v24H0z"
                                                    fill="none"
                                                ></path>
                                                <path
                                                    d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                                                    fill="currentColor"
                                                ></path>
                                            </svg>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="absolute top-[10px] left-[10px] flex items-center gap-1 px-4 py-2 bg-blue-500 rounded-2xl">
                                <p className="leading-[1] text-[#fff]">
                                    {service.rating}
                                </p>{" "}
                                <FaStar className="text-yellow-400" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute left-0 right-0 top-[50%] transform -translate-y-1/2 w-full flex justify-between z-10">
                <CustomButton
                    onClick={prev}
                    className={`${styles.btn} ${styles.prev}`}
                >
                    <IoIosArrowBack size={23} color="#fff" />
                </CustomButton>
                <CustomButton
                    onClick={next}
                    className={`${styles.btn} ${styles.next}`}
                >
                    <IoIosArrowForward size={23} color="#fff" />
                </CustomButton>
            </div>
        </div>
    );
}
