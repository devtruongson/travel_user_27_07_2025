import {
    Banner,
    TravelStory,
    Intro,
    Tours,
    RegionTour,
    FeedBack,
    Guide,
    Service,
} from "@/layouts/home-section";
import AutoScrollToTop from "@/components/autoScrollToTop";
import type { Metadata } from "next";
import SeoHead from "@/components/SEOHead";

export const metadata: Metadata = {
    title: "VTravel - Trang chủ",
};

export default function Home() {
    return (
        <>
            <SeoHead
                key={`Vtravel, trang chủ `}
                description="Khám phá các địa điểm du lịch hấp dẫn trên khắp Việt Nam cùng VTravel. Tìm hiểu về các tour, điểm đến và trải nghiệm độc đáo."
                title="VTravel - Trang chủ"
                keywords="du lịch, việt nam, vtravel, khám phá, tour, điểm đến"
                url="https://vtravel.vn"
            />
            <SeoHead />
            <AutoScrollToTop />
            <Banner />
            <Intro />
            <Tours />
            <RegionTour />
            <Guide />
            <Service />
            <FeedBack />
            <TravelStory />
        </>
    );
}
