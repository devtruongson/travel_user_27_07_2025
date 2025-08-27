"use client";

import {
    CompanyContact,
    getCompanyContact,
} from "@/services/getCompanyContact";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaHeadphones } from "react-icons/fa";
import { FaArrowRightLong, FaLocationDot } from "react-icons/fa6";
import { FiChevronsRight } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import styles from "./style.module.css";

export default function Footer() {
    const [companyContact, setCompanyContact] = useState<CompanyContact | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyContact = async () => {
            try {
                const contact = await getCompanyContact();
                setCompanyContact(contact);
            } catch (error) {
                console.error("Error fetching company contact:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyContact();
    }, []);

    const listLink = [
        {
            title: "Trang chủ",
            link: "/",
        },
        {
            title: "Về chúng tôi",
            link: "/about",
        },
        {
            title: "Tours",
            link: "/tours",
        },
        {
            title: "Điểm đến",
            link: "/destination",
        },
        {
            title: "Dịch vụ",
            link: "/service",
        },
        {
            title: "Liên hệ",
            link: "/contact",
        },
    ];

    return (
        <footer
            className={`${styles.footer} pt-12 md:pt-20 relative z-10 bg-[#fcf6eb]`}
        >
            <div className="container m-auto flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 relative z-1 px-4 lg:px-0">
                <div className="flex-1 text-center lg:text-left">
                    <Image
                        src="/images/logo.png"
                        alt="VTravel"
                        width={500}
                        height={500}
                        quality={100}
                        className="w-[120px] md:w-[150px] h-auto mb-3 mx-auto lg:mx-0"
                    />
                    <p className="text-sm md:text-[15px] text-[var(--color-content)] font-bold">
                        Hãy cùng chúng tôi đồng hành trên hành trình khám phá
                        những danh lam thắng cảnh tuyệt đẹp, thưởng thức những
                        món ăn đặc sản hấp dẫn và tìm hiểu về lịch sử, văn hóa
                        đa dạng của từng vùng miền.
                    </p>
                    <div>
                        <p className="text-xl md:text-2xl font-bold text-[#250052] mb-2 mt-4 md:mt-7">
                            Theo dõi chúng tôi
                        </p>
                        <div
                            className={`${styles.parent} justify-center lg:justify-start`}
                        >
                            <div className={`${styles.child}`}>
                                <button className={`${styles.button}`}>
                                    <Image
                                        src="/svg/social/facebook.svg"
                                        alt="facebook"
                                        width={30}
                                        height={30}
                                    />
                                </button>
                            </div>
                            <div className={`${styles.child}`}>
                                <button className={`${styles.button}`}>
                                    <Image
                                        src="/svg/social/instagram.svg"
                                        alt="instagram"
                                        width={30}
                                        height={30}
                                    />
                                </button>
                            </div>
                            <div className={`${styles.child}`}>
                                <button className={`${styles.button}`}>
                                    <Image
                                        src="/svg/social/linkedln.svg"
                                        alt="linkedln"
                                        width={30}
                                        height={30}
                                    />
                                </button>
                            </div>
                            <div className={`${styles.child}`}>
                                <button className={`${styles.button}`}>
                                    <Image
                                        src="/svg/social/youtube.svg"
                                        alt="youtube"
                                        width={30}
                                        height={30}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-full lg:w-1/5 text-center lg:text-left">
                    <h5 className={`${styles.headingFooter}`}>Liên kết</h5>
                    <ul className="flex flex-col gap-2 md:gap-3">
                        {listLink.map((item, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-2 justify-center lg:justify-start"
                            >
                                <FiChevronsRight color="#01b9f0" />
                                <Link
                                    href={item.link}
                                    className="text-sm md:text-[17px] text-[#505050] font-bold inline-block hover:text-[#01b9f0]"
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-full md:w-full lg:w-1/4 text-center lg:text-left">
                    <h5 className={`${styles.headingFooter}`}>
                        Liên hệ với chúng tôi
                    </h5>
                    <ul className="flex flex-col gap-3 md:gap-4">
                        <li className="flex items-start gap-1.5 justify-center lg:justify-start text-center lg:text-left">
                            <FaLocationDot
                                color="#01b9f0"
                                size={20}
                                className="mt-1 flex-shrink-0"
                            />
                            <div>
                                <span className="font-bold mr-1 inline-block text-[black] text-sm md:text-base">
                                    Địa chỉ:
                                </span>
                                <span className="text-sm md:text-base">
                                    {loading
                                        ? "Đang tải..."
                                        : companyContact?.address ||
                                        "Chưa có thông tin"}
                                </span>
                            </div>
                        </li>
                        <li className="flex items-center gap-1.5 justify-center lg:justify-start">
                            <FaHeadphones color="#01b9f0" size={20} />
                            <div>
                                <span className="font-bold mr-1 inline-block text-[black] text-sm md:text-base">
                                    Hotline:
                                </span>
                                <span className="text-sm md:text-base">
                                    {loading
                                        ? "Đang tải..."
                                        : companyContact?.hotline ||
                                        "Chưa có thông tin"}
                                </span>
                            </div>
                        </li>
                        <li className="flex items-center gap-1.5 justify-center lg:justify-start">
                            <MdEmail color="#01b9f0" size={20} />
                            <div>
                                <span className="font-bold mr-1 inline-block text-[black] text-sm md:text-base">
                                    Email:
                                </span>
                                <span className="text-sm md:text-base">
                                    {loading
                                        ? "Đang tải..."
                                        : companyContact?.email ||
                                        "Chưa có thông tin"}
                                </span>
                            </div>
                        </li>
                        <li className="flex items-center gap-1.5 justify-center lg:justify-start">
                            <TbWorld color="#01b9f0" size={20} />
                            <div>
                                <span className="font-bold mr-1 inline-block text-[black] text-sm md:text-base">
                                    Website:
                                </span>
                                <span className="text-sm md:text-base">
                                    {loading
                                        ? "Đang tải..."
                                        : companyContact?.website ||
                                        "Chưa có thông tin"}
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="w-full lg:w-1/4">
                    <h5
                        className={`${styles.headingFooter} text-center lg:text-left`}
                    >
                        Đăng ký nhận thông báo
                    </h5>
                    <div className="w-full h-[150px] md:h-[200px] mt-4 md:mt-6">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.483555045352!2d108.24559147575981!3d16.040377840208386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421778ce3d3481%3A0x33fad7e713c5f9d!2sTRAVEL%20BUDDY!5e0!3m2!1svi!2s!4v1748412098844!5m2!1svi!2s"
                            className="w-full h-full rounded-lg"
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
            <div className="container m-auto relative z-1 px-4 lg:px-0">
                <div className="flex justify-center py-4 md:py-5 mt-6 md:mt-10 border-t border-t-[#0c176829] text-center text-sm md:text-base">
                    © 2025{" "}
                    <span className="text-[#01b5f1] inline-block font-bold px-1.5">
                        VTravel
                    </span>
                    . All rights reserved.
                </div>
            </div>
        </footer>
    );
}
