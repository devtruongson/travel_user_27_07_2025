import styles from "./style.module.css";
import Image from "next/image";
import Counter from "@/components/counter";
import BannerPage from "@/layouts/banner";
import MotionFade from "@/components/motionFade";
export default function AboutPage() {
    return (
        <div>
            <BannerPage classNameSection={`${styles.banner} h-screen w-full`}>
                <div className="container relative z-2 h-full flex items-center pb-20">
                    <MotionFade animation="fadeInBottomToTop">
                        <h3
                            className={`${styles.subTitle} font-[700] text-6xl md:text-8xl lg:text-[120px] italic h-auto `}
                        >
                            About Us
                        </h3>
                        <h1
                            className={`${styles.mainTitle} font-[900] text-8xl md:text-9xl lg:text-[180px] leading-[1] h-auto`}
                        >
                            VTRAVEL
                        </h1>
                    </MotionFade>
                </div>
            </BannerPage>
            <section id="about" className="container">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-shrink-0">
                        <Image
                            src="/images/banner2-about.jpg"
                            width={700}
                            height={400}
                            quality={100}
                            alt="Ảnh banner about us"
                            className="object-cover relative z-2 h-[400px] md:h-[500px] lg:h-[700px] mt-0 lg:mt-[-160px] w-full md:w-[400px] lg:w-[500px] rounded-xl shadow-gray-800 shadow-2xl mx-auto"
                        />
                    </div>
                    <div className="flex-1 pt-4 lg:pt-12">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-500 tracking-wider leading-tight">
                            Hành trình vạn dặm bắt đầu từ một bước chân
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl tracking-wider font-normal leading-relaxed text-gray-700 pt-3">
                            <b>VTravel</b> không chỉ tổ chức những chuyến đi, mà
                            kiến tạo hành trình sống động - nơi mỗi khoảnh khắc
                            đều mang ý nghĩa, mỗi điểm đến là một dấu ấn, và mỗi
                            khách hàng là một người bạn đồng hành trọn vẹn.
                        </p>
                        <div className="w-full h-[1px] bg-gray-500 mx-0 mt-10"></div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-7 mt-8">
                            <div>
                                <div className="w-[80px] lg:w-[120px] h-[6px] bg-orange-500 mt-[-5px] mb-6 lg:mb-10"></div>
                                <b className="text-3xl lg:text-5xl text-orange-500 font-extrabold">
                                    <Counter
                                        targetNumber={100}
                                        duration={2000}
                                    />
                                    +
                                </b>
                                <p className="text-lg lg:text-2xl font-normal text-gray-700 pt-4 lg:pt-10">
                                    Tour đang hoạt động
                                </p>
                            </div>
                            <div>
                                <div className="w-[80px] lg:w-[120px] h-[6px] bg-orange-500 mt-[-5px] mb-6 lg:mb-10"></div>
                                <b className="text-3xl lg:text-5xl text-orange-500 font-extrabold">
                                    <Counter
                                        targetNumber={45000}
                                        duration={2000}
                                    />
                                    +
                                </b>
                                <p className="text-lg lg:text-2xl font-normal text-gray-700 pt-4 lg:pt-10">
                                    Khách hàng đã phục vụ
                                </p>
                            </div>
                            <div>
                                <div className="w-[80px] lg:w-[120px] h-[6px] bg-orange-500 mt-[-5px] mb-6 lg:mb-10"></div>
                                <b className="text-3xl lg:text-5xl text-orange-500 font-extrabold">
                                    <Counter
                                        targetNumber={10}
                                        duration={2000}
                                    />
                                    +
                                </b>
                                <p className="text-lg lg:text-2xl font-normal text-gray-700 pt-4 lg:pt-10">
                                    Năm kinh nghiệm
                                </p>
                            </div>
                            <div>
                                <div className="w-[80px] lg:w-[120px] h-[6px] bg-orange-500 mt-[-5px] mb-6 lg:mb-10"></div>
                                <b className="text-3xl lg:text-5xl text-orange-500 font-extrabold">
                                    <Counter
                                        targetNumber={200}
                                        duration={2000}
                                    />
                                    +
                                </b>
                                <p className="text-lg lg:text-2xl font-normal text-gray-700 pt-4 lg:pt-10">
                                    Nhân viên & Hướng dẫn viên
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 text-center pt-24 pb-5">
                    LEADERSHIP
                </h1>
                <div className="w-36 h-[5px] bg-blue-500 mx-auto rounded-2xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 lg:gap-36 mt-15">
                    <div className="text-center">
                        <Image
                            src="/images/NguyenHung.jpg"
                            width={400}
                            height={400}
                            alt="avata"
                            className="border border-gray-300 rounded-full hover:border-blue-500 mb-6 lg:mb-10 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] object-cover mx-auto"
                        />
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-black">
                            LÊ NGUYÊN HÙNG
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl font-normal text-gray-700 mt-3">
                            Giám đốc điều hành (CEO)
                        </p>
                    </div>
                    <div className="text-center">
                        <Image
                            src="/images/QuocTuan.jpg"
                            width={400}
                            height={400}
                            alt="avata"
                            className="border border-gray-300 rounded-full hover:border-blue-500 mb-6 lg:mb-10 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] object-cover mx-auto"
                        />
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-black">
                            PHAN QUỐC TUẤN
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl font-normal text-gray-700 mt-3">
                            Chức danh: Giám đốc vận hành (COO)
                        </p>
                    </div>
                    <div className="text-center md:col-span-2 lg:col-span-1">
                        <Image
                            src="/images/VanHuong.jpg"
                            width={400}
                            height={400}
                            alt="avata"
                            className="border border-gray-300 rounded-full hover:border-blue-500 mb-6 lg:mb-10 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] object-cover mx-auto"
                        />
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-black">
                            NGUYỄN VĂN HƯỞNG
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl font-normal text-gray-700 mt-3">
                            Chức danh: Giám đốc tài chính (CFO)
                        </p>
                    </div>
                </div>
                <div className="w-full h-[1px] bg-gray-500 my-7"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 lg:gap-28 mb-12">
                    <div className="text-center">
                        <Image
                            src="/images/TranTuan.jpg"
                            width={400}
                            height={400}
                            alt="avata"
                            className="border border-gray-300 rounded-full hover:border-blue-500 mb-6 lg:mb-10 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] object-cover mx-auto"
                        />
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-black">
                            CAO TRẦN TUẤN
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl font-normal text-gray-700 mt-3">
                            Chức danh: Giám đốc kinh doanh & marketing (CMO)
                        </p>
                    </div>
                    <div className="text-center">
                        <Image
                            src="/images/TrongQuan.jpg"
                            width={400}
                            height={400}
                            alt="avata"
                            className="border border-gray-300 rounded-full hover:border-blue-500 mb-6 lg:mb-10 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] object-cover mx-auto"
                        />
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-black">
                            NGUYỄN TRỌNG QUÂN
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl font-normal text-gray-700 mt-3">
                            Chức danh: Giám đốc công nghệ (CTO)
                        </p>
                    </div>
                    <div className="text-center md:col-span-2 lg:col-span-1">
                        <Image
                            src="/svg/social/iconVision_aboutus.png"
                            width={400}
                            height={400}
                            alt="avata"
                            className="border border-gray-300 rounded-full hover:border-blue-500 mb-6 lg:mb-10 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] object-cover mx-auto"
                        />
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-black">
                            PHẠM MINH TRÀ
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl font-normal text-gray-700 mt-3">
                            Chức danh: Trưởng phòng điều hành tour
                        </p>
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 font-extrabold text-center mt-16 mb-3">
                    VTravel Discover Việt Nam
                </h1>
                <div className="w-[200px] md:w-[300px] lg:w-[350px] h-[5px] bg-blue-500 mx-auto rounded-2xl mb-16"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 mb-12">
                    <div className="border border-gray-300 rounded-2xl hover:border-blue-500 pb-7">
                        <Image
                            src="/svg/social/iconVision_aboutus.png"
                            width={100}
                            height={100}
                            alt="icon vision"
                            className="mt-7 ml-7"
                        />
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-900 pt-5 ml-7">
                            Tầm nhìn
                        </h1>
                        <div className="w-40 h-[1px] bg-gray-400 ml-7 mt-2 mb-8"></div>
                        <ul className="text-lg md:text-xl lg:text-2xl tracking-wider font-medium leading-relaxed text-gray-700 mx-7">
                            <li className="mb-4">
                                Chúng tôi hướng đến việc trở thành nền tảng du
                                lịch truyền cảm hứng hàng đầu, nơi mỗi hành
                                trình không chỉ là một chuyến đi mà là một cơ
                                hội để khám phá thế giới, hiểu sâu về bản thân
                                và kết nối với những giá trị văn hóa đích thực.
                            </li>
                            <li>
                                <b className="text-lg md:text-xl lg:text-2xl tracking-wider font-bold leading-relaxed text-gray-900 inline-block">
                                    Chúng tôi tin rằng:
                                </b>{" "}
                                Mỗi bước chân đi qua là một trang ký ức được
                                viết nên - và chúng tôi ở đây để giúp bạn viết
                                những trang đẹp nhất.
                            </li>
                        </ul>
                    </div>
                    <div className="border border-gray-300 rounded-2xl hover:border-blue-500 pb-7">
                        <Image
                            src="/svg/social/iconMission_aboutus.png"
                            width={100}
                            height={100}
                            alt="icon Mission"
                            className="mt-7 ml-7"
                        />
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-900 pt-5 ml-7">
                            Sứ mệnh
                        </h1>
                        <div className="w-40 h-[1px] bg-gray-400 ml-7 mt-2 mb-8"></div>
                        <ul className="text-lg md:text-xl lg:text-2xl tracking-wider font-medium leading-relaxed text-gray-700 mx-7">
                            <li className="mb-3">
                                <b className="text-lg md:text-xl lg:text-2xl tracking-wider font-bold leading-relaxed text-gray-900 inline-block">
                                    Truyền cảm hứng khám phá:
                                </b>{" "}
                                Cung cấp những nội dung du lịch chân thật, hấp
                                dẫn và gợi mở, giúp bạn tìm thấy cảm hứng cho
                                chuyến đi tiếp theo.
                            </li>
                            <li className="mb-3">
                                <b className="text-lg md:text-xl lg:text-2xl tracking-wider font-bold leading-relaxed text-gray-900 inline-block">
                                    Kết nối con người với vùng đất:
                                </b>{" "}
                                Xây dựng cầu nối giữa du khách và địa phương,
                                giữa những tâm hồn khát khao trải nghiệm và
                                những nơi chốn giàu bản sắc.
                            </li>
                            <li className="mb-3">
                                <b className="text-lg md:text-xl lg:text-2xl tracking-wider font-bold leading-relaxed text-gray-900 inline-block">
                                    Hỗ trợ phát triển bền vững:
                                </b>{" "}
                                Đồng hành cùng cộng đồng địa phương trong việc
                                phát triển du lịch có trách nhiệm, thân thiện
                                với môi trường và bảo tồn văn hóa.
                            </li>
                            <li>
                                <b className="text-lg md:text-xl lg:text-2xl tracking-wider font-bold leading-relaxed text-gray-900 inline-block">
                                    Ứng dụng công nghệ:
                                </b>{" "}
                                Tận dụng nền tảng số để đơn giản hóa hành trình
                                du lịch - từ cảm hứng đến trải nghiệm thực tế.
                            </li>
                        </ul>
                    </div>
                    <div className="border border-gray-300 rounded-2xl hover:border-blue-500 pb-7">
                        <Image
                            src="/svg/social/iconValue_aboutus.png"
                            width={100}
                            height={100}
                            alt="icon value"
                            className="mt-7 ml-7"
                        />
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-900 pt-5 ml-7">
                            Giá trị
                        </h1>
                        <div className="w-40 h-[1px] bg-gray-400 ml-7 mt-2 mb-8"></div>
                        <ul className="text-lg md:text-xl lg:text-2xl tracking-wider font-medium leading-relaxed text-gray-700 mx-7">
                            <li className="mb-3">
                                <b className="text-lg md:text-xl lg:text-2xl tracking-wider font-bold leading-relaxed text-gray-900 inline-block">
                                    Chân thật và truyền cảm hứng:
                                </b>{" "}
                                Chúng tôi không chỉ cung cấp thông tin - chúng
                                tôi kể những câu chuyện có thật, đánh thức tình
                                yêu du lịch trong mỗi người.
                            </li>
                            <li className="mb-3">
                                <b className="text-lg md:text-xl lg:text-2xl tracking-wider font-bold leading-relaxed text-gray-900 inline-block">
                                    Lấy người dùng làm trung tâm:
                                </b>{" "}
                                Mỗi sản phẩm, mỗi gợi ý, mỗi hành trình đều bắt
                                nguồn từ việc thấu hiểu mong muốn và trải nghiệm
                                của bạn.
                            </li>
                            <li className="mb-3">
                                <b className="text-lg md:text-xl lg:text-2xl tracking-wider font-bold leading-relaxed text-gray-900 inline-block">
                                    Sáng tạo và đổi mới:
                                </b>{" "}
                                Luôn làm mới cách tiếp cận du lịch để mang đến
                                giá trị khác biệt - không ngừng tìm kiếm những
                                điểm đến chưa được kể và những góc nhìn mới mẻ.
                            </li>
                            <li>
                                <b className="text-lg md:text-xl lg:text-2xl tracking-wider font-bold leading-relaxed text-gray-900 inline-block">
                                    Trách nhiệm và sẻ chia:
                                </b>{" "}
                                Du lịch không chỉ là tận hưởng mà còn là đóng
                                góp. Chúng tôi cam kết lan tỏa tinh thần du lịch
                                xanh, công bằng và nhân văn.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <div className="w-full h-auto tracking-wider bg-gradient-to-b from-blue-100 to-gray-50 p-4 md:p-8 rounded-t-[35%]">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 text-center pt-8 md:pt-12 pb-5">
                    VTravel luôn sẵn sàng đồng hành & cam kết
                </h1>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
                    <div className="bg-gradient-to-b via-white pb-10 rounded-lg">
                        <Image
                            src="/svg/social/cup.png"
                            width={200}
                            height={200}
                            alt="icon value"
                            className="my-5 mx-auto w-[120px] md:w-[150px] lg:w-[200px] h-[120px] md:h-[150px] lg:h-[200px]"
                        />
                        <p className="text-lg md:text-xl lg:text-2xl tracking-wider font-medium leading-relaxed text-gray-700 mx-7">
                            <b className="text-lg md:text-xl lg:text-2xl tracking-wider font-bold leading-relaxed text-gray-900 block mb-3 md:mb-5">
                                Cam kết về chất lượng dịch vụ
                            </b>
                            Chúng tôi đặt sự hài lòng của khách hàng là ưu tiên
                            hàng đầu. Mỗi hành trình đều được tổ chức với sự
                            chỉn chu, từ lựa chọn điểm đến đến từng dịch vụ nhỏ
                            nhất - để bạn luôn an tâm và tận hưởng trọn vẹn.
                        </p>
                    </div>
                    <div className="bg-gradient-to-b via-white pb-10 rounded-lg">
                        <Image
                            src="/svg/social/cup.png"
                            width={200}
                            height={200}
                            alt="icon value"
                            className="my-5 mx-auto w-[120px] md:w-[150px] lg:w-[200px] h-[120px] md:h-[150px] lg:h-[200px]"
                        />
                        <p className="text-lg md:text-xl lg:text-2xl tracking-wider font-medium leading-relaxed text-gray-700 mx-7">
                            <b className="text-lg md:text-xl lg:text-2xl tracking-wider font-bold leading-relaxed text-gray-900 block mb-3 md:mb-5">
                                Đồng hành như một người bạn đường
                            </b>
                            Không chỉ đơn thuần là đơn vị tổ chức tour, chúng
                            tôi là người bạn đồng hành tin cậy trên mọi nẻo
                            đường - sẵn sàng hỗ trợ, lắng nghe và chia sẻ để mỗi
                            chuyến đi đều trở nên ý nghĩa và đáng nhớ.
                        </p>
                    </div>
                    <div className="bg-gradient-to-b via-white pb-10 rounded-lg">
                        <Image
                            src="/svg/social/cup.png"
                            width={200}
                            height={200}
                            alt="icon value"
                            className="my-5 mx-auto w-[120px] md:w-[150px] lg:w-[200px] h-[120px] md:h-[150px] lg:h-[200px]"
                        />
                        <p className="text-lg md:text-xl lg:text-2xl tracking-wider font-medium leading-relaxed text-gray-700 mx-7">
                            <b className="text-lg md:text-xl lg:text-2xl tracking-wider font-bold leading-relaxed text-gray-900 block mb-3 md:mb-5">
                                {" "}
                                Phản hồi nhanh - Hỗ trợ tận tâm
                            </b>
                            Bất cứ khi nào bạn cần, chúng tôi luôn có mặt. Đội
                            ngũ chăm sóc khách hàng chuyên nghiệp, thân thiện
                            sẵn sàng giải đáp và hỗ trợ bạn trước, trong và sau
                            mỗi hành trình.
                        </p>
                    </div>
                    <div className="bg-gradient-to-b via-white pb-10 rounded-lg">
                        <Image
                            src="/svg/social/cup.png"
                            width={200}
                            height={200}
                            alt="icon value"
                            className="my-5 mx-auto w-[120px] md:w-[150px] lg:w-[200px] h-[120px] md:h-[150px] lg:h-[200px]"
                        />
                        <p className="text-lg md:text-xl lg:text-2xl tracking-wider font-medium leading-relaxed text-gray-700 mx-7">
                            <b className="text-lg md:text-xl lg:text-2xl tracking-wider font-bold leading-relaxed text-gray-900 block mb-3 md:mb-5">
                                Lắng nghe để hoàn thiện
                            </b>
                            Chúng tôi coi ý kiến của bạn là động lực phát triển.
                            Mỗi phản hồi đều được ghi nhận và cải thiện, để
                            không ngừng nâng cao trải nghiệm và xây dựng một
                            dịch vụ du lịch ngày càng tốt hơn.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
