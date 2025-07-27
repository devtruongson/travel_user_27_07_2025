import styles from "./style.module.css";
import Image from "next/image"
import ScrollDownIndicator from '@/components/scrollDownIndicator';
import BannerPage from "@/layouts/banner";
import MotionFade from "@/components/motionFade";

const newsData = [
  { id: 1, title: "Tin tức 1: Tiêu đề dài hơn một chút", category: "Kinh doanh", date: "2024-06-26", source: "VNExpress" },
  { id: 2, title: "Tin tức 2", category: "Thời sự", date: "2024-06-25", source: "Tuổi Trẻ" },
  { id: 3, title: "Tin tức 3: Thể thao", category: "Thể thao", date: "2024-06-24", source: "24h" },
  { id: 4, title: "Tin tức 4: Công nghệ", category: "Công nghệ", date: "2024-06-23", source: "Zing" },
];

export default function BlogPage() {
  return (
    <>
      <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
        <div className='text-center pt-60 relative z-2'>
          <MotionFade animation="fadeInBottomToTop">
            <h3 className={`${styles.subTitle} font-[700] text-[120px] italic h-auto mx-auto`}>Blog</h3>
            <h1 className={`${styles.mainTitle} font-[900] text-[180px] leading-[1] h-auto mx-auto`}>VTRAVEL</h1>
          </MotionFade>
        </div>
        <ScrollDownIndicator idSection='blog' text='Xem tất cả Blog' className='scroll-down-page' />
      </BannerPage>
      <section id="blog" className="container pb-40 pt-28">
        <div>
          <div className="w-full mx-auto">
            <div className="grid grid-flow-row-dense grid-cols-2 gap-10">
              <div>
                <h1 className="text-3xl font-extrabold text-black mt-5 mb-3">Điểm nổi bật</h1>
                <Image src="/images/banner2-about.jpg" width={300} height={300} quality={100} alt="Ảnh blog" className="w-full h-[400px] rounded-xl" />
                <p className="inline-flex my-5 px-7 py-1 text-[18px] font-bold bg-gray-200 rounded-[7px] text-blue-500">Mẹo</p>
                <p className="inline-flex m-5 px-7 py-1 text-[18px] font-bold bg-gray-200 rounded-[7px] text-blue-500">Đặt tour</p>
                <h2 className="text-[30px] font-extrabold text-black">18 mẹo tiết kiệm tiền đi du lịch dễ dàng hơn lúc nào hết</h2>
                <p className="py-2 text-[20px] font-normal text-gray-900">Đã bao nhiêu lần bạn ngậm ngùi ở nhà vì lỡ tay xài số tiền dành dụm cho chuyến du lịch trong mơ? Năm 2016 này, đừng lặp lại “bi kịch” cũ nữa mà hãy thử áp dụng 18 mẹo nhỏ do các phượt thủ và blogger du lịch trên khắp thế giới mách nước, đảm bảo bạn sẽ luôn để dành đủ tiền để vi vu từ A đến Z!</p>
                <p className="inline-flex text-[18px] font-normal text-gray-900">23/06/2025</p>
                <p className="inline-flex text-[18px] font-normal text-gray-900 px-6">2000</p>
                <p className="inline-flex text-[18px] font-normal text-gray-900">Văn Hưởng</p>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-black mt-5 mb-3">Mới nhất</h1>
                <div className="grid grid-flow-row-dense grid-cols-2 grid-rows-2 gap-5">
                  <div className="mb-3">
                    <Image src="/images/banner2-about.jpg" width={100} height={100} quality={100} alt="Ảnh blog" className="w-full h-[200px] rounded-xl" />
                    <p className="inline-flex my-3 px-5 text-[18px] font-medium bg-gray-200 rounded-[7px] text-blue-500">Mẹo</p>
                    <p className="inline-flex mx-3 px-5 text-[18px] font-medium bg-gray-200 rounded-[7px] text-blue-500">Đặt tour</p>
                    <h2 className="text-xl font-bold text-black my-1.5">18 mẹo tiết kiệm tiền đi du lịch dễ dàng hơn lúc nào hết</h2>
                    <p className="inline-flex text-[16px] font-normal text-gray-900">23/06/2025</p>
                    <p className="inline-flex text-[16px] font-normal text-gray-900 px-6">2000</p>
                    <p className="inline-flex text-[16px] font-normal text-gray-900">Văn Hưởng</p>
                  </div>
                  <div className="mb-3">
                    <Image src="/images/banner2-about.jpg" width={100} height={100} quality={100} alt="Ảnh blog" className="w-full h-[200px] rounded-xl" />
                    <p className="inline-flex my-3 px-5 text-[18px] font-medium bg-gray-200 rounded-[7px] text-blue-500">Mẹo</p>
                    <p className="inline-flex mx-3 px-5 text-[18px] font-medium bg-gray-200 rounded-[7px] text-blue-500">Đặt tour</p>
                    <h2 className="text-xl font-bold text-black my-1.5">18 mẹo tiết kiệm tiền đi du lịch dễ dàng hơn lúc nào hết</h2>
                    <p className="inline-flex text-[16px] font-normal text-gray-900">23/06/2025</p>
                    <p className="inline-flex text-[16px] font-normal text-gray-900 px-6">2000</p>
                    <p className="inline-flex text-[16px] font-normal text-gray-900">Văn Hưởng</p>
                  </div>
                  <div className="mb-3">
                    <Image src="/images/banner2-about.jpg" width={100} height={100} quality={100} alt="Ảnh blog" className="w-full h-[200px] rounded-xl" />
                    <p className="inline-flex my-3 px-5 text-[18px] font-medium bg-gray-200 rounded-[7px] text-blue-500">Mẹo</p>
                    <p className="inline-flex mx-3 px-5 text-[18px] font-medium bg-gray-200 rounded-[7px] text-blue-500">Đặt tour</p>
                    <h2 className="text-xl font-bold text-black my-1.5">18 mẹo tiết kiệm tiền đi du lịch dễ dàng hơn lúc nào hết</h2>
                    <p className="inline-flex text-[16px] font-normal text-gray-900">23/06/2025</p>
                    <p className="inline-flex text-[16px] font-normal text-gray-900 px-6">2000</p>
                    <p className="inline-flex text-[16px] font-normal text-gray-900">Văn Hưởng</p>
                  </div>
                  <div className="mb-3">
                    <Image src="/images/banner2-about.jpg" width={100} height={100} quality={100} alt="Ảnh blog" className="w-full h-[200px] rounded-xl" />
                    <p className="inline-flex my-3 px-5 text-[18px] font-medium bg-gray-200 rounded-[7px] text-blue-500">Mẹo</p>
                    <p className="inline-flex mx-3 px-5 text-[18px] font-medium bg-gray-200 rounded-[7px] text-blue-500">Đặt tour</p>
                    <h2 className="text-xl font-bold text-black my-1.5">18 mẹo tiết kiệm tiền đi du lịch dễ dàng hơn lúc nào hết</h2>
                    <p className="inline-flex text-[16px] font-normal text-gray-900">23/06/2025</p>
                    <p className="inline-flex text-[16px] font-normal text-gray-900 px-6">2000</p>
                    <p className="inline-flex text-[16px] font-normal text-gray-900">Văn Hưởng</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}
