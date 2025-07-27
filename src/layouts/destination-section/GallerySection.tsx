"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

type Props = {
  images: string[];
};

const randomStyles = [
  "rotate-[-13deg] top-[2rem] left-[-2rem]",
  "rotate-[13deg] top-[12rem] left-[-2rem]",
  "rotate-[-10deg] top-[4rem] left-[1rem]",
  "rotate-[5deg] top-[10rem] left-[0rem]",
  "rotate-[-20deg] top-[4rem] left-[3rem]",
  "rotate-[9deg] top-[8rem] left-[6rem]",
  "rotate-[-15deg] top-[5rem] left-[11rem]",
];

export default function GallerySection({ images }: Props) {
  return (
    <div className="relative h-[34rem] w-full block z-[10] overflow-visible">
      <Swiper
        spaceBetween={-30}
        slidesPerView={"auto"}
        freeMode={true}
        centeredSlides={images.length < 6}
        className="!absolute left-0 w-full z-20 flex justify-center"
        style={{ height: "100%" }}
      >
        {images.map((src, index) => {
          const style = randomStyles[index % randomStyles.length];

          return (
            <SwiperSlide
              key={index}
              className="!h-full !w-[20rem] relative z-10"
              style={{ position: "relative", height: "100%" }}
            >
              <div
                className={`absolute w-[19rem] h-[19rem] ${style}`}
                style={{ zIndex: 10 }}
              >
                <div className="absolute z-1 w-full h-full p-2 bg-white flex flex-col items-center shadow-md rounded-xl">
                  <Image
                    src={src}
                    alt={`gallery-${index}`}
                    width={300}
                    height={200}
                    className="w-full h-[16rem] object-cover rounded"
                    unoptimized={true}
                  />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[200px] h-[40px] bg-black/20 blur-md rounded-full z-0" />

              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}