"use client";

import MotionFade from "@/components/motionFade";
import ScrollDownIndicator from "@/components/scrollDownIndicator";
import BannerPage from "@/layouts/banner";
import { BACKEND } from "@/lib/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import styles from "./style.module.css";

// Định nghĩa kiểu dữ liệu cho blog
interface Blog {
    id: number;
    title: string;
    description: string;
    markdown: string;
    location: string;
    thumbnail_url: string;
    created_at: string;
    slug: string;
    views_count: number;
    author: string;
}

export default function BlogDetail({ params }: { params: { slug: string } }) {
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                setLoading(true);

                // Gọi API để lấy chi tiết blog theo slug
                const response = await BACKEND.get(
                    `/blogs/slug/${params.slug}`
                );

                if (response.data && response.data.data) {
                    setBlog(response.data.data);
                } else {
                    setError("Không tìm thấy bài viết!");
                }
            } catch (err) {
                console.error("Error fetching blog details:", err);
                setError(
                    "Không thể tải thông tin bài viết. Vui lòng thử lại sau!"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetail();
    }, [params.slug]);

    // Format date function
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="text-center py-20 text-red-500">
                {error || "Không tìm thấy bài viết!"}
            </div>
        );
    }

    return (
        <>
            <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
                <div className="text-center pt-60 relative z-2">
                    <MotionFade animation="fadeInBottomToTop">
                        <h3
                            className={`${styles.subTitle} container m-auto font-[700] text-[80px] italic h-auto mx-auto`}
                        >
                            {blog.title}
                        </h3>
                    </MotionFade>
                </div>
                <ScrollDownIndicator
                    idSection="blog-detail"
                    text="Xem chi tiết"
                    className="scroll-down-page"
                />
            </BannerPage>

            <section id="blog-detail" className="container mx-auto py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Blog metadata */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-gray-600">
                                <span className="font-medium">Ngày đăng:</span>{" "}
                                {formatDate(blog.created_at)}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Địa điểm:</span>{" "}
                                {blog.location}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">
                                <span className="font-medium">Lượt xem:</span>{" "}
                                {blog.views_count || 0}
                            </p>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="mb-10 relative w-full h-[500px]">
                        {blog.thumbnail_url ? (
                            <Image
                                src={blog.thumbnail_url}
                                alt={blog.title}
                                fill
                                className="object-cover rounded-xl"
                            />
                        ) : (
                            <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center rounded-xl">
                                <p className="text-gray-500">
                                    Không có hình ảnh
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">Tóm tắt</h2>
                        <p className="text-lg text-gray-700">
                            {blog.description}
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="prose prose-lg max-w-none">
                        {/* Render markdown content with React Markdown */}
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {blog.markdown}
                        </ReactMarkdown>
                    </div>
                </div>
            </section>
        </>
    );
}
