
import SERVICEDATA from "@/data/service.json";
import ServiceCarousel from "@/components/serviceCarousel";

export default function Service() {
  return (
    <section className="relative z-10 pb-32 bg-[#ffffff]">
      <div className=" container m-auto" >
        <div className="text-center mb-14">
          <p className="uppercase text-[#636363] font-bold text-[18px] mb-2 ">Dịch vụ nổi bật
          </p>
          <h3 className="uppercase text-[var(--color-primary)] text-4xl font-[900] leading-[1.3]">Khám phá dịch vụ tiện ích cùng VTravel</h3>
          <p className="text-[18px] text-[var(--color-content)] mt-3 w-[800px] m-auto">
            VTravel – Hệ sinh thái du lịch toàn diện, giúp bạn đặt xe, phòng nghỉ, tour trọn gói và hướng dẫn viên dễ dàng. Tiết kiệm thời gian, chi phí và tận hưởng hành trình trọn vẹn!
          </p>
        </div>
        <div>
          <ServiceCarousel services={SERVICEDATA} />
        </div>
      </div >
    </section >
  )
}
