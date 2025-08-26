/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import MotionFade from "@/components/motionFade";
import ScrollDownIndicator from "@/components/scrollDownIndicator";
import BannerPage from "@/layouts/banner";
import { PUBLIC_API } from "@/lib/api";
import { getTime } from "@/utils/getTime";
import { getFullImageUrl } from "@/utils/image";
import { createSlug } from "@/utils/slug";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TourDepartureWrapper from "./TourDepartureWrapper";
import styles from "./style.module.css";
import TourReviewUI from "./Review";
import PromoCodeSection from "./PromoCodeSection";

interface Tour {
    tour_id: number;
    tour_name: string;
    description: string;
    itinerary: string;
    image: string;
    price: string;
    discount_price?: string;
    min_people: number;
    destination: string;
    duration: string;
    album?: {
        images: { image_url: string }[];
    };
    category: {
        category_name: string;
    };
    schedules: {
        day: number;
        destination_id: number;
        start_time: string;
        end_time: string;
        title: string;
        activity_description: string | null;
    }[];
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}) {
    try {
        const res = await PUBLIC_API.get(`/tours/slug/${params.slug}`);
        const tour: Tour = res.data;

        return {
            title: `${tour.tour_name} | VTravel`,
            description: tour.description,
        };
    } catch (error) {
        return {
            title: "Không tìm thấy tour",
            description: "Trang không tồn tại hoặc đã bị xoá.",
        };
    }
}

