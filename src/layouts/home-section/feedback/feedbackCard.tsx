import Image from "next/image"
import { FaStar } from "react-icons/fa";

interface IUser {
  imgUrl?: string;
  name?: string;
  date?: string;
  rating?: number;
  comment?: string;
}

type TProps = {
  data: IUser;
  className?: string;
}

export default function FeedBackCard(props: TProps) {
  const { data, className } = props;
  return (
    <div className={`${className ?? ""} py-3 px-5 rounded-[10px] bg-[#0b5281f0] text-[#fff] w-[330px]`} style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)' }}>
      <div className="flex items-center gap-2 ">
        <Image src={data.imgUrl || "/images/avt-default.jpg"} alt={data.name || "user"} width={100} height={100} className="w-[40px] h-[40px] rounded-[50%] object-center object-cover" />
        <div>
          <h5>{data.name}</h5>
          <p>{data.date}</p>
        </div>
      </div>
      <div className="flex gap-2 my-3">
        {Array.from({ length: Math.ceil(data.rating || 0) }, (_, i) => (
          <FaStar key={i} className="text-[#c50000] text-[1rem]" />
        ))}
      </div>
      <div>
        {data.comment ? <p className="text-[0.95rem]">{data.comment}</p> : <p className="text-[0.95rem]">Chưa có đánh giá</p>}
      </div>
    </div>
  )
}
