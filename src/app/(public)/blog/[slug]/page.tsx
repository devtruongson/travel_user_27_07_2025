import MotionFade from "@/components/motionFade";
import ScrollDownIndicator from "@/components/scrollDownIndicator";
import BannerPage from "@/layouts/banner";
import styles from "./style.module.css";
import blogData from "@/data/travel_guide.json";

export default function BlogDetail({ params }: { params: { slug: string } }) {
  const blog = blogData.find((item) => item.slug === params.slug);

  if (!blog) {
    return (
      <div className="text-center py-20 text-red-500">
        Không tìm thấy bài viết!
      </div>
    );
  }
  return (
    <>
      <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
        <div className='text-center pt-60 relative z-2'>
          <MotionFade animation="fadeInBottomToTop">
            <h3 className={`${styles.subTitle} container m-auto font-[700] text-[120px] italic h-auto mx-auto`}>{blog.title}</h3>
          </MotionFade>
        </div>
        <ScrollDownIndicator idSection='blog-detail' text='Xem chi tiết' className='scroll-down-page' />
      </BannerPage>
      <section id="blog-detail container m-auto">
        <img src={blog.imgUrl} alt={blog.title} className="w-full rounded-lg shadow-md mb-8" />
        <p className="text-lg font-semibold mb-2 text-gray-700">{blog.address}</p>
        <p className="text-base leading-7 text-gray-800 whitespace-pre-line">{blog.content}</p>
      </section>
    </>)
}
