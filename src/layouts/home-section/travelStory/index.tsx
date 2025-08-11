"use client";

import ButtonGlobal from "@/components/buttonGlobal";
import GuideCard from "@/components/travelGuideCard";
import { PaperAirplaneIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import styles from "./style.module.css";

// Interface cho dữ liệu blog
interface BlogItem {
    id: number;
    title: string;
    description: string;
    location: string;
    thumbnail_url: string;
    slug: string;
    tags: string;
}

export default function TravelStory() {
    // State để lưu trữ dữ liệu blog
    const [blogData, setBlogData] = useState<BlogItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Hàm để lấy dữ liệu blog từ API
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/blogs`
                );

                if (
                    response.data &&
                    response.data.data &&
                    response.data.data.data
                ) {
                    // Lọc blog có tag chứa "cẩm nang" (không phân biệt hoa thường)
                    const blogs = response.data.data.data.filter(
                        (blog: BlogItem) => {
                            if (!blog.tags) return false;

                            const tags = blog.tags
                                .split(",")
                                .map((tag) => tag.trim().toLowerCase());
                            return tags.some((tag) => tag.includes("cẩm nang"));
                        }
                    );

                    setBlogData(blogs);
                }
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu blog:", err);
                setError("Không thể tải dữ liệu cẩm nang du lịch");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <>
            <section className={`${styles.intro} pt-28 pb-96 text-[#fff]`}>
                <div className="container relative z-10 m-auto flex gap-10">
                    <div className={`${styles.left} w-1/2`}>
                        <div
                            className="w-full h-full px-5 rounded-[10px] overflow-hidden"
                            data-aos="flip-left"
                        >
                            <Image
                                src="/images/intro-image.webp"
                                alt="Intro VTravel"
                                width={800}
                                height={1000}
                                quality={100}
                                className="rounded-[15px]"
                            />
                        </div>
                    </div>
                    <div className="w-1/2" data-aos="fade-up">
                        <div className="mb-5">
                            <h5 className="sub-title">
                                Cùng bạn viết nên câu chuyện du lịch đáng nhớ
                            </h5>
                            <h2 className="main-title">
                                Việt Nam - Điểm đến của mọi trải nghiệm
                            </h2>
                        </div>
                        <span className="desc mb-10 inline-block ">
                            Hãy để chúng tôi đồng hành cùng bạn, từ những chuyến
                            phiêu lưu lý thú đến những khoảnh khắc thư giãn yên
                            bình. Cùng nhau, chúng ta sẽ viết nên những kỷ niệm
                            khó quên trong chuyến hành trình khám phá vẻ đẹp
                            Việt Nam.
                        </span>
                        <ul className={`${styles.list}`}>
                            <li className="mb-7">
                                <div>
                                    <div className={`${styles.icon}`}>
                                        <PaperAirplaneIcon aria-hidden="true" />
                                    </div>
                                </div>
                                <div>
                                    <h6>Chuyến đi độc quyền</h6>
                                    <span>
                                        Khám phá những hành trình đặc biệt, tận
                                        hưởng dịch vụ đẳng cấp và trải nghiệm
                                        Việt Nam theo cách riêng của bạn.
                                    </span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <div className={`${styles.icon}`}>
                                        <UserGroupIcon aria-hidden="true" />
                                    </div>
                                </div>
                                <div>
                                    <h6>Hướng dẫn viên chuyên nghiệp</h6>
                                    <span>
                                        Khám phá những hành trình đặc biệt, tận
                                        hưởng dịch vụ đẳng cấp và trải nghiệm
                                        Việt Nam theo cách riêng của bạn.
                                    </span>
                                </div>
                            </li>
                        </ul>
                        <ButtonGlobal text="Xem thêm" className="mt-10" />
                    </div>
                </div>
                <div className="py-36 absolute z-10 bottom-0 left-0 right-0 transform translate-y-[50%]">
                    <div className="container m-auto mb-10">
                        <p className="uppercase text-[#bfbfbf] font-bold text-[18px] mb-2 ">
                            kiến thức hữu ích cho bạn
                        </p>
                        <h3 className="text-[var(--color-primary)] text-6xl font-[900] leading-[1.3]">
                            Cẩm Nang Du lịch
                        </h3>
                    </div>
                    <div>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-32 bg-white/10 rounded-lg">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center p-6 bg-white/10 rounded-lg">
                                <p className="text-red-300">{error}</p>
                            </div>
                        ) : blogData.length === 0 ? (
                            <div className="text-center p-6 bg-white/10 rounded-lg">
                                <p className="text-white">
                                    Không tìm thấy bài viết cẩm nang du lịch
                                </p>
                            </div>
                        ) : (
                            <Marquee
                                gradient={false}
                                speed={100}
                                pauseOnHover={true}
                                pauseOnClick={true}
                                delay={0}
                                play={true}
                                direction="left"
                                className="cursor-pointer"
                            >
                                {blogData.map((blog) => (
                                    <div className="mx-2 sm:mx-4" key={blog.id}>
                                        <GuideCard
                                            address={blog.location}
                                            imgUrl={
                                                blog.thumbnail_url ||
                                                "/images/placeholder.jpg"
                                            }
                                            title={blog.title}
                                            excerpt={blog.description}
                                            href={`/blog/${blog.slug}`}
                                        />
                                    </div>
                                ))}
                            </Marquee>
                        )}
                    </div>
                </div>
            </section>
            <div className="h-[400px] relative z-9"></div>
        </>
    );
}
