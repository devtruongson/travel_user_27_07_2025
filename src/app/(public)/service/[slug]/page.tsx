'use client';

import MotionFade from "@/components/motionFade";
import ScrollDownIndicator from "@/components/scrollDownIndicator";
import BannerPage from "@/layouts/banner";
import styles from "./style.module.css";
import serviceData from "@/data/service.json";
import { PUBLIC_API } from "@/lib/api";
import { useEffect, useState } from "react";
import { use } from 'react';

interface Params {
  slug: string;
}

const serviceDescriptions: Record<string, string> = {
  "thue-phong-nghi": "Khám phá các phòng nghỉ tiện nghi, sang trọng với mức giá hợp lý, giúp bạn có trải nghiệm thư giãn trọn vẹn.",
  "book-xe-khach": "Đặt xe khách nhanh chóng, an toàn, với nhiều tuyến đường và loại xe đa dạng, đảm bảo hành trình thoải mái.",
  "dat-xe-may": "Tự do khám phá mọi nẻo đường Việt Nam với dịch vụ thuê xe máy chất lượng, dễ dàng đặt và nhận xe mọi lúc.",
  "thue-huong-dan-vien": "Thuê hướng dẫn viên chuyên nghiệp, am hiểu địa phương, mang đến trải nghiệm du lịch đầy ý nghĩa và thú vị."
};

export default function ServiceDetail({ params }: { params: Params }) {
  const resolvedParams = use(params as unknown as Promise<Params>);
  const slug = resolvedParams.slug;

  const [dataService, setDataService] = useState<any[]>([]);
  const service = serviceData.find(item => item.slug === slug);

  const getServiceData = async (slug: string) => {
    try {
      let endpoint = "";
      switch (slug) {
        case "thue-phong-nghi":
          endpoint = "/hotels";
          break;
        case "book-xe-khach":
          endpoint = "/bus-routes";
          break;
        case "dat-xe-may":
          endpoint = "/motorbikes";
          break;
        case "thue-huong-dan-vien":
          endpoint = "/guides";
          break;
        default:
          return null;
      }
      const res = await PUBLIC_API.get(endpoint);
      setDataService(res?.data || []);
    } catch (error) {
      console.error(`Error fetching data for ${slug}:`, error);
    }
  }

  useEffect(() => {
    getServiceData(slug);
  }, [slug]);

  if (!service) {
    return (
      <div className="text-center py-20 text-red-500 font-bold text-xl">
        Không tìm thấy dịch vụ!
      </div>
    );
  }

  // Render từng loại dịch vụ
  const renderServiceCards = () => {
    return (
      <div>
        {/* Tiêu đề & giới thiệu */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extrabold text-purple-700 mb-6">{service.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {serviceDescriptions[slug] || "Khám phá các dịch vụ nổi bật của chúng tôi. Mỗi dịch vụ được trình bày chi tiết và dễ đọc để bạn lựa chọn."}
          </p>
        </div>

        {/* Grid Card */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {dataService.map((item: any) => {
            let key = item.hotel_id || item.bus_route_id || item.motorbike_id || item.guide_id;
            let image = item.image || item.album?.images?.[0]?.image_url || "";
            let name = item.name || item.route_name || item.bike_type;
            return (
              <div key={key} className="bg-white shadow-xl rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                {image && (
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-[250px] object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-indigo-700 mb-2">{name}</h3>

                  {/* Chi tiết từng loại dịch vụ */}
                  {slug === "thue-phong-nghi" && (
                    <>
                      <p className="text-lg text-gray-700 mb-1">Loại phòng: {item.room_type}</p>
                      <p className="text-lg text-gray-700 mb-1">
                        Giá: <span className="text-red-500 font-semibold">{parseInt(item.price).toLocaleString()} VNĐ</span>
                      </p>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      <p className="text-gray-500 text-sm">Số khách tối đa: {item.max_guests}</p>
                      <p className="text-gray-500 text-sm">Tiện nghi: {item.facilities}</p>
                    </>
                  )}

                  {slug === "book-xe-khach" && (
                    <>
                      <p className="text-lg text-gray-700 mb-1">Loại xe: {item.vehicle_type}</p>
                      <p className="text-lg text-gray-700 mb-1">
                        Giá vé: <span className="text-red-500 font-semibold">{parseInt(item.price).toLocaleString()} VNĐ</span>
                      </p>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      <p className="text-gray-500 text-sm">Biển số: {item.license_plate}</p>
                      <p className="text-gray-500 text-sm">Tình trạng: {item.rental_status}</p>
                    </>
                  )}

                  {slug === "dat-xe-may" && (
                    <>
                      <p className="text-lg text-gray-700 mb-1">Loại xe: {item.bike_type}</p>
                      <p className="text-lg text-gray-700 mb-1">
                        Giá thuê/ngày: <span className="text-red-500 font-semibold">{parseInt(item.price_per_day).toLocaleString()} VNĐ</span>
                      </p>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      <p className="text-gray-500 text-sm">Vị trí: {item.location}</p>
                      <p className="text-gray-500 text-sm">Biển số: {item.license_plate}</p>
                      <p className="text-gray-500 text-sm">Tình trạng: {item.rental_status}</p>
                    </>
                  )}

                  {slug === "thue-huong-dan-vien" && (
                    <>
                      <p className="text-lg text-gray-700 mb-1">Ngôn ngữ: {item.language}</p>
                      <p className="text-lg text-gray-700 mb-1">
                        Giá thuê: <span className="text-red-500 font-semibold">{parseInt(item.price_per_day).toLocaleString()} VNĐ/ngày</span>
                      </p>
                      <p className="text-gray-600 mb-2">Kinh nghiệm: {item.experience_years} năm</p>
                      <p className="text-gray-500 text-sm">SĐT: {item.phone}</p>
                      <p className="text-gray-500 text-sm">Email: {item.email}</p>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
        <div className="text-center relative z-2 h-full w-full flex flex-col justify-center items-center">
          <MotionFade animation="fadeInBottomToTop">
            <h1
              className={`${styles.mainTitle} font-extrabold text-[160px] leading-[1]`}
            >
              Dịch vụ
            </h1>
            <h3
              className={`${styles.subTitle} container m-auto font-bold text-[64px] italic`}
            >
              {service.title}
            </h3>
          </MotionFade>
        </div>
        <ScrollDownIndicator
          idSection="service-detail"
          text="Xem chi tiết"
          className="scroll-down-page"
        />
      </BannerPage>

      <section id="service-detail" className="container m-auto px-4 py-32 max-w-6xl">
        {dataService.length > 0 ? renderServiceCards() : <p>Đang tải dữ liệu...</p>}
      </section>
    </>
  );
}
