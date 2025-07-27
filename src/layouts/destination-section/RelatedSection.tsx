"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import Image from "next/image";
import Link from "next/link";
import DESTINATIONDATA from "@/data/destinations.json";
import { createSlug } from "@/utils/slug";
import MotionFade from "@/components/motionFade";

const RelatedSection = () => {
  if (DESTINATIONDATA.length < 5) {
    return (
      <p className="text-center text-red-500">
        Cần ít nhất 5 điểm đến để hiển thị carousel.
      </p>
    );
  }

  return (
    <div className="mt-20">
      <MotionFade animation="fadeInBottomToTop" className="text-center mb-10">
        <h2 className="text-4xl font-bold text-[#005089]">
          Khám phá thêm nhiều điểm đến thú vị
        </h2>
      </MotionFade>

      <Swiper
        loop
        modules={[Autoplay, EffectCoverflow]}
        autoplay={{ delay: 3200, disableOnInteraction: false }}
        slidesPerView={5}
        centeredSlides
        spaceBetween={20}
        effect="coverflow"
        grabCursor
        coverflowEffect={{
          rotate: 0,
          depth: 120,
          slideShadows: false,
          scale: 0.9,
        }}
        className="w-full px-4 m-auto"
      >
        {DESTINATIONDATA.map((item) => {
          const slug = createSlug(item.nameDestination);
          return (
            <SwiperSlide key={item.id} className="flex justify-center">
              <Link
                href={`/destination/${slug}`}
                className="block w-full h-[360px] rounded-2xl overflow-hidden shadow-lg bg-white transition-all duration-500"
              >
                <Image
                  src={item.imgBanner}
                  alt={item.nameDestination}
                  width={260}
                  height={180}
                  className="w-full h-[180px] object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {item.nameDestination}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {item.desDestination}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <style jsx global>{`
        .swiper-slide-active a {
          transform: scale(1.1);
          z-index: 10;
        }
        .swiper-slide:not(.swiper-slide-active) a {
          transform: scale(0.9);
          opacity: 0.6;
        }
        .swiper-slide,
        .swiper-slide a {
          transition: transform 0.5s ease, opacity 0.5s ease;
        }
      `}</style>
    </div>
  );
};

export default RelatedSection;
