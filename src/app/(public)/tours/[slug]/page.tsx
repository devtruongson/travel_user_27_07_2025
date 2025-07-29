/* eslint-disable @typescript-eslint/no-unused-vars */
import { notFound } from "next/navigation";
import { PUBLIC_API } from "@/lib/api";
import { createSlug } from "@/utils/slug";
import { getFullImageUrl } from "@/utils/image";
import Link from "next/link";
import BannerPage from "@/layouts/banner";
import styles from "./style.module.css";
import MotionFade from "@/components/motionFade";
import ScrollDownIndicator from "@/components/scrollDownIndicator";
import BookTourButton from "./BookTourButton";
import ReactMarkdown from "react-markdown";
import { getTime } from "@/utils/getTime";

interface Tour {
    tour_id: number;
    tour_name: string;
    description: string;
    itinerary: string;
    image: string;
    price: string;
    discount_price?: string;
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
        console.log("tour >>> ", tour);
        const allRes = await PUBLIC_API.get("/tours");
        const allTours: Tour[] = allRes.data;

        const relatedTours = allTours
            .filter(
                (t) =>
                    t.category?.category_name ===
                        tour.category?.category_name &&
                    t.tour_id !== tour.tour_id
            )
            .slice(0, 3);

        return (
            <div className="min-h-screen bg-gray-100">
                {/* Banner */}
                <BannerPage
                    classNameSection={`${styles.banner} h-screen w-full`}
                    style={{
                        backgroundImage: `url(${getFullImageUrl(tour.image)})`,
                    }}
                >
                    <div className="flex items-center container m-auto justify-center absolute top-0 left-0 right-0 bottom-0 z-2 text-center">
                        <MotionFade
                            animation="fadeInBottomToTop"
                            className="w-full text-white"
                        >
                            <h1
                                className={`${styles.mainTitle} font-bold text-[60px] sm:text-[80px] md:text-[100px]`}
                            >
                                {tour.tour_name}
                            </h1>
                            <p className="text-2xl sm:text-3xl mt-2">
                                {tour.destination} • {tour.duration}
                            </p>
                            <p className="text-xl sm:text-2xl mt-1">
                                {tour.category.category_name}
                            </p>
                        </MotionFade>
                    </div>
                    <ScrollDownIndicator
                        idSection="detail"
                        text="Xem chi tiết"
                        className="scroll-down-page"
                    />
                </BannerPage>

                {/* Main content */}
                <main className="container m-auto px-4 py-12 space-y-16">
                    {/* Giới thiệu */}
                    <section id="detail">
                        <h2 className="text-3xl font-bold text-blue-900 mb-4">
                            Giới thiệu tour
                        </h2>
                        <div className="bg-white p-6 rounded shadow text-gray-700 leading-relaxed">
                            <ReactMarkdown>{tour.description}</ReactMarkdown>
                        </div>
                    </section>

                    {/* Lịch trình */}
                    <section>
                        <h2 className="text-3xl font-bold text-blue-900 mb-4">
                            Lịch trình
                        </h2>
                        <div className="bg-white p-6 rounded shadow text-gray-700 leading-relaxed whitespace-pre-line">
                            {tour?.schedules?.length > 0 ? (
                                tour?.schedules?.map((schedule, index) => (
                                    <div key={index}>
                                        <h4 className="text-[20px] font-bold text-blue-900 mb-4">
                                            Day{schedule.day}: {schedule.title}{" "}
                                            ({getTime(schedule.start_time)} -{" "}
                                            {getTime(schedule.end_time)})
                                        </h4>
                                        {schedule.activity_description ? (
                                            <ReactMarkdown>
                                                {schedule.activity_description}
                                            </ReactMarkdown>
                                        ) : null}
                                    </div>
                                ))
                            ) : (
                                <p>Không có lịch trình</p>
                            )}
                        </div>
                    </section>

                    {/* Gallery */}
                    {tour.album?.images?.length ? (
                        <section>
                            <h2 className="text-3xl font-bold text-blue-900 mb-4">
                                Hình ảnh
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {tour.album.images.map((img) => (
                                    <img
                                        key={img.image_url}
                                        src={getFullImageUrl(img.image_url)}
                                        alt="gallery"
                                        className="w-full h-64 object-cover rounded shadow hover:scale-105 transition-transform duration-300"
                                    />
                                ))}
                            </div>
                        </section>
                    ) : null}

                    {/* Giá tour */}
                    <section className="text-center bg-white p-8 rounded shadow">
                        <h2 className="text-3xl font-bold text-blue-900 mb-4">
                            Giá tour
                        </h2>
                        {tour.discount_price ? (
                            <>
                                <p className="text-2xl text-gray-500 line-through">
                                    {parseInt(tour.price).toLocaleString()}₫
                                </p>
                                <p className="text-4xl font-bold text-red-600 mt-2">
                                    {parseInt(
                                        tour.discount_price
                                    ).toLocaleString()}
                                    ₫
                                </p>
                            </>
                        ) : (
                            <p className="text-4xl font-bold text-blue-900">
                                {parseInt(tour.price).toLocaleString()}₫
                            </p>
                        )}
                        <BookTourButton slug={params.slug} />
                    </section>

                    {/* Tour liên quan */}
                    {relatedTours.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-bold text-blue-900 text-center mb-6">
                                Tour liên quan
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {relatedTours.map((rt) => (
                                    <Link
                                        key={rt.tour_id}
                                        href={`/tours/${createSlug(
                                            rt.tour_name
                                        )}`}
                                        className="bg-white rounded shadow overflow-hidden group"
                                    >
                                        <img
                                            src={getFullImageUrl(rt.image)}
                                            alt={rt.tour_name}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                                        />
                                        <div className="p-4">
                                            <h3 className="text-xl font-semibold text-blue-900 line-clamp-2">
                                                {rt.tour_name}
                                            </h3>
                                            <p className="text-gray-600">
                                                {rt.destination}
                                            </p>
                                            <p className="text-red-600 font-bold">
                                                {parseInt(
                                                    rt.discount_price ||
                                                        rt.price
                                                ).toLocaleString()}
                                                ₫
                                            </p>
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
