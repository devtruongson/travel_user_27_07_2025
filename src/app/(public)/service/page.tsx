import styles from "./style.module.css";
import ScrollDownIndicator from "@/components/scrollDownIndicator";
import BannerPage from "@/layouts/banner";
import MotionFade from "@/components/motionFade";
import type { Metadata } from "next";
import SeoHead from "@/components/SEOHead";
import serviceData from "@/data/service.json";
import Link from "next/link";
import "./btnanimation.css";

export const metadata: Metadata = {
    title: "VTravel - Dịch vụ",
};

export default function Service() {
    return (
        <>
            <SeoHead
                key={`Vtravel, service`}
                url="https://vtravel.vn/service"
            />
            <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
                <div className='text-center pt-60 relative z-2'>
                    <MotionFade animation="fadeInBottomToTop">
                        <h3 className={`${styles.subTitle} font-[700] text-[120px] italic h-auto mx-auto`}>Dịch vụ</h3>
                        <h1 className={`${styles.mainTitle} font-[900] text-[180px] leading-[1] h-auto mx-auto`}>VTRAVEL</h1>
                    </MotionFade>
                </div>
                <ScrollDownIndicator idSection='destinationlist' text='Xem tất cả dịch vụ' className='scroll-down-page' />
            </BannerPage>
            <section id="destinationlist" className="container mx-auto px-4 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceData.map((service) => (
                    <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                        <img
                            src={service.ImgUrl}
                            alt={service.title}
                            className="w-full h-60 object-cover"
                        />
                        <div className="p-6 flex flex-col h-full">
                            <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                            <p className="text-primary text-lg font-semibold mb-4">
                                {service.price.toLocaleString()}đ / {service.unit}
                            </p>
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
                    </div>
                ))}
            </section>
        </>
    );
}
