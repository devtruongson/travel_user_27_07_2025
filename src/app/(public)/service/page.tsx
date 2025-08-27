"use client";
import { MapPin, Car, Bus, User, Hotel, Calendar, ArrowRight, Star, Clock, Shield } from 'lucide-react';
import styles from "./style.module.css";
import ScrollDownIndicator from "@/components/scrollDownIndicator";
import BannerPage from "@/layouts/banner";
import MotionFade from "@/components/motionFade";
import SeoHead from "@/components/SEOHead";
import Link from "next/link";

const TravelServicesPage = () => {
    const services = [
        {
            id: 1,
            title: "Thuê Xe Máy",
            description: "Khám phá mọi ngóc ngách Việt Nam với xe máy chất lượng cao. Chọn từ xe số đến tay ga, tự lái để trải nghiệm trọn vẹn cảnh sắc và văn hóa địa phương.",
            icon: <Car className="w-8 h-8" />,
            features: ["Xe mới, đầy đủ giấy tờ", "Giao xe tận nơi", "Hỗ trợ 24/7"],
            price: "Từ 150,000₫/ngày",
            available: true,
            color: "bg-gradient-to-br from-blue-500 to-blue-600",
            buttonText: "Xem Loại Xe & Giá",
            buttonIcon: <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />,
            slug: "dat-xe-may",
        },
        {
            id: 2,
            title: "Đặt Xe Khách",
            description: "Di chuyển giữa các thành phố an toàn, thoải mái với xe khách cao cấp. Lịch trình đúng giờ, tài xế kinh nghiệm và tiện nghi hiện đại giúp chuyến đi của bạn thư giãn trọn vẹn.",
            icon: <Bus className="w-8 h-8" />,
            features: ["Xe limousine cao cấp", "Đúng giờ, an toàn", "Wifi miễn phí"],
            price: "Từ 200,000₫/chuyến",
            available: true,
            color: "bg-gradient-to-br from-green-500 to-green-600",
            buttonText: "Xem Lịch Trình & Tuyến",
            buttonIcon: <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />,
            slug: "book-xe-khach"
        },
        {
            id: 3,
            title: "Hướng Dẫn Viên",
            description: "Trải nghiệm văn hóa, lịch sử và ẩm thực Việt Nam cùng hướng dẫn viên chuyên nghiệp. Họ là cầu nối giúp bạn hiểu sâu sắc về cuộc sống và truyền thống địa phương.",
            icon: <User className="w-8 h-8" />,
            features: ["HDV có chứng chỉ", "Kinh nghiệm phong phú", "Thông thạo nhiều ngôn ngữ"],
            price: "Từ 500,000₫/ngày",
            available: true,
            color: "bg-gradient-to-br from-purple-500 to-purple-600",
            buttonText: "Xem Profile HDV",
            buttonIcon: <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />,
            slug: "thue-huong-dan-vien"
        },
        {
            id: 4,
            title: "Đặt Phòng Khách Sạn",
            description: "Chọn lưu trú từ homestay ấm cúng đến resort 5 sao sang trọng. Chúng tôi đảm bảo mức giá tốt, dịch vụ chất lượng và trải nghiệm thoải mái cho mọi ngân sách.",
            icon: <Hotel className="w-8 h-8" />,
            features: ["Đa dạng lựa chọn", "Giá tốt nhất", "Hủy miễn phí"],
            price: "Từ 300,000₫/đêm",
            available: true,
            color: "bg-gradient-to-br from-orange-500 to-orange-600",
            buttonText: "Xem Khách Sạn",
            buttonIcon: <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />,
            slug: "thue-phong-nghi",
        },
        {
            id: 5,
            title: "Tour Theo Yêu Cầu",
            description: "Thiết kế hành trình du lịch cá nhân hóa theo sở thích, thời gian và ngân sách của bạn. Chúng tôi biến mỗi chuyến đi thành trải nghiệm độc đáo, khó quên, với tư vấn chuyên nghiệp từ đội ngũ giàu kinh nghiệm.",
            icon: <Calendar className="w-8 h-8" />,
            features: ["Tùy chỉnh hoàn toàn", "Tư vấn chuyên nghiệp", "Trải nghiệm độc đáo"],
            price: "Liên hệ báo giá",
            available: false,
            color: "bg-gradient-to-br from-red-500 to-red-600",
            buttonText: "Sắp Ra Mắt",
            buttonIcon: null,

        }
    ];

    return (
        <>
            <SeoHead
                key={`Vtravel, service`}
                url="https://vtravel.vn/service"
            />
            <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
                <div className="text-center relative w-full h-full z-2 flex flex-col justify-center items-center">
                    <div>
                        <MotionFade animation="fadeInBottomToTop">
                            <h3
                                className={`${styles.subTitle} font-[700] text-[120px] italic h-auto mx-auto`}
                            >
                                Dịch Vụ Du Lịch
                            </h3>
                            <h1
                                className={`${styles.mainTitle} font-[900] text-[180px] leading-[1] h-auto mx-auto`}
                            >
                                VTRAVEL
                            </h1>
                        </MotionFade>
                        <MotionFade animation="fadeInBottomToTop" delay={0.3}>
                            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-[#fff]">
                                Khám phá vẻ đẹp Việt Nam với các dịch vụ du lịch chất lượng cao,
                                mang đến trải nghiệm hoàn hảo cho chuyến đi của bạn
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 text-[#fff]">
                                <div className="flex items-center bg-[#110856ce] px-4 py-2 rounded-full">
                                    <Shield className="w-5 h-5 mr-2" />
                                    <span>An toàn & Tin cậy</span>
                                </div>
                                <div className="flex items-center bg-[#110856ce] px-4 py-2 rounded-full">
                                    <Star className="w-5 h-5 mr-2" />
                                    <span>Chất lượng 5 sao</span>
                                </div>
                                <div className="flex items-center bg-[#110856ce] px-4 py-2 rounded-full">
                                    <Clock className="w-5 h-5 mr-2" />
                                    <span>Hỗ trợ 24/7</span>
                                </div>
                            </div>
                        </MotionFade>
                    </div>
                </div>
                <ScrollDownIndicator
                    idSection="destinationlist"
                    text="Xem tất cả dịch vụ"
                    className="scroll-down-page"
                />
            </BannerPage>

            {/* Services Section */}
            <div id='destinationlist' className="container mx-auto pb-6 pt-24 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Dịch Vụ Của Chúng Tôi
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Từ phương tiện di chuyển đến lưu trú và trải nghiệm, chúng tôi cung cấp
                        mọi dịch vụ cần thiết cho chuyến du lịch hoàn hảo
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                            style={{
                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                            }}
                        >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                                <div className={`w-full h-full ${service.color} rounded-full transform translate-x-16 -translate-y-16`}></div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-20 h-20 opacity-5">
                                <div className={`w-full h-full ${service.color} rounded-full transform -translate-x-10 translate-y-10`}></div>
                            </div>

                            {/* Service Header */}
                            <div className="relative p-8 pb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`${service.color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <div className="text-white">
                                            {service.icon}
                                        </div>
                                    </div>
                                    {!service.available && (
                                        <div className="relative">
                                            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                                Coming Soon
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur opacity-30 animate-pulse"></div>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Price Badge */}
                                <div className="inline-flex items-center">
                                    <div className={`${service.color} px-4 py-2 rounded-xl`}>
                                        <span className="text-white font-bold text-lg">{service.price}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Service Features */}
                            <div className="px-8 pb-8">
                                <div className="bg-gray-50 rounded-2xl p-6 mb-6 group-hover:bg-gray-100 transition-colors">
                                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                        <Star className="w-5 h-5 text-yellow-500 mr-2" />
                                        Điểm nổi bật
                                    </h4>
                                    <ul className="space-y-3">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center text-gray-700 group/item">
                                                <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                                <span className="font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action Button */}
                                <div className="text-center">
                                    <Link
                                        className={`block w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden group/btn ${service.available
                                            ? `${service.color} text-white hover:shadow-2xl hover:scale-105 active:scale-95`
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            }`}
                                        href={service.available ? `/service/${service.slug}` : '#'}
                                    >
                                        {service.available && (
                                            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                                        )}
                                        <span className="relative flex items-center justify-center">
                                            {service.buttonText}
                                            {service.buttonIcon}
                                        </span>
                                    </Link>
                                </div>
                            </div>

                            {/* Hover Glow Effect */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${service.color} blur-xl -z-10`}></div>
                        </div>
                    ))}
                </div>

                <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
            </div>

            {/* Why Choose Us Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Tại Sao Chọn Chúng Tôi?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Shield className="w-12 h-12 text-blue-500" />,
                                title: "An Toàn Tin Cậy",
                                description: "Đối tác uy tín, dịch vụ được kiểm định kỹ lưỡng"
                            },
                            {
                                icon: <Star className="w-12 h-12 text-yellow-500" />,
                                title: "Chất Lượng Cao",
                                description: "Tiêu chuẩn 5 sao, đánh giá tích cực từ khách hàng"
                            },
                            {
                                icon: <Clock className="w-12 h-12 text-green-500" />,
                                title: "Hỗ Trợ 24/7",
                                description: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ"
                            },
                            {
                                icon: <MapPin className="w-12 h-12 text-red-500" />,
                                title: "Phủ Sóng Toàn Quốc",
                                description: "Có mặt tại tất cả các điểm du lịch nổi tiếng"
                            }
                        ].map((benefit, index) => (
                            <div key={index} className="text-center group">
                                <div className="bg-gray-50 rounded-2xl p-8 group-hover:bg-gray-100 transition-colors">
                                    <div className="flex justify-center mb-4">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Sẵn Sàng Khám Phá Việt Nam?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Đặt tour ngay hôm nay để sử dụng tất cả các dịch vụ trên và nhận ưu đãi đặc biệt cho chuyến du lịch hoàn hảo
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center"
                            href="/tours"
                        >
                            <Calendar className="w-5 h-5 mr-2" />
                            Đặt Tour Ngay
                        </Link>
                        <Link
                            className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-colors"
                            href="/contact"
                        >
                            Liên hệ Tư Vấn
                        </Link>
                    </div>

                    <div className="mt-8 p-4 bg-white/10 rounded-2xl max-w-md mx-auto">
                        <p className="text-sm">
                            💡 <strong>Lưu ý:</strong> Các dịch vụ trên được tích hợp sẵn trong các gói tour của chúng tôi
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TravelServicesPage;