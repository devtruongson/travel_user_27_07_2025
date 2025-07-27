import styles from "./style.module.css";
import { PaperAirplaneIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import Image from "next/image";
import ButtonGlobal from "@/components/buttonGlobal";
import GuideCard from "@/components/travelGuideCard";
import GUIDEDATA from "@/data/travel_guide.json";
import Marquee from "react-fast-marquee";

export default function TravelStory() {

  return (
    <>
      <section className={`${styles.intro} pt-28 pb-96 text-[#fff]`}>
        <div className="container relative z-10 m-auto flex gap-10">
          <div className={`${styles.left} w-1/2`}>
            <div className="w-full h-full px-5 rounded-[10px] overflow-hidden" data-aos="flip-left">
              <Image src="/images/intro-image.webp" alt="Intro VTravel" width={800} height={1000} quality={100} className="rounded-[15px]" />
            </div>
          </div>
          <div className="w-1/2" data-aos="fade-up">
            <div className="mb-5">
              <h5 className="sub-title">Cùng bạn viết nên câu chuyện du lịch đáng nhớ</h5>
              <h2 className="main-title">Việt Nam - Điểm đến của mọi trải nghiệm</h2>
            </div>
            <span className="desc mb-10 inline-block ">
              Hãy để chúng tôi đồng hành cùng bạn, từ những chuyến phiêu lưu lý thú đến những khoảnh khắc thư giãn yên bình. Cùng nhau, chúng ta sẽ viết nên những kỷ niệm khó quên trong chuyến hành trình khám phá vẻ đẹp Việt Nam.
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
                  <span>Khám phá những hành trình đặc biệt, tận hưởng dịch vụ đẳng cấp và trải nghiệm Việt Nam theo cách riêng của bạn.</span>
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
                  <span>Khám phá những hành trình đặc biệt, tận hưởng dịch vụ đẳng cấp và trải nghiệm Việt Nam theo cách riêng của bạn.</span>
                </div>
              </li>
            </ul>
            <ButtonGlobal text="Xem thêm" className="mt-10" />
          </div>
        </div>
        <div className="py-36 absolute z-10 bottom-0 left-0 right-0 transform translate-y-[50%]">
          <div className="container m-auto mb-10">
            <p className="uppercase text-[#bfbfbf] font-bold text-[18px] mb-2 ">kiến thức hữu ích cho bạn
            </p>
            <h3 className="text-[var(--color-primary)] text-6xl font-[900] leading-[1.3]">Cẩm Nang Lu lịch</h3>
          </div>
          <div>
            <Marquee
              gradient={false}
              speed={100}
              pauseOnHover={true}
              pauseOnClick={true}
              delay={0}
              play={true}
              direction="left"
              className="cursor-pointer" >
              {GUIDEDATA.map((guide, index) => (
                <div className="mx-2 sm:mx-4" key={index}>
                  <GuideCard address={guide.address} imgUrl={guide.imgUrl} title={guide.title} excerpt={guide.excerpt} />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section >
      <div className="h-[400px] relative z-9"></div>
    </>
  )

}