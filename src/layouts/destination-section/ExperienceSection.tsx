import MotionFade from '@/components/motionFade';

type TProps = {
  id?: string;
  description: string;
}

export default function ExperienceSection(
  { data }: { data: TProps; }
) {
  return (
    <div className="container m-auto text-center py-20">
      <h2 className="text-[55px] font-bold">Trải nghiệm</h2>
      <MotionFade animation="fadeInBottomToTop" scroll>
        <p className="w-[1000px] m-auto text-gray-700 leading-relaxed text-[19px] mt-3">{data.description}</p>
      </MotionFade>
    </div>
  )
}
