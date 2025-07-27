import React from "react";
import Image from "next/image";
import MotionFade from "@/components/motionFade";
import CustomButton from "@/components/customButton";

interface EndingImageProps {
  image: string;
}

const EndingImage: React.FC<EndingImageProps> = ({ image }) => {
  if (!image) return null;

  return (
    <div
      className="py-16 relative"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "800px",
      }}>
      <div
        className="absolute top-[-20px] left-0 right-0 w-full h-[500px]"
        style={{
          background: "linear-gradient(rgb(255, 255, 255) 32.41%, rgba(255, 255, 255, 0) 98.98%)",
        }}>
      </div>
      <Image src="/images/ft-img.png" alt="f-img" width={500} height={200} quality={100} className="absolute bottom-0 left-0 right-0 w-full h-auto" />
      <div className="text-center relative z-2 container m-auto">
        <MotionFade animation="fadeInBottomToTop" scroll>
          <h3 className="text-6xl text-[#005089] mb-10">
            VTravel mang đến những trải nghiệm tuyệt vời nhất cho bạn
          </h3>
          <p className="font-bold mb-3">Theo dõi VTravel trên Facebook</p>
        </MotionFade>
        <MotionFade animation="fadeInBottomToTop" delay={0.5} scroll>
          <CustomButton
            className="cursor-pointer bg-[#0a4ebb] text-[#fff] rounded-4xl w-[200px] h-[60px] text-2xl inline-block"
          >
            Đặt ngay
          </CustomButton>
        </MotionFade>
      </div>
    </div>
  );
};

export default EndingImage;
