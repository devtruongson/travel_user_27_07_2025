/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./style.css";
import CustomButton from "@/components/customButton";
import { FaFireAlt } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import getPrice from "@/utils/getPrice";

interface IGuide {
    id: number;
    fullname?: string;
    imgUrl?: string;
    exp?: string;
    rating?: number;
    language?: string[];
}

type TProps = {
    guides: any[];
};

const carousel: KeenSliderPlugin = (slider) => {
    const z = 300;
    let progress = 0;
    let animationFrameId: number;
    let isPaused = false;

    function rotate() {
        const deg = 360 * progress;
        slider.container.style.transform = `translateZ(-${z}px) rotateY(${-deg}deg)`;
    }

    function animate() {
        if (!isPaused) {
            progress += 0.001;
            if (progress > 1) progress -= 1;
            rotate();
        }
        animationFrameId = requestAnimationFrame(animate);
    }

    slider.on("created", () => {
        const deg = 360 / slider.slides.length;
        slider.slides.forEach((element, idx) => {
            element.style.transform = `rotateY(${
                deg * idx
            }deg) translateZ(${z}px)`;

            element.addEventListener("mouseenter", () => {
                isPaused = true;
                element.style.transition = "transform 0.3s";
                element.style.transform += " scale(1.1)";
            });

            element.addEventListener("mouseleave", () => {
                isPaused = false;
                element.style.transition = "transform 0.3s";
                element.style.transform = `rotateY(${
                    deg * idx
                }deg) translateZ(${z}px)`;
            });
        });
        progress = slider.track.details.progress;
        rotate();
        animate();
    });

    slider.on("destroyed", () => {
        cancelAnimationFrame(animationFrameId);
    });
};

export default function TourGuideCarousel(props: TProps) {
    const { guides } = props;
    const [sliderRef] = useKeenSlider<HTMLDivElement>(
        {
            loop: true,
            selector: ".carousel__cell",
            renderMode: "custom",
            mode: "free-snap",
        },
        [carousel]
    );
    console.log("guides", guides);

    if (!guides || guides.length === 0) {
        return <></>;
    }

    return (
        <div className="wrapper w-full">
            <div className="scene">
                <div className="carousel keen-slider" ref={sliderRef}>
                    {(guides || []).map((guide) => {
                        // Xử lý language thành mảng nếu là string
                        const languages = Array.isArray(guide.language)
                            ? guide.language
                            : guide.language
                            ? [guide.language]
                            : [];
                        return (
                            <div
                                className="carousel__cell rounded-[10px] relative"
                                key={guide?.guide_id}
                            >
                                <Image
                                    src={
                                        guide?.album?.images[0]?.image_url || ""
                                    }
                                    alt={guide.name ?? "avatar"}
                                    width={500}
                                    height={500}
                                    quality={100}
                                    className="w-full h-[200px] object-cover object-center"
                                />
                                <div className="py-3 bg-[#a9e8ff] px-4">
                                    <div className="mb-5">
                                        <h3 className="text-center text-[#1d005a] font-bold text-[21px]">
                                            {guide.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5">
                                            <FaFireAlt color="red" />
                                            <div>
                                                <span>
                                                    {guide?.experience_years ||
                                                        ""}
                                                </span>
                                                <span> EXP</span>
                                            </div>
                                        </div>
                                        <div className="rating absolute top-[10px] left-[10px] flex flex-col gap-1 ">
                                            {Array.from(
                                                {
                                                    length:
                                                        guide.average_rating ??
                                                        0,
                                                },
                                                (_, index) => (
                                                    <FaStar
                                                        key={index}
                                                        className="text-yellow-300 text-[1rem]"
                                                    />
                                                )
                                            )}
                                        </div>
                                        <div className="language flex items-center gap-1.5">
                                            <IoLanguage />
                                            <div>{languages.join(", ")}</div>
                                        </div>
                                        <div className="text-[#1d005a] font-semibold mt-2">
                                            Giá/ngày:{" "}
                                            {getPrice(guide.price_per_day)} VNĐ
                                        </div>
                                    </div>
                                    <CustomButton className="tour-learn-more">
                                        <span
                                            className="tour-circle"
                                            aria-hidden="true"
                                        >
                                            <span className="tour-icon tour-arrow"></span>
                                        </span>
                                        <span className="tour-button-text">
                                            Xem chi tiết
                                        </span>
                                    </CustomButton>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
