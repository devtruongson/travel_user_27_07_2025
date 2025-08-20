import MotionFade from "@/components/motionFade";
import ScrollDownIndicator from "@/components/scrollDownIndicator";
import BannerPage from "@/layouts/banner";
import styles from "./style.module.css";
import Image from "next/image";
import { PUBLIC_API } from "@/lib/api";

interface Guide {
    guide_id: number;
    name: string;
    avatar?: string;
    description?: string;
    experience?: string;
    rating?: number;
}

const getGuide = async (): Promise<Guide[]> => {
    try {
        const res = await PUBLIC_API.get("/guides");
        const guidesRaw = res?.data || [];

        const guidesMapped: Guide[] = guidesRaw.map((item: any) => ({
            guide_id: item.guide_id,
            name: item.name,
            avatar: item.album?.images?.[0]?.image_url || "",
            description: item.description || "",
            experience: `Kinh nghiệm: ${item.experience_years} năm\nNgôn ngữ: ${item.language}`,
            rating: item.average_rating,
        }));

        return guidesMapped;
    } catch (error) {
        console.error("Lỗi khi load hướng dẫn viên:", error);
        return [];
    }
};

export default async function GuideDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    console.log(resolvedParams);
    const guides = await getGuide();
    const guideId = Number(resolvedParams.id);
    if (isNaN(guideId)) {
        return <div>Id không hợp lệ!</div>;
    }
    const guide = guides.find((item) => item.guide_id === guideId);

    if (!guide) {
        return (
            <div className="text-center text-red-500 font-bold text-xl h-screen flex items-center justify-center">
                Không tìm thấy hướng dẫn viên!
            </div>
        );
    }

    return (
        <>
            <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
                <div className="text-center pt-60 relative z-2">
                    <MotionFade animation="fadeInBottomToTop">
                        <h1
                            className={`${styles.mainTitle} font-extrabold text-[160px] leading-[1]`}
                        >
                            Hướng dẫn viên
                        </h1>
                        <h3
                            className={`${styles.subTitle} container m-auto font-bold text-[64px] italic`}
                        >
                            {guide.name}
                        </h3>
                    </MotionFade>
                </div>
                <ScrollDownIndicator
                    idSection="guide-detail"
                    text="Xem chi tiết"
                    className="scroll-down-page"
                />
            </BannerPage>

            <section
                id="guide-detail"
                className="container m-auto px-4 py-16 max-w-5xl"
            >
                <MotionFade animation="fadeIn">
                    <div className="flex flex-col items-center gap-8">
                        {guide.avatar && (
                            <Image
                                src={guide.avatar}
                                alt={guide.name}
                                width={300}
                                height={300}
                                className="rounded-full shadow-lg object-cover w-64 h-64"
                            />
                        )}
                        <div className="text-center">
                            <h2 className="text-4xl font-bold mb-2">
                                {guide.name}
                            </h2>
                            {guide.description && (
                                <p className="text-gray-600 text-lg italic">
                                    {guide.description}
                                </p>
                            )}
                            {guide.experience && (
                                <p className="text-base mt-4 text-justify whitespace-pre-line leading-7">
                                    {guide.experience}
                                </p>
                            )}
                        </div>
                        <div className="mt-6 text-yellow-500 font-semibold">
                            Đánh giá: {guide.rating || "Chưa có"} ★
                        </div>
                    </div>
                </MotionFade>
            </section>
        </>
    );
}
