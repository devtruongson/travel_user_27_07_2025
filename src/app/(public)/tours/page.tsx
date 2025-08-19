import styles from "./style.module.css";
import Image from "next/image";
import ScrollDownIndicator from "@/components/scrollDownIndicator";
import TourFilterSection from "./tourFilterSection";
import BannerPage from "@/layouts/banner";
import MotionFade from "@/components/motionFade";
import type { Metadata } from "next";
import SeoHead from "@/components/SEOHead";
import { PUBLIC_API } from "@/lib/api";

export const metadata: Metadata = {
    title: "VTravel - Tours",
};

const getCate = async () => {
    try {
        const res = await PUBLIC_API.get("/tour-categories");
        return res?.data || [];
    } catch (error) {
        console.log("Error fetching categories:", error);
        return null;
    }
};

export default async function ToursPage() {
    const cates = await getCate();

    // console.log("Tour categories:", cates);

    return (
        <>
            <SeoHead key={`Vtravel, tours`} url="https://vtravel.vn/tours" />
            <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
                <div className="absolute z-1 top-0 left-0 right-0 bottom-0 flex justify-between items-center container m-auto">
                    <MotionFade animation="fadeInBottomToTop">
                        <h1
                            className={`${styles.mainTitle} font-[900] text-[180px] leading-[1]`}
                        >
                            VTRAVEL
                        </h1>
                        <h3
                            className={`${styles.subTitle} font-[700] text-[120px] leading-[1]`}
                        >
                            Tất cả Tour
                        </h3>
                    </MotionFade>
                    <MotionFade animation="fadeInRightToLeft">
                        <Image
                            src="/images/vietnam-map-tour.png"
                            priority
                            alt="Vtravel tour"
                            width={500}
                            height={500}
                            className="h-[500px] w-auto"
                        />
                    </MotionFade>
                </div>
                <ScrollDownIndicator
                    idSection="tourlist"
                    text="Xem tất cả Tour"
                    className="scroll-down-page"
                />
            </BannerPage>
            <div className="h-[790px] w-full relative">
                <Image
                    src="/images/nui-scaled.webp"
                    alt="Vietnam"
                    width={1000}
                    height={500}
                    quality={100}
                    className="w-full h-auto object-cover object-center absolute z-3 left-0 right-0 bottom-0"
                />
                <h2
                    className="absolute z-2 left-0 right-0 bottom-[50%] transform translate-y-[60%] text-[200px] font-extrabold w-full text-center"
                    style={{
                        color: "#fff",
                        textShadow: "-5px 8px 9px rgb(0 0 0 / 16%)",
                    }}
                >
                    Việt Nam
                </h2>
                <Image
                    src="/images/bg-slide-cloud.webp"
                    alt="Vietnam"
                    width={1000}
                    height={500}
                    quality={100}
                    className="w-full h-auto object-cover object-center absolute z-1 left-0 right-0 top-0"
                />
                <Image
                    src="/images/may.png"
                    alt="may"
                    width={1000}
                    height={200}
                    className="w-full h-auto absolute z-4 left-0 right-0 bottom-0"
                />
            </div>
            <TourFilterSection cate={cates} />
        </>
    );
}
