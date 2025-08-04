/* eslint-disable @typescript-eslint/no-explicit-any */
import TourGuideCarousel from "@/components/tourGuideCarousel";
// import TOURGUIDEDATA from "@/data/tour_guide.json";
import ButtonGlobal from "@/components/buttonGlobal";
import Image from "next/image";
import styles from "./style.module.css";
import { PUBLIC_API } from "@/lib/api";

const getGuide = async () => {
    try {
        const res = await PUBLIC_API.get("/guides");
        return res?.data || [];
    } catch (error) {
        return null;
    }
};

export default async function Guide() {
    const guides = await getGuide();

    return (
        <section className="relative z-10 pt-32 pb-24 bg-[#ffffff]">
            <div className="container m-auto flex">
                <div className="mb-15 w-1/2">
                    <p className="uppercase text-[#636363] font-bold text-[18px] mb-2 ">
                        Hành trình an tâm, trải nghiệm tuyệt vời
                    </p>
                    <h3 className="uppercase text-[var(--color-primary)] text-4xl font-[900] leading-[1.3]">
                        Đồng hành cùng đội ngũ hướng dẫn viên chuyên nghiệp
                    </h3>
                    <p className="text-[18px] text-[var(--color-content)] mt-7">
                        Với đội ngũ hướng dẫn viên giàu kinh nghiệm và am hiểu
                        văn hoá bản địa, chúng tôi cam kết mang đến cho bạn
                        những chuyến đi an toàn, nhiều trải nghiệm đáng nhớ và
                        những câu chuyện hấp dẫn về đất nước Việt Nam tươi đẹp.
                        Tận hưởng từng khoảnh khắc trong chuyến hành trình của
                        bạn cùng VTravel!
                    </p>
                    <ButtonGlobal text="Xem thêm" className="mt-10" asLink href="/service/thue-huong-dan-vien" />
                </div>
                <div className="w-1/2">
                    <TourGuideCarousel guides={guides} />
                </div>
            </div>
            <div
                className={`${styles.bgCloud} absolute z-1 top-0 left-0 right-0 transform translate-y-[-50%]  h-[200px] `}
            ></div>
            <div
                className={`${styles.cloud} absolute z-2 h-[300px] top-0 transform translate-y-[-50%] left-0 right-0`}
            >
                <div className="relative w-full h-full overflow-hidden">
                    <Image
                        src="/images/cloud-flying-1.png"
                        alt="cloud1"
                        width={200}
                        height={200}
                        className={styles.cloudImage}
                        style={{ animationDuration: "15s", left: "0%" }}
                    />
                    <Image
                        src="/images/animate-cloud-2.png"
                        alt="cloud2"
                        width={200}
                        height={200}
                        className={styles.cloudImage}
                        style={{ animationDuration: "20s", left: "20%" }}
                    />
                    <Image
                        src="/images/animate-cloud-4.png"
                        alt="cloud3"
                        width={200}
                        height={200}
                        className={styles.cloudImage}
                        style={{ animationDuration: "30s", left: "40%" }}
                    />
                    <Image
                        src="/images/cloud-flying-1.png"
                        alt="cloud4"
                        width={200}
                        height={200}
                        className={styles.cloudImage}
                        style={{ animationDuration: "35s", left: "60%" }}
                    />
                    <Image
                        src="/images/animate-cloud-2.png"
                        alt="cloud5"
                        width={200}
                        height={200}
                        className={styles.cloudImage}
                        style={{ animationDuration: "45s", left: "80%" }}
                    />
                    <Image
                        src="/images/animate-cloud-4.png"
                        alt="cloud6"
                        width={200}
                        height={200}
                        className={styles.cloudImage}
                        style={{ animationDuration: "50s", left: "90%" }}
                    />
                </div>
            </div>
        </section>
    );
}
