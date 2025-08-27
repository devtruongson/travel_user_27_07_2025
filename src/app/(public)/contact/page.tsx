"use client";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BannerPage from "@/layouts/banner";
import MotionFade from "@/components/motionFade";
import styles from "./style.module.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { PUBLIC_API } from "@/lib/api";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ScrollDownIndicator from "@/components/scrollDownIndicator";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [service, setService] = useState("");

    // State cho form
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        content: ""
    });

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullname || !formData.email || !formData.phone || !formData.content || !service) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setLoading(true);

        try {
            // Gọi API để lưu contact
            await PUBLIC_API.post("/contacts", {
                service_type: service,
                full_name: formData.fullname,
                email: formData.email,
                phone: formData.phone,
                message: formData.content,
                status: "pending"
            });

            toast.success("Gửi yêu cầu liên hệ thành công!");

            // Reset form
            setFormData({
                fullname: "",
                email: "",
                phone: "",
                content: ""
            });
            setService("");

        } catch (error) {
            console.error("Error submitting contact form:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
                <div className="text-center relative z-2 w-full h-full flex flex-col justify-center items-center">
                    <MotionFade animation="fadeInBottomToTop">
                        <h3
                            className={`${styles.subTitle} font-[700] text-[120px] italic h-auto mx-auto`}
                        >
                            Contact Us
                        </h3>
                        <h1
                            className={`${styles.mainTitle} font-[900] text-[180px] leading-[1] h-auto mx-auto`}
                        >
                            VTRAVEL
                        </h1>
                    </MotionFade>
                </div>
                <ScrollDownIndicator
                    idSection="contact"
                    text="Liên hệ với chúng tôi"
                    className="scroll-down-page"
                />
            </BannerPage>
            <section id="contact" className="py-20">
                <Tabs defaultValue="account">
                    <TabsList className="w-3xl lg:w-2xl md:w-xl sm:w-lg h-13 mt-5 mb-3 mx-auto ">
                        <TabsTrigger
                            value="account"
                            className="xl:text-xl lg:text-xl md:text-lg sm:text-lg text-gray-400 font-extrabold focus:text-blue-500 border-s-gray-500"
                        >
                            Hỗ trợ khách hàng
                        </TabsTrigger>
                        <TabsTrigger
                            value="password"
                            className="xl:text-xl lg:text-xl md:text-lg sm:text-lg text-gray-400 font-extrabold focus:text-blue-500 border-s-gray-500"
                        >
                            Tuyển dụng và đối tác
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <div className="xl:w-5xl lg:w-3xl md:w-2xl sm:w-xl h-auto mx-auto mb-7 bg-white border border-s-gray-100 rounded-xl px-14 py-7">
                            <form onSubmit={handleSubmit}>
                                <div className=" xl:w-4xl lg:w-2xl md:w-xl sm:w-lg h-auto mt-8">
                                    <Label
                                        className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-bold mb-2"
                                        htmlFor="fullname"
                                    >
                                        Tên của bạn
                                    </Label>
                                    <div className="w-full border border-blue-400 rounded-xl">
                                        <Input
                                            type="text"
                                            name="fullname"
                                            placeholder="Nhập tên đầy đủ"
                                            value={formData.fullname}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex xl:flex-nowrap lg:flex-nowrap md:flex-wrap sm:flex-wrap mt-7 ">
                                    <div>
                                        <Label
                                            className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-bold mb-2"
                                            htmlFor="email"
                                        >
                                            Email
                                        </Label>
                                        <div className="xl:w-[600px] lg:w-[480px] md:w-xl sm:w-lg border border-blue-400 rounded-xl">
                                            <Input
                                                type="text"
                                                name="email"
                                                placeholder="Nhập email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="xl:ml-3 lg:ml-3 md:ml-0 sm:ml-0 xl:mt-0 lg:mt-0 md:mt-7 sm:mt-7">
                                        <Label
                                            className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-bold mb-2"
                                            htmlFor="phone"
                                        >
                                            Số điện thoại
                                        </Label>
                                        <div className="xl:w-full lg:w-full md:w-xl sm:w-lg border border-blue-400 rounded-xl">
                                            <Input
                                                type="text"
                                                name="phone"
                                                placeholder="Nhập số điện thoại"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="xl:w-4xl lg:w-2xl md:w-xl sm:w-lg h-auto mt-8">
                                    <Label
                                        className="xl:text-xl lg:text-xl md:text-lg sm:text-lg font-bold mb-2"
                                        htmlFor="content"
                                    >
                                        Nội dung bạn muốn gửi
                                    </Label>
                                    <div className="w-full min-h-56 border border-blue-400 rounded-xl mb-3">
                                        <Textarea
                                            name="content"
                                            placeholder="Nhập nội dung của bạn ở đây!"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="xl:w-4xl lg:w-2xl md:w-xl sm:w-lg h-[60px] xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-bold text-center text-white bg-blue-400 hover:bg-blue-500 disabled:bg-blue-300 rounded-2xl mt-4 cursor-pointer mb-8 transition-colors"
                                >
                                    {loading ? "Đang gửi..." : "Gửi ngay"}
                                </button>
                            </form>

                            <div className="xl:w-4xl lg:w-3xl md:w-2xl sm:w-xl h-auto rounded-2xl mb-7 px-14 py-7 bg-white border border-s-gray-100">
                                <h1 className="xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-bold mb-1.5">
                                    Tổng đài hỗ trợ
                                </h1>
                                <p className="text-lg font-medium text-gray-400 mb-4">
                                    Áp dụng cước phí nhà mạng thông thường
                                </p>
                                <h3 className="text-lg text-gray-600 font-normal">
                                    Hotline:
                                    <p className="text-lg font-bold text-blue-500 ml-1.5 inline-flex">
                                        0987 654 321
                                    </p>
                                </h3>
                            </div>

                            <div className="xl:w-4xl lg:w-3xl md:w-2xl sm:w-xl h-auto rounded-2xl mb-7 px-14 py-7  bg-white border border-s-gray-100">
                                <h1 className="xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-bold mb-1.5">
                                    Công ty cổ phần VTravel Discover Việt Nam
                                </h1>
                                <div className="my-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-6 inline-flex mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                        />
                                    </svg>
                                    <h2 className="text-lg font-bold inline-flex">
                                        Hà Nội
                                    </h2>
                                    <p className="text-base text-gray-700 font-normal ml-8">
                                        123 Lê Duẩn - Văn Miếu - Đống Đa - TĐ.
                                        Hà Nội
                                    </p>
                                    <div className="xl:w-3xl lg:w-2xl md:w-xl sm:w-lg h-[1px] bg-gray-300 mt-4"></div>
                                </div>
                                <div className="my-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-6 inline-flex mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                        />
                                    </svg>
                                    <h2 className="text-lg font-bold inline-flex">
                                        Đà Nẵng
                                    </h2>
                                    <p className="text-base text-gray-700 font-normal ml-8">
                                        116 Nguyễn Huy Tưởng - Hòa Minh - TP. Đà
                                        Nẵng
                                    </p>
                                    <div className="xl:w-3xl lg:w-2xl md:w-xl sm:w-lg h-[1px] bg-gray-300 mt-4"></div>
                                </div>
                                <div className="my-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-6 inline-flex mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                        />
                                    </svg>
                                    <h2 className="text-lg font-bold inline-flex">
                                        Hồ Chí Minh
                                    </h2>
                                    <p className="text-base text-gray-700 font-normal ml-8">
                                        345 Lý Thái Tổ - Phường 1 - Quận 3 - TP.
                                        Hồ chí Minh
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="password">
                        <div className="xl:w-5xl lg:w-3xl md:w-2xl sm:w-xl h-auto rounded-2xl mx-auto mb-7 px-14 py-7 bg-white border border-s-gray-100">
                            <h1 className="xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-bold mb-1.5">
                                Tuyển dụng
                            </h1>
                            <h3 className="xl:text-lg lg:text-lg md:text-base sm:text-base font-medium text-gray-800 mt-4 ">
                                Để tìm hiểu thêm về cơ hội nghề nghiệp, vui lòng
                                nhắn tin hoặc liên hệ đến chúng tôi qua{" "}
                                <p className="font-bold text-blue-500 inline-flex">
                                    email
                                </p>{" "}
                                hoặc{" "}
                                <p className="font-bold text-blue-500 inline-flex">
                                    số điện thoại
                                </p>
                                .
                            </h3>
                        </div>

                        <div className="xl:w-5xl lg:w-3xl md:w-2xl sm:w-xl h-auto rounded-2xl mx-auto mb-7 px-14 py-7 bg-white border border-s-gray-100">
                            <h1 className="xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-bold mb-1.5">
                                Đối tác và truyền thông
                            </h1>
                            <h3 className="xl:text-lg lg:text-lg md:text-base sm:text-base font-medium text-gray-800 mt-4">
                                Đối với các yêu cầu hoặc đề nghị hợp tác, vui
                                lòng gửi email về cho chúng tôi tại:{" "}
                                <p className="font-bold text-blue-500 inline-flex">
                                    vtravel@gmail.com
                                </p>{" "}
                                hoặc liên hệ{" "}
                                <p className="font-bold text-blue-500 inline-flex">
                                    0987 654 321
                                </p>
                                .
                            </h3>
                        </div>

                        <div className="xl:w-5xl lg:w-3xl md:w-2xl sm:w-xl h-auto rounded-2xl mx-auto mb-7 px-14 py-7 bg-white border border-s-gray-100">
                            <h1 className="xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-bold mb-1.5">
                                Đăng ký đối tác khách sạn
                            </h1>
                            <div className="xl:text-lg lg:text-lg md:text-base sm:text-base font-medium text-gray-800 mt-4">
                                Đăng ký bán phòng khách sạn tại VTravel, Quý đối
                                tác sẽ mở ra cơ hội tiếp cận vô vàn khách hàng
                                tiềm năng không chỉ trong nước mà còn đến từ
                                khắp nơi trên thế giới. Quý đối tác sẽ được cung
                                cấp các công cụ, dữ liệu phân tích chuyên sâu và
                                sự hỗ trợ tốt nhất từ đội ngũ chuyên viên nhiều
                                kinh nghiệm.
                                <h3 className="text-lg font-medium text-gray-800">
                                    Liên hệ chúng tôi qua email:{" "}
                                    <p className="font-bold text-blue-500 inline-flex">
                                        vtravel@gmail.com
                                    </p>
                                </h3>{" "}
                            </div>
                        </div>

                        <div className="xl:w-5xl lg:w-3xl md:w-2xl sm:w-xl h-auto rounded-2xl mx-auto mb-7 px-14 py-7 bg-white border border-s-gray-100">
                            <h1 className="xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-bold mb-1.5">
                                Đăng ký tài khoản đại lý
                            </h1>
                            <div className="xl:text-lg lg:text-lg md:text-base sm:text-base font-medium text-gray-800 mt-4">
                                Đăng ký làm Đại Lý/Cộng Tác Viên với những chính
                                sách hỗ trợ, đảm bảo tối đa quyền lợi, Vtravel
                                hân hạnh đồng hành cùng quý Đại Lý trên chặng
                                đường khẳng định thương hiệu, vươn tầm quốc tế!
                                <h3 className="text-lg font-medium text-gray-800">
                                    Vui lòng gửi để nghị với chúng tôi qua email{" "}
                                    <p className="font-bold text-blue-500 inline-flex">
                                        vtravel@gmail.com
                                    </p>{" "}
                                    hoặc liên hệ qua hotline để được hỗ trợ.
                                </h3>
                            </div>
                        </div>

                        <div className="xl:w-5xl lg:w-3xl md:w-2xl sm:w-xl h-auto rounded-2xl mx-auto mb-7 px-14 py-7 bg-white border border-s-gray-100">
                            <h1 className="xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-bold mb-1.5">
                                Chăm sóc khách hàng
                            </h1>
                            <div className="xl:text-lg lg:text-lg md:text-base sm:text-base font-medium text-gray-800 mt-4">
                                Đội ngũ Dịch vụ & Chăm sóc Khách hàng luôn sẵn
                                sàng hỗ trợ quý khách 24/7, bất kể nơi đâu. Với
                                tôn chỉ “khách hàng là cốt lõi của doanh
                                nghiệp”, Vietnam Booking xin cam kết mang đến
                                cho bạn dịch vụ chăm sóc tận tình! Vui lòng liên
                                hệ{" "}
                                <p className="font-bold text-blue-500 inline-flex">
                                    1900 686 686
                                </p>
                                , email{" "}
                                <p className="font-bold text-blue-500 inline-flex">
                                    cskh@vtravel.com
                                </p>{" "}
                                để chúng tôi được hỗ trợ bạn chu đáo hơn.
                            </div>
                        </div>

                        <div className="xl:w-5xl lg:w-3xl md:w-2xl sm:w-xl h-auto rounded-2xl mx-auto mb-7 px-14 py-7  bg-white border border-s-gray-100">
                            <h1 className="xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-bold mb-1.5">
                                Tổng đài hỗ trợ
                            </h1>
                            <p className="text-lg font-medium text-gray-400 mb-4">
                                Áp dụng cước phí nhà mạng thông thường
                            </p>
                            <h3 className="text-lg text-gray-600 font-normal">
                                Hotline:
                                <p className="text-lg font-bold text-blue-500 ml-1.5 inline-flex">
                                    0987 654 321
                                </p>
                            </h3>
                        </div>

                        <div className="xl:w-5xl lg:w-3xl md:w-2xl sm:w-xl h-auto rounded-2xl mx-auto mb-7 px-14 py-7  bg-white border border-s-gray-100">
                            <h1 className="xl:text-2xl lg:text-2xl md:text-xl sm:text-xl font-bold mb-1.5">
                                Công ty cổ phần VTravel Discover Việt Nam
                            </h1>
                            <div className="my-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-6 inline-flex mr-2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                    />
                                </svg>
                                <h2 className="text-lg font-bold inline-flex">
                                    Hà Nội
                                </h2>
                                <p className="text-base text-gray-700 font-normal ml-8">
                                    123 Lê Duẩn - Văn Miếu - Đống Đa - TĐ. Hà
                                    Nội
                                </p>
                                <div className="xl:w-4xl lg:w-2xl md:w-xl sm:w-lg h-[1px] mr-14 bg-gray-300 mt-4"></div>
                            </div>
                            <div className="my-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-6 inline-flex mr-2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                    />
                                </svg>
                                <h2 className="text-lg font-bold inline-flex">
                                    Đà Nẵng
                                </h2>
                                <p className="text-base text-gray-700 font-normal ml-8">
                                    116 Nguyễn Huy Tưởng - Hòa Minh - TP. Đà
                                    Nẵng
                                </p>
                                <div className="xl:w-4xl lg:w-2xl md:w-xl sm:w-lg h-[1px] bg-gray-300 mt-4"></div>
                            </div>
                            <div className="my-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-6 inline-flex mr-2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                    />
                                </svg>
                                <h2 className="text-lg font-bold inline-flex">
                                    Hồ Chí Minh
                                </h2>
                                <p className="text-base text-gray-700 font-normal ml-8">
                                    345 Lý Thái Tổ - Phường 1 - Quận 3 - TP. Hồ
                                    chí Minh
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </section>
        </div>
    );
}
