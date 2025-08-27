"use client";

import MotionFade from "@/components/motionFade";
import ScrollDownIndicator from "@/components/scrollDownIndicator";
import BannerPage from "@/layouts/banner";
import { BACKEND } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

// Định nghĩa kiểu dữ liệu cho blog
interface Blog {
    id: number;
    title: string;
    description: string;
    location: string;
    thumbnail_url: string;
    created_at: string;
    slug: string;
    view_count: number;
    author: string;
}

export default function BlogPage() {
    const [featuredBlog, setFeaturedBlog] = useState<Blog | null>(null);
    const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Lấy blog nổi bật (view_count cao nhất)
        const fetchFeaturedBlog = async () => {
            try {
                const res = await BACKEND.get("/blogs/featured");
                if (res.data && res.data.success && res.data.data) {
                    setFeaturedBlog(res.data.data);
                } else {
                    setFeaturedBlog(null);
                }
            } catch (err) {
                setFeaturedBlog(null);
            }
        };

        // Lấy danh sách blog phân trang
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await BACKEND.get(`/blogs`, {
                    params: { page: currentPage, limit: 10 },
                });

                if (
                    response.data &&
                    response.data.data &&
                    response.data.data.data
                ) {
                    const blogs = response.data.data.data;
                    const meta = response.data.data;
                    setLastPage(meta?.last_page || 1);

                    setLatestBlogs(blogs);
                } else {
                    setLatestBlogs([]);
                }
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setError("Không thể tải dữ liệu blog. Vui lòng thử lại sau!");
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedBlog();
        fetchBlogs();
    }, [currentPage]);

    // Format date function
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    // Phân trang
    const renderPagination = () => (
        <div className="flex justify-center items-center gap-2 py-6">
            <button
                className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
            >
                Trang trước
            </button>
            <span className="px-2 text-sm">
                Trang {currentPage} / {lastPage}
            </span>
            <button
                className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
                disabled={currentPage === lastPage}
                onClick={() => {
                    setCurrentPage((p) => Math.min(lastPage, p + 1));
                    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
            >
                Trang sau
            </button>
        </div>
    );

    return (
        <>
            <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
                <div className="text-center w-full h-full flex relative z-2 justify-center items-center">
                    <MotionFade animation="fadeInBottomToTop">
                        <h3
                            className={`${styles.subTitle} font-[700] text-[120px] italic h-auto mx-auto`}
                        >
                            Blog
                        </h3>
                        <h1
                            className={`${styles.mainTitle} font-[900] text-[180px] leading-[1] h-auto mx-auto`}
                        >
                            VTRAVEL
                        </h1>
                    </MotionFade>
                </div>
                <ScrollDownIndicator
                    idSection="blog"
                    text="Xem tất cả Blog"
                    className="scroll-down-page"
                />
            </BannerPage>

            <section
                id="blog"
                className="container pb-40 pt-28"
                ref={scrollRef}
            >
                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #c1c1c1;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #a8a8a8;
                    }
                `}</style>
                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">
                        {error}
                    </div>
                ) : (
                    <div>
                        <div className="w-full mx-auto">
                            <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                                {/* Featured Blog */}
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-black mt-5 mb-3">
                                        🏆 Blog nổi bật (Lượt xem cao nhất)
                                    </h1>
                                    {featuredBlog && (
                                        <>
                                            <Link
                                                href={`/blog/${featuredBlog.slug}`}
                                            >
                                                <Image
                                                    src={
                                                        featuredBlog.thumbnail_url ||
                                                        "/images/blog-placeholder.jpg"
                                                    }
                                                    width={600}
                                                    height={400}
                                                    quality={100}
                                                    alt={featuredBlog.title}
                                                    className="w-full h-[400px] rounded-xl object-cover"
                                                />
                                                <div className="my-5 flex items-center gap-3">
                                                    <span className="inline-flex px-7 py-1 text-[18px] font-bold bg-gray-200 rounded-[7px] text-blue-500">
                                                        {featuredBlog.location}
                                                    </span>
                                                    <span className="inline-flex px-4 py-1 text-[16px] font-bold bg-yellow-400 rounded-[7px] text-yellow-900">
                                                        👑{" "}
                                                        {featuredBlog.view_count ||
                                                            0}{" "}
                                                        lượt xem
                                                    </span>
                                                </div>
                                                <h2 className="text-2xl md:text-[30px] font-extrabold text-black hover:text-blue-600 transition-colors">
                                                    {featuredBlog.title}
                                                </h2>
                                            </Link>
                                            <p className="py-2 text-lg md:text-[20px] font-normal text-gray-900 line-clamp-3">
                                                {featuredBlog.description}
                                            </p>
                                            <div className="flex items-center mt-2">
                                                <p className="text-[18px] font-normal text-gray-900">
                                                    {formatDate(
                                                        featuredBlog.created_at
                                                    )}
                                                </p>
                                                <p className="text-[18px] font-normal text-gray-900 px-6">
                                                    {featuredBlog.view_count ||
                                                        0}{" "}
                                                    lượt xem
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* All Blogs */}
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-black mt-5 mb-3">
                                        Tất cả blog
                                    </h1>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 overflow-y-auto pr-2 custom-scrollbar">
                                        {latestBlogs.map((blog) => (
                                            <div key={blog.id} className="mb-3">
                                                <Link
                                                    href={`/blog/${blog.slug}`}
                                                >
                                                    <Image
                                                        src={
                                                            blog.thumbnail_url ||
                                                            "/images/blog-placeholder.jpg"
                                                        }
                                                        width={300}
                                                        height={200}
                                                        quality={100}
                                                        alt={blog.title}
                                                        className="w-full h-[200px] rounded-xl object-cover"
                                                    />
                                                    <div className="my-3">
                                                        <span className="inline-flex px-5 text-[18px] font-medium bg-gray-200 rounded-[7px] text-blue-500 mr-2">
                                                            {blog.location}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-xl font-bold text-black my-1.5 hover:text-blue-600 transition-colors line-clamp-2">
                                                        {blog.title}
                                                    </h2>
                                                </Link>
                                                <div className="flex items-center mt-1">
                                                    <p className="text-[16px] font-normal text-gray-900">
                                                        {formatDate(
                                                            blog.created_at
                                                        )}
                                                    </p>
                                                    <p className="text-[16px] font-normal text-gray-900 px-6">
                                                        {blog.view_count || 0}{" "}
                                                        lượt xem
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {renderPagination()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
