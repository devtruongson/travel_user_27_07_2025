import Image from "next/image";
import ButtonGlobal from "@/components/buttonGlobal";
import TourCarousel from "@/components/tourCarousel";
import styles from "./style.module.css";

type TData = {
  id: number;
  time: string;
  imgUrl: string;
  vehicle: string;
  tourName: string;
}

type TProps = {
  srcMap: string;
  subTitle: string;
  title: string;
  description: string;
  href: string;
  data: TData[];
  isReverse?: boolean;
  wImg?: number;
  hImg?: number;
  classNameImg?: string;
  nameListTour?: string;
}

export default function RegionTourLayout(props: TProps) {
  const { srcMap, subTitle, title, description, href, data, isReverse = false, wImg = 500, hImg = 500, classNameImg, nameListTour } = props;
  return (
    <div>
      <div className={`flex gap-10 ${isReverse ? "flex-row-reverse" : ""}`}>
        <div className="w-1/2 px-5 flex items-center justify-center relative">
          <Image src={srcMap} alt={title} width={wImg} height={hImg} quality={100} className={classNameImg} />
          <div className={`${styles.effect}`}></div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div>
            <h4 className="uppercase text-[#636363] font-bold text-[18px] mb-2 ">{subTitle}</h4>
            <h2 className="text-[var(--color-primary)] text-4xl font-[900] leading-[1.3]">{title}</h2>
          </div>
          <p className="text-[var(--color-content)] font-[500] text-[17px] mt-6">
            {description}
          </p>
          <div className="mt-15">
            <ButtonGlobal text="Khám phá ngay" asLink href={href} />
          </div>
        </div>
      </div>
      <div className="mt-15">
        <p className="uppercase font-extrabold text-[#686868] mb-2">{nameListTour}</p>
        <TourCarousel tours={data} />
      </div>
    </div>
  )
}
