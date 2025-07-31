/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./style.module.css";
import ButtonGlobal from "@/components/buttonGlobal";
import TourCard from "@/components/tourCard";
import TOURDATA from "@/data/featured_tours.json";
import GUIDEDATA from "@/data/travel_guide.json";
import Marquee from "react-fast-marquee";
import GuideCard from "@/components/travelGuideCard";
import Image from "next/image";
import { PUBLIC_API } from "@/lib/api";
import getPrice from "@/utils/getPrice";

const getToures = async () => {
    const res = await PUBLIC_API.get("/tours");
    return res?.data || [];
};

export default async function Tours() {
    const tours = await getToures();
    console.log("Tours data >>>>", tours);
    const firstList = tours.slice(0, 8);
    const secondList = tours.slice(8);

    return (
        <section className={`${styles.tours} relative z-10 pt-36`}>
            <div className="container m-auto relative z-2 h-full ">
                <div className={`${styles.stickyBox} uppercase max-w-[400px]`}>
                    <h4 className="sub-title text-[#fff]">Danh sách Tours</h4>
                    <h2 className="font-[900] text-[#8e00fb] text-[52px]">
                        Khám phá Việt Nam cùng VTravel
                    </h2>
                    <ButtonGlobal text="Khám phá ngay" className="mt-8" />
                </div>
                {/* https://dev-test.fstack.io.vn/storage/albums/31/c6ZolvJooziA57ScDpfftkPH1AvQcCVOGAFQGQq2.png */}
                <div className="w-[calc(100%-400px)] ml-[400px] relative z-2">
                    <div className="flex gap-7">
                        <div className="list-tour w-1/2 flex flex-col gap-7">
                            {firstList.map((tour: any, index: number) => (
                                <TourCard
                                    key={index}
                                    imgUrl={`${
                                        process.env.NEXT_PUBLIC_IMAGE_DOMAIN
                                    }/${tour?.image || ""}`}
                                    nameTour={tour.tour_name}
                                    // startAddress={tour.startAddress}
                                    time={tour?.duration || ""}
                                    promotionPrice={Number(
                                        tour?.discount_price || ""
                                    )}
                                    originalPrice={Number(tour?.price || "")}
                                    rating={tour?.rating}
                                    clasName="h-[600px]"
                                    bottomClassName="justify-between items-center "
                                />
                            ))}
                        </div>
                        <div className="list-tour w-1/2 pt-[10.69rem] flex flex-col gap-7">
                            {secondList.map((tour: any, index: number) => (
                                <TourCard
                                    key={index}
                                    imgUrl={`${
                                        process.env.NEXT_PUBLIC_IMAGE_DOMAIN
                                    }/${tour?.image || ""}`}
                                    nameTour={tour.tour_name}
                                    // startAddress={tour.startAddress}
                                    time={tour?.duration || ""}
                                    promotionPrice={Number(
                                        tour?.discount_price
                                    )}
                                    originalPrice={Number(tour?.price || "")}
                                    rating={tour?.rating}
                                    clasName="h-[600px]"
                                    bottomClassName="justify-between items-center "
                                />
                            ))}
                        </div>
                    </div>
                    <Image
                        src="/images/plane.png"
                        alt="plane"
                        width={500}
                        height={500}
                        quality={100}
                        className="absolute top-[-100px] left-[50%] object-cover object-center transform translate-y-[-100%] translate-x-[-50%] w-[600px] h-auto"
                    />
                </div>
            </div>
            <div className="absolute z-4 left-0 right-0 top-0 transform translate-y-[-50%]">
                <Marquee
                    gradient={false}
                    speed={100}
                    pauseOnHover={true}
                    pauseOnClick={true}
                    delay={0}
                    play={true}
                    direction="left"
                    className="cursor-pointer"
                >
                    {GUIDEDATA.map((guide, index) => (
                        <div className="mx-2 sm:mx-4" key={index}>
                            <GuideCard
                                address={guide.address}
                                imgUrl={guide.imgUrl}
                                title={guide.title}
                                excerpt={guide.excerpt}
                            />
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
}
