/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ButtonGlobal from "@/components/buttonGlobal";
import TourCard from "@/components/tourCard";
import GuideCard from "@/components/travelGuideCard";
import { BACKEND, PUBLIC_API } from "@/lib/api";
import { createSlug } from "@/utils/slug";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import styles from "./style.module.css";

const getToures = async () => {
    try {
        const res = await PUBLIC_API.get("/tours");
        return res?.data || [];
    } catch (error) {
        return null;
    }
};

const getBlogs = async () => {
    try {
        const response = await BACKEND.get(`/blogs`);

        if (response.data && response.data.data && response.data.data.data) {
            return response.data.data.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return [];
    }
};

export default async function Tours() {
    const tours = await getToures();
    const blogs = await getBlogs();
    const length = tours?.length || 0;
    const firstList = tours?.slice(0, length / 2);
    const secondList = tours?.slice(length / 2);

    return (
        <section
            className={`${styles.tours} relative z-10 pt-20 md:pt-28 lg:pt-36`}
        >
            <div className="container m-auto relative z-2 h-full px-4 md:px-6">
                <div
                    className={`${styles.stickyBox} uppercase max-w-full lg:max-w-[400px] mb-8 lg:mb-0`}
                >
                    <h4 className="sub-title text-[#fff] text-sm md:text-base">
                        Danh sách Tours
                    </h4>
                    <h2 className="font-[900] text-[#8e00fb] text-3xl md:text-4xl lg:text-[52px] leading-tight">
                        Khám phá Việt Nam cùng VTravel
                    </h2>
                    <ButtonGlobal
                        text="Khám phá ngay"
                        className="mt-6 md:mt-8"
                        asLink
                        href="/tours"
                    />
                </div>
                <div className="w-full lg:w-[calc(100%-400px)] lg:ml-[400px] relative z-2">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-7">
                        <div className="list-tour w-full md:w-1/2 flex flex-col gap-4 md:gap-7">
                            {(firstList || []).map(
                                (tour: any, index: number) => (
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
                                        originalPrice={Number(
                                            tour?.price || ""
                                        )}
                                        rating={tour?.rating}
                                        clasName="h-[400px] md:h-[500px] lg:h-[600px]"
                                        bottomClassName="justify-between items-center "
                                    />
                                )
                            )}
                        </div>
                        <div className="list-tour w-full md:w-1/2 md:pt-[5rem] lg:pt-[10.69rem] flex flex-col gap-4 md:gap-7">
                            {(secondList || []).map(
                                (tour: any, index: number) => (
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
                                        originalPrice={Number(
                                            tour?.price || ""
                                        )}
                                        rating={tour?.rating}
                                        clasName="h-[400px] md:h-[500px] lg:h-[600px]"
                                        bottomClassName="justify-between items-center "
                                        href={`/tours/${createSlug(
                                            tour.tour_name
                                        )}`}
                                    />
                                )
                            )}
                        </div>
                    </div>
                    <Image
                        src="/images/plane.png"
                        alt="plane"
                        width={500}
                        height={500}
                        quality={100}
                        className="absolute top-[-50px] md:top-[-80px] lg:top-[-100px] left-[50%] object-cover object-center transform translate-y-[-100%] translate-x-[-50%] w-[400px] md:w-[500px] lg:w-[600px] h-auto hidden md:block"
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
                    {blogs && blogs.length > 0 ? (
                        blogs.map((blog: any, index: number) => (
                            <div
                                className="mx-2 sm:mx-4"
                                key={blog.id || index}
                            >
                                <GuideCard
                                    address={blog.location || "Việt Nam"}
                                    imgUrl={
                                        blog.thumbnail_url ||
                                        "/images/blog-placeholder.jpg"
                                    }
                                    title={blog.title}
                                    excerpt={blog.description}
                                    href={`/blog/${blog.slug}`}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-white text-center w-full py-4">
                            Không tìm thấy dữ liệu blog.
                        </div>
                    )}
                </Marquee>
            </div>
        </section>
    );
}
