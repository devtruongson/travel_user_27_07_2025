"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import TourCard from "@/components/tourCard";
import { createSlug } from "@/utils/slug";

interface FavoriteItem {
    favorite_id: number;
    tour: {
        tour_id: number;
        tour_name: string;
        image: string;
        price: string;
        discount_price?: string;
        duration?: string;
        category?: { category_name: string };
    };
}

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                const res = await API.get("/favorites/my-favorites");
                const list = res?.data?.data?.data || res?.data?.data || [];
                setFavorites(list);
            } catch (err: unknown) {
                const errorMsg =
                    err instanceof Error && "response" in err
                        ? (
                              err as {
                                  response?: { data?: { message?: string } };
                              }
                          ).response?.data?.message
                        : "Không thể tải danh sách yêu thích";
                setError(errorMsg || "Không thể tải danh sách yêu thích");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.scrollTo(0, 100);
        }
    }, []);

    const getFullImageUrl = (path: string) =>
        `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${path}`;

    return (
        <>
            <section className="container m-auto px-4 py-10 md:py-16 mt-[200px]">
                <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-8">
                    Tour yêu thích của bạn
                </h1>
                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : favorites.length === 0 ? (
                    <p>Bạn chưa có tour yêu thích nào.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((f) => (
                            <TourCard
                                key={f.favorite_id}
                                tourId={f.tour.tour_id}
                                href={`/tours/${createSlug(f.tour.tour_name)}`}
                                imgUrl={getFullImageUrl(f.tour.image)}
                                nameTour={f.tour.tour_name}
                                originalPrice={parseFloat(f.tour.price)}
                                promotionPrice={
                                    f.tour.discount_price
                                        ? parseFloat(f.tour.discount_price)
                                        : undefined
                                }
                                time={f.tour.duration}
                                rating={5}
                                category={f.tour.category?.category_name}
                                clasName="h-[500px]"
                                bottomClassName="flex-col"
                                startAddressHidden
                            />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
