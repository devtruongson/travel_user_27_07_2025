import { notFound } from 'next/navigation';
import styles from "./style.module.css";
import BannerPage from '@/layouts/banner';
import MotionFade from '@/components/motionFade';
import ScrollDownIndicator from '@/components/scrollDownIndicator';
import ContentSection from '@/layouts/content-section';
import IntroSection from '@/layouts/destination-section/IntroSection';
import ExperienceSection from '@/layouts/destination-section/ExperienceSection';
import GallerySection from '@/layouts/destination-section/GallerySection';
import HighlightSection from '@/layouts/destination-section/HighlightSection';
import DelicaciesSection from '@/layouts/destination-section/DelicaciesSection';
import EndingImage from '@/layouts/destination-section/EndingImage';
import RelatedSection from '@/layouts/destination-section/RelatedSection';
import TourCarousel from '@/components/tourCarousel';
import { PUBLIC_API } from '@/lib/api';
import TUORDATA from '@/data/tours_miennam.json';

type Section =
  | { type: "intro"; title: string; content: string }
  | { type: "highlight"; content: { title: string; description: string }[] }
  | { type: "experience"; description: string }
  | { type: "gallery"; content: string[] }
  | { type: "regionalDelicacies"; content: { intro: string; dishes: { name: string; image: string }[]; }; }
  | { type: "lastImage"; image: string };

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const res = await PUBLIC_API.get(`/destinations/slug/${params.slug}`);
    const destination = res.data;

    return {
      title: `${destination.name} - VTravel`,
      description: destination.description,
    };
  } catch {
    return {};
  }
}

export default async function DestinationDetailPage({ params }: { params: { slug: string } }) {
  try {
    const res = await PUBLIC_API.get(`/destinations/slug/${params.slug}`);
    const destination = res.data;

    const sections = destination.sections as Section[];

    const sectionMap = Object.fromEntries(sections.map((s) => [s.type, s]));

    const getSection = (type: string) =>
      sections.find((section) => section.type === type);


    return (
      <>
        <BannerPage
          classNameSection={`${styles.banner} h-screen w-full`}
          style={{
            backgroundImage: `url(${destination.img_banner_url})`,
          }}
        >
          <div className='flex items-center container m-auto justify-center absolute top-0 left-0 right-0 bottom-0 z-2 text-center'>
            <MotionFade animation="fadeInBottomToTop" className='w-full'>
              <h1 className={`${styles.mainTitle} font-[900] text-[160px]`}>{destination.name}</h1>
              <h3 className={`${styles.subTitle} font-[700] text-[100px]`}>Việt Nam</h3>
            </MotionFade>
          </div>
          <ScrollDownIndicator idSection='intro' text='Xem chi tiết' className='scroll-down-page' />
        </BannerPage>

        <ContentSection id="intro">
          {/* INTRO */}
          {(() => {
            const section = getSection("intro") as { type: "intro"; title: string; content: string } | undefined;
            return (
              section && (
                <IntroSection
                  data={{
                    title: section.title,
                    imgIntro: destination.img_banner_url,
                    description: section.content,
                  }}
                  nameDestination={destination.name}
                />
              )
            );
          })()}

          {/* HIGHLIGHT */}
          {(() => {
            const section = getSection("highlight") as { type: "highlight"; content: { title: string; description: string }[] } | undefined;
            return section && <HighlightSection data={section.content} />;
          })()}

          {/* EXPERIENCE */}
          {(() => {
            const section = getSection("experience") as { type: "experience"; description: string } | undefined;
            return section && <ExperienceSection data={section} />;
          })()}

          {/* GALLERY */}
          {(() => {
            const section = getSection("gallery") as { type: "gallery"; content: string[] } | undefined;
            return section && <GallerySection images={section.content} />;
          })()}

          {/* REGIONAL DELICACIES */}
          {(() => {
            const section = getSection("regionalDelicacies") as {
              type: "regionalDelicacies";
              content: {
                intro: string;
                dishes: { name: string; image: string }[];
              };
            } | undefined;
            return section && <DelicaciesSection data={section.content} />;
          })()}

          {/* LAST IMAGE */}
          {(() => {
            const section = getSection("lastImage") as { type: "lastImage"; image: string } | undefined;
            return section && <EndingImage image={encodeURI(section.image)} />;
          })()}
          <RelatedSection />

          <div className='container m-auto mt-20'>
            <h2 className="text-4xl font-bold text-[#005089] text-center mb-14">
              Khám phá thêm nhiều điểm đến thú vị
            </h2>
            <TourCarousel tours={TUORDATA} />
          </div>
        </ContentSection>
      </>
    );
  } catch {
    return notFound();
  }
}
