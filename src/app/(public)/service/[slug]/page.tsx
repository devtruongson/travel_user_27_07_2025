// app/services/[slug]/page.tsx
import MotionFade from "@/components/motionFade";
import ScrollDownIndicator from "@/components/scrollDownIndicator";
import BannerPage from "@/layouts/banner";
import styles from "./style.module.css";
import serviceData from "@/data/service.json";
import Image from "next/image";
import { PUBLIC_API } from "@/lib/api";
import { log } from "console";
import TourGuideCarousel from "@/components/tourGuideCarousel";

const getGuide = async () => {
  try {
    const res = await PUBLIC_API.get("/guides");
    return res?.data || [];
  } catch (error) {
    return null;
  }
};

export default async function ServiceDetail({ params }: { params: { slug: string } }) {
  const service = serviceData.find((item) => item.slug === params.slug);
  const guides = await getGuide();
  console.log(guides);

  if (!service) {
    return (
      <div className="text-center py-20 text-red-500 font-bold text-xl">
        Không tìm thấy dịch vụ!
      </div>
    );
  }

  return (
    <>
      <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
        <div className="text-center pt-60 relative z-2">
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
        <ScrollDownIndicator idSection="service-detail" text="Xem chi tiết" className="scroll-down-page" />
      </BannerPage>

      <section id="service-detail" className="container m-auto px-4 py-16 max-w-5xl">
        <MotionFade animation="fadeIn">
          <div className="flex flex-col gap-8">
            <Image
              src={service.ImgUrl}
              alt={service.title}
              width={1000}
              height={600}
              className="w-full h-auto rounded-2xl shadow-lg object-cover"
            />
            <h2 className="text-4xl font-bold">{service.title}</h2>
            <p className="text-xl text-gray-600 italic">{service.description}</p>
            <div className="text-base leading-8 text-justify whitespace-pre-line">
              {service.content}
            </div>
            <div className="sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
              <div className="text-lg font-semibold">
                Giá chỉ từ:{" "}
                <span className="text-red-500">
                  {service.price.toLocaleString()}đ / {service.unit}
                </span>
              </div>
            </div>
            <div className="mt-4 text-yellow-500 font-semibold">
              Đánh giá: {service.rating} ★
            </div>
            {(service.slug === "thue-huong-dan-vien") && (
              <div className="pt-10 pb-28 mb-20">
                <TourGuideCarousel guides={guides} />
              </div>
            )}
          </div>
        </MotionFade>
      </section>
    </>
  );
}
