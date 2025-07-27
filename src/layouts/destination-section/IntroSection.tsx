import Image from "next/image";
import MotionFade from '@/components/motionFade';

type TProps = {
  id?: string;
  title: string;
  imgIntro: string;
  description: string;
};

export default function IntroSection({
  data,
  nameDestination
}: {
  data: TProps;
  nameDestination?: string;
}) {
  return (
    <div
      className="container m-auto flex gap-10 items-center"
    >
      <div className="w-1/2">
        <MotionFade animation="fadeInBottomToTop" scroll>
          <p
            style={{ fontFamily: "'Ruthie', cursive" }}
            className="text-[#0090f5] text-[50px] font-medium">Hãy cùng khám phá</p>
        </MotionFade>
        <MotionFade animation="fadeInBottomToTop" scroll delay={0.3}>
          <h2 className="text-[#00a1c5] text-[60px] font-extrabold">{nameDestination}</h2>
          <p className="text-[29px] font-bold">{data.title}</p>
        </MotionFade>
        <MotionFade animation="fadeInBottomToTop" scroll delay={0.6}>
          <p className="text-gray-700 leading-relaxed text-[19px] mt-6">{data.description}</p>
        </MotionFade>
      </div>
      <div className="flex-1 m-auto">
        <Image
          src={data.imgIntro}
          alt={data.title}
          width={500}
          height={500}
          quality={100}
          className="object-cover w-full h-auto"
        />
      </div>
    </div>
  );
}
