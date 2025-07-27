import styles from "./styles.module.css";
import Image from "next/image";

type TProps = {
  children?: React.ReactNode;
  classNameSection?: string;
  style?: React.CSSProperties;
}

export default function BannerPage({ children, classNameSection, style }: TProps) {
  return (
    <section className={`${styles.banner} ${classNameSection ?? ""} relative`} style={style}>
      {children}
      <div className="absolute left-0 right-0 bottom-0 z-1 ">
        <Image src="/images/may.png" alt="may" width={1000} height={200} className="w-full h-auto object-cover" />
      </div>
    </section>
  )
}
