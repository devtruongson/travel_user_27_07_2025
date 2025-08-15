import styles from "./style.module.css";
import ScrollDownIndicator from "@/components/scrollDownIndicator";
import BannerPage from "@/layouts/banner";
import MotionFade from "@/components/motionFade";
import type { Metadata } from "next";
import SeoHead from "@/components/SEOHead";
import Link from "next/link";
import "./btnanimation.css";
import { getMotorbikes } from "@/services/getMotorbikes";
import { getBuses } from "@/services/getBuses";
import { getGuides } from "@/services/getGuides";
import { getHotels } from "@/services/getHotels";
import type { ServiceItem } from "@/types/services";
import ServiceCard from "@/components/ServiceCard";

export const metadata: Metadata = {
    title: "VTravel - Dịch vụ",
};

export default async function Service() {
    // Lấy dữ liệu từ database
    const [motorbikes, buses, guides, hotels] = await Promise.all([
        getMotorbikes(),
        getBuses(),
        getGuides(),
        getHotels(),
    ]);

    // Debug data
    console.log("Guides data:", guides);

    const services = [
        {
            id: 1,
            title: "Thuê xe máy",
            description: "Thuê xe máy tự lái chất lượng, giao tận nơi.",
            image: "/images/bg-tour3mien.jpg",
            data: (motorbikes?.slice(0, 3) || []) as ServiceItem[],
            linkText: "Thuê ngay",
            linkHref: "/tours",
        },
        {
            id: 2,
            title: "Thuê xe khách",
            description: "Đặt vé xe khách tuyến đường bạn muốn, giá rẻ.",
            image: "/images/banner-tour.jpg",
            data: (buses?.slice(0, 3) || []) as ServiceItem[],
            linkText: "Đặt ngay",
            linkHref: "/tours",
        },
        {
            id: 3,
            title: "Book hướng dẫn viên",
            description: "HDV bản địa chuyên nghiệp, thân thiện.",
            image: "/images/banner-guide.jpg",
            data: (guides?.slice(0, 3) || []) as ServiceItem[],
            linkText: "Book ngay",
            linkHref: "/tours",
        },
        {
            id: 4,
            title: "Đặt phòng",
            description: "Phòng nghỉ từ homestay đến resort cao cấp.",
            image: "/images/banner-profile.jpg",
            data: (hotels?.slice(0, 3) || []) as ServiceItem[],
            linkText: "Đặt ngay",
            linkHref: "/tours",
        },
    ];

    return (
        <>
            <SeoHead
                key={`Vtravel, service`}
                url="https://vtravel.vn/service"
            />
            <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
                <div className="text-center pt-60 relative z-2">
                    <MotionFade animation="fadeInBottomToTop">
                        <h3
                            className={`${styles.subTitle} font-[700] text-[120px] italic h-auto mx-auto`}
                        >
                            Dịch vụ
                        </h3>
                        <h1
                            className={`${styles.mainTitle} font-[900] text-[180px] leading-[1] h-auto mx-auto`}
                        >
                            VTRAVEL
                        </h1>
                    </MotionFade>
                </div>
                <ScrollDownIndicator
                    idSection="destinationlist"
                    text="Xem tất cả dịch vụ"
                    className="scroll-down-page"
                />
            </BannerPage>
            <section
                id="destinationlist"
                className="container mx-auto px-4 py-20"
            >
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Dịch vụ của chúng tôi
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Khám phá đầy đủ các dịch vụ du lịch chất lượng cao từ
                        VTravel
                    </p>
                </div>

                {services.map((service, index) => (
                    <ServiceCard
                        key={service.id}
                        title={service.title}
                        description={service.description}
                        image={service.image}
                        data={service.data}
                        linkText={service.linkText}
                        linkHref={service.linkHref}
                        reversed={index % 2 === 1}
                    />
                ))}

                {/* Call to Action Section */}
                <div className="text-center mt-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-12 text-white">
                    <h3 className="text-3xl font-bold mb-4">
                        Bạn cần hỗ trợ thêm?
                    </h3>
                    <p className="text-lg mb-6 opacity-90">
                        Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn
                        24/7
                    </p>
                    <Link
                        href="/contact"
                        className="bg-white text-cyan-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block"
                    >
                        Liên hệ ngay
                    </Link>
                </div>
            </section>
        </>
    );
}