export default async function TourDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    try {
        const res = await PUBLIC_API.get(`/tours/slug/${params.slug}`);
        const tour: Tour = res.data;
        const allRes = await PUBLIC_API.get("/tours");
        const allTours: Tour[] = allRes.data;
        console.log("Tour details >>>>>>>>>>>>>>>>", tour);
        const relatedTours = allTours
            .filter(
                (t) =>
                    t.category?.category_name ===
                        tour.category?.category_name &&
                    t.tour_id !== tour.tour_id
            )
            .slice(0, 3);

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                {/* Enhanced Banner */}
                <BannerPage
                    classNameSection={`${styles.banner} h-screen w-full relative overflow-hidden`}
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url(${getFullImageUrl(
                            tour.image
                        )})`,
                    }}
                >
                    <div className="pt-[100px] flex items-center container m-auto justify-center absolute top-0 left-0 right-0 bottom-0 z-2 text-center">
                        <MotionFade
                            animation="fadeInBottomToTop"
                            className="w-full text-white px-4"
                        >
                            <div className="backdrop-blur-sm bg-black/20 rounded-3xl p-8 md:p-12 border border-white/20">
                                <h1
                                    className={`${styles.mainTitle} font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 leading-tight`}
                                >
                                    {tour.tour_name}
                                </h1>
                                <div className="flex flex-wrap justify-center items-center gap-4 text-lg sm:text-xl md:text-2xl mb-4">
                                    <span className="bg-blue-600/80 px-4 py-2 rounded-full backdrop-blur-sm">
                                        📍 {tour.destination}
                                    </span>
                                    <span className="bg-emerald-600/80 px-4 py-2 rounded-full backdrop-blur-sm">
                                        ⏰ {tour.duration}
                                    </span>
                                </div>
                                <p className="text-lg sm:text-xl bg-purple-600/80 px-6 py-2 rounded-full backdrop-blur-sm inline-block">
                                    🏷️ {tour.category.category_name}
                                </p>
                            </div>
                        </MotionFade>
                    </div>
                    <ScrollDownIndicator
                        idSection="detail"
                        text="Khám phá chi tiết"
                        className="scroll-down-page"
                    />
                </BannerPage>

                <main className="container m-auto px-4 py-16 space-y-20">
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-32 relative z-10">
                        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-blue-100">
                            <div className="text-3xl mb-3">💰</div>
                            <h3 className="font-bold text-lg text-gray-800 mb-2">
                                Giá Tour
                            </h3>
                            {tour.discount_price ? (
                                <div>
                                    <p className="text-sm text-gray-500 line-through">
                                        {parseInt(tour.price).toLocaleString()}₫
                                    </p>
                                    <p className="text-xl font-bold text-red-600">
                                        {parseInt(
                                            tour.discount_price
                                        ).toLocaleString()}
                                        ₫
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xl font-bold text-blue-900">
                                    {parseInt(tour.price).toLocaleString()}₫
                                </p>
                            )}
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-emerald-100">
                            <div className="text-3xl mb-3">📅</div>
                            <h3 className="font-bold text-lg text-gray-800 mb-2">
                                Thời gian
                            </h3>
                            <p className="text-lg text-gray-700">
                                {tour.duration}
                            </p>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-orange-100">
                            <div className="text-3xl mb-3">👥</div>
                            <h3 className="font-bold text-lg text-gray-800 mb-2">
                                Số người tối thiểu
                            </h3>
                            <p className="text-xl font-bold text-orange-600">
                                {tour.min_people || 2} người
                            </p>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-purple-100">
                            <div className="text-3xl mb-3">🎯</div>
                            <h3 className="font-bold text-lg text-gray-800 mb-2">
                                Danh mục
                            </h3>
                            <p className="text-lg text-gray-700">
                                {tour.category.category_name}
                            </p>
                        </div>
                    </section>

                    <section id="detail" className="scroll-mt-20">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                                Giới thiệu tour
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {tour.description}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
                                Lịch trình chi tiết
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
                        </div>
                        <div className="space-y-6">
                            {tour?.schedules?.length > 0 ? (
                                tour?.schedules?.map((schedule, index) => (
                                    <div key={index} className="group">
                                        <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border-l-4 border-gradient-to-b from-blue-500 to-emerald-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                                <h4 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">
                                                    <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                                                        Ngày {index + 1}:
                                                    </span>{" "}
                                                    {schedule.title}
                                                </h4>
                                                {/* <div className="flex items-center space-x-2 text-sm md:text-base text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                                                    <span>🕐</span>
                                                    <span>
                                                        {getTime(
                                                            schedule.start_time
                                                        )}{" "}
                                                        -{" "}
                                                        {getTime(
                                                            schedule.end_time
                                                        )}
                                                    </span>
                                                </div> */}
                                            </div>
                                            {schedule.activity_description ? (
                                                <div className="prose prose-gray max-w-none text-gray-700 pl-4 border-l-2 border-gray-200">
                                                    <ReactMarkdown>
                                                        {
                                                            schedule.activity_description
                                                        }
                                                    </ReactMarkdown>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white/50 rounded-2xl">
                                    <div className="text-6xl mb-4">📝</div>
                                    <p className="text-xl text-gray-600">
                                        Lịch trình đang được cập nhật
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {tour.album?.images?.length ? (
                        <section>
                            <div className="text-center mb-12">
                                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                                    Thư viện hình ảnh
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tour.album.images.map((img, index) => (
                                    <div
                                        key={img.image_url}
                                        className="group relative overflow-hidden rounded-2xl shadow-xl"
                                    >
                                        <img
                                            src={getFullImageUrl(img.image_url)}
                                            alt={`Gallery image ${index + 1}`}
                                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <p className="text-sm font-medium">
                                                Hình ảnh {index + 1}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : null}

                    <section className="relative">
                        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-1 rounded-3xl">
                            <div className="bg-white rounded-3xl p-8 md:p-12 text-center">
                                <div className="text-6xl mb-6">🎯</div>
                                {/* <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                                    Đặt tour ngay hôm nay!
                                </h2>
                                <div className="mb-8">
                                    {tour.discount_price ? (
                                        <div className="space-y-2">
                                            <p className="text-xl text-gray-500 line-through">
                                                Giá gốc:{" "}
                                                {parseInt(
                                                    tour.price
                                                ).toLocaleString()}
                                                ₫
                                            </p>
                                            <div className="flex items-center justify-center space-x-4">
                                                <p className="text-4xl md:text-5xl font-bold text-red-600">
                                                    {parseInt(
                                                        tour.discount_price
                                                    ).toLocaleString()}
                                                    ₫
                                                </p>
                                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                                                    Giảm{" "}
                                                    {Math.round(
                                                        (1 -
                                                            parseInt(
                                                                tour.discount_price
                                                            ) /
                                                                parseInt(
                                                                    tour.price
                                                                )) *
                                                            100
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {parseInt(
                                                tour.price
                                            ).toLocaleString()}
                                            ₫
                                        </p>
                                    )}
                                </div> */}
                                <div className="mt-8">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                        📅 Chọn ngày khởi hành
                                    </h3>
                                    
                                    {/* Promo Code Section */}
                                    <PromoCodeSection tourId={res?.data?.tour_id} />
                                    
                                    <TourDepartureWrapper tourId={res?.data?.tour_id} />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <TourReviewUI tour_id={res?.data?.tour_id} />
                    </section>

                    {relatedTours.length > 0 && (
                        <section>
                            <div className="text-center mb-12">
                                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
                                    Tour liên quan
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
                                <p className="text-gray-600 mt-4 text-lg">
                                    Khám phá thêm những trải nghiệm tuyệt vời
                                    khác
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedTours.map((rt) => (
                                    <Link
                                        key={rt.tour_id}
                                        href={`/tours/${createSlug(
                                            rt.tour_name
                                        )}`}
                                        className="group block"
                                    >
                                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={getFullImageUrl(
                                                        rt.image
                                                    )}
                                                    alt={rt.tour_name}
                                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-red-600">
                                                    {parseInt(
                                                        rt.discount_price ||
                                                            rt.price
                                                    ).toLocaleString()}
                                                    ₫
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                    {rt.tour_name}
                                                </h3>
                                                <div className="flex items-center text-gray-600 mb-2">
                                                    <span className="mr-2">
                                                        📍
                                                    </span>
                                                    <span>
                                                        {rt.destination}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <span className="text-sm text-gray-500">
                                                        Xem chi tiết
                                                    </span>
                                                    <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                                                        →
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        );
    } catch (error) {
        return notFound();
    }
}
