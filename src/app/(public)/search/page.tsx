"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ScrollDownIndicator from "@/components/scrollDownIndicator";
import BannerPage from "@/layouts/banner";
import MotionFade from "@/components/motionFade";
import styles from "./style.module.css";

interface Tour {
    tour_id: number;
    tour_name: string;
    price: string;
    duration: string;
    slug: string;
    category: {
        category_name: string;
    };
}

interface Blog {
    id: number;
    title: string;
    description: string;
    location: string;
    slug: string;
    created_at: string;
}

interface SearchResults {
    tours: Tour[];
    blogs: Blog[];
}

interface Meta {
    tour_count: number;
    blog_count: number;
    total_count: number;
    query: string;
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [activeTab, setActiveTab] = useState("all");

    // Fetch search results
    useEffect(() => {
        if (!query) {
            setResults(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/search`;
                const params = { q: query };

                const response = await axios.get(endpoint, { params });

                if (response.data.success) {
                    setResults(response.data.data as SearchResults);
                    setMeta(response.data.meta);
                } else {
                    setError("Không thể tải kết quả tìm kiếm");
                }
            } catch (err) {
                console.error("Search error:", err);
                setError("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query]);

    return (
        <div>
            <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
                <div className="text-center relative z-2 w-full h-full flex flex-col justify-center items-center">
                    <MotionFade animation="fadeInBottomToTop">
                        <h3
                            className={`${styles.subTitle} font-[700] text-[120px] italic h-auto mx-auto`}
                        >
                            Khám phá VTravel
                        </h3>
                    </MotionFade>
                    {/* <h1 className="text-2xl font-bold mb-2">Kết quả tìm kiếm</h1> */}
                    <p className="text-white mt-6 text-4xl">
                        {query
                            ? `Tìm kiếm cho: "${query}"`
                            : "Vui lòng nhập từ khóa để tìm kiếm"}
                    </p>
                </div>
                <ScrollDownIndicator
                    idSection="search-results"
                    text="Xem kết quả"
                    className="scroll-down-page"
                />
            </BannerPage>

            <div id="search-results" className="container m-auto">
                {query && (
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="mb-6"
                    >
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">
                                Tất cả ({meta?.total_count || 0})
                            </TabsTrigger>
                            <TabsTrigger value="tours">
                                Tours ({meta?.tour_count || 0})
                            </TabsTrigger>
                            <TabsTrigger value="blogs">
                                Bài viết ({meta?.blog_count || 0})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            {loading ? (
                                <div>Đang tải...</div>
                            ) : error ? (
                                <div className="text-red-500">{error}</div>
                            ) : results &&
                                (results.tours.length > 0 ||
                                    results.blogs.length > 0) ? (
                                <>
                                    {results.tours.length > 0 && (
                                        <div className="mb-8">
                                            <h2 className="text-xl font-semibold mb-3">
                                                Tours ({results.tours.length})
                                            </h2>
                                            <ul className="border rounded-md divide-y">
                                                {results.tours.map((tour) => (
                                                    <li
                                                        key={tour.tour_id}
                                                        className="p-3 hover:bg-gray-50"
                                                    >
                                                        <Link
                                                            href={`/tours/${tour.slug}`}
                                                            className="block"
                                                        >
                                                            <div className="font-medium text-cyan-600">
                                                                {tour.tour_name}
                                                            </div>
                                                            <div className="flex justify-between mt-1 text-sm">
                                                                <span>
                                                                    {tour.duration}
                                                                </span>
                                                                <span className="font-semibold">
                                                                    {new Intl.NumberFormat(
                                                                        "vi-VN",
                                                                        {
                                                                            style: "currency",
                                                                            currency:
                                                                                "VND",
                                                                        }
                                                                    ).format(
                                                                        parseFloat(
                                                                            tour.price
                                                                        )
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                Danh mục:{" "}
                                                                {
                                                                    tour.category
                                                                        .category_name
                                                                }
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                            {results.tours.length > 5 && (
                                                <div className="mt-3 text-right">
                                                    <Link
                                                        href="/search?tab=tours"
                                                        className="text-cyan-600 hover:underline"
                                                    >
                                                        Xem thêm tours →
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {results.blogs.length > 0 && (
                                        <div>
                                            <h2 className="text-xl font-semibold mb-3">
                                                Bài viết ({results.blogs.length})
                                            </h2>
                                            <ul className="border rounded-md divide-y">
                                                {results.blogs.map((blog) => (
                                                    <li
                                                        key={blog.id}
                                                        className="p-3 hover:bg-gray-50"
                                                    >
                                                        <Link
                                                            href={`/blog/${blog.slug}`}
                                                            className="block"
                                                        >
                                                            <div className="font-medium text-cyan-600">
                                                                {blog.title}
                                                            </div>
                                                            <div className="text-sm mt-1 line-clamp-2">
                                                                {blog.description}
                                                            </div>
                                                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                                                                <span>
                                                                    {blog.location}
                                                                </span>
                                                                <span>
                                                                    {new Date(
                                                                        blog.created_at
                                                                    ).toLocaleDateString(
                                                                        "vi-VN"
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                            {results.blogs.length > 5 && (
                                                <div className="mt-3 text-right">
                                                    <Link
                                                        href="/search?tab=blogs"
                                                        className="text-cyan-600 hover:underline"
                                                    >
                                                        Xem thêm bài viết →
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8 border rounded-md">
                                    <p className="font-medium">
                                        Không tìm thấy kết quả nào
                                    </p>
                                    <p className="text-gray-500 mt-1">
                                        Không có kết quả nào phù hợp với từ khóa "
                                        {query}". Vui lòng thử tìm kiếm với từ khóa
                                        khác.
                                    </p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="tours">
                            {loading ? (
                                <div>Đang tải...</div>
                            ) : error ? (
                                <div className="text-red-500">{error}</div>
                            ) : results && results.tours.length > 0 ? (
                                <ul className="border rounded-md divide-y">
                                    {results.tours.map((tour) => (
                                        <li
                                            key={tour.tour_id}
                                            className="p-3 hover:bg-gray-50"
                                        >
                                            <Link
                                                href={`/tours/${tour.slug}`}
                                                className="block"
                                            >
                                                <div className="font-medium text-cyan-600">
                                                    {tour.tour_name}
                                                </div>
                                                <div className="flex justify-between mt-1 text-sm">
                                                    <span>{tour.duration}</span>
                                                    <span className="font-semibold">
                                                        {new Intl.NumberFormat(
                                                            "vi-VN",
                                                            {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }
                                                        ).format(
                                                            parseFloat(tour.price)
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Danh mục:{" "}
                                                    {tour.category.category_name}
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 border rounded-md">
                                    <p className="font-medium">
                                        Không tìm thấy tour nào
                                    </p>
                                    <p className="text-gray-500 mt-1">
                                        Không có tour nào phù hợp với từ khóa "
                                        {query}".
                                    </p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="blogs">
                            {loading ? (
                                <div>Đang tải...</div>
                            ) : error ? (
                                <div className="text-red-500">{error}</div>
                            ) : results && results.blogs.length > 0 ? (
                                <ul className="border rounded-md divide-y">
                                    {results.blogs.map((blog) => (
                                        <li
                                            key={blog.id}
                                            className="p-3 hover:bg-gray-50"
                                        >
                                            <Link
                                                href={`/blog/${blog.slug}`}
                                                className="block"
                                            >
                                                <div className="font-medium text-cyan-600">
                                                    {blog.title}
                                                </div>
                                                <div className="text-sm mt-1 line-clamp-2">
                                                    {blog.description}
                                                </div>
                                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                                    <span>{blog.location}</span>
                                                    <span>
                                                        {new Date(
                                                            blog.created_at
                                                        ).toLocaleDateString(
                                                            "vi-VN"
                                                        )}
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 border rounded-md">
                                    <p className="font-medium">
                                        Không tìm thấy bài viết nào
                                    </p>
                                    <p className="text-gray-500 mt-1">
                                        Không có bài viết nào phù hợp với từ khóa "
                                        {query}".
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
}
