import styles from "./style.module.css";
import Image from "next/image";
import FEEDBACKDATA from "@/data/feedback.json";
import FeedBackCard from "./feedbackCard";

export default function FeedBack() {
  return (
    <section className={`${styles.feedback} py-28 relative z-10 feedback-section border-tl-[20px] overflow-hidden`}>
      <h2 className="text-center font-bold relative z-1 uppercase text-7xl text-[#fff]">Trải nghiệm khó quên</h2>
      <div className="container m-auto relative z-1  flex justify-center my-10 pb-20">
        <div className="relative">
          <Image src="/images/vietnam_map.png" alt="Viet Nam map" width={300} height={1000} className="w-[500px] h-auto" />
          <FeedBackCard data={FEEDBACKDATA[0]} className="absolute top-0 right-0 transform translate-x-[50%]" />
          <FeedBackCard data={FEEDBACKDATA[1]} className="absolute left-0 top-[50%] transform translate-y-[-50%] translate-x-[-50%]" />
          <FeedBackCard data={FEEDBACKDATA[2]} className="absolute left-0 bottom-0 transform translate-y-[100%] translate-x-[50%]" />
        </div>
      </div>
      <div className={`${styles.overlay} absolute z-0 bottom-0 left-0 right-0 h-full`}></div>
    </section >
  )
}
