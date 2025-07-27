import Link from "next/link";
import Image from "next/image";
import { IoMdAirplane } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import "./style.css";
import CustomButton from "../customButton";

interface IProps {
  href?: string;
  imgUrl?: string;
  nameTour?: string;
  nameDestination?: string;
  originalPrice?: number,
  promotionPrice?: number,
  time?: string,
  startAddress?: string,
  rating?: number,
  category?: string;
  clasName?: string;
  bottomClassName?: string;
  startAddressHidden?: boolean;
  isDestination?: boolean;
  descDestination?: string;
  btnCard?: string;
  area?: string;
}

export default function TourCard(props: IProps) {
  const { nameTour = "", originalPrice = 0, promotionPrice, time, startAddress, rating = 0, href = "/", imgUrl = "", category = "", clasName = "", bottomClassName = "", startAddressHidden = false, isDestination = false, descDestination = "", nameDestination = "", btnCard = "Khám phá" } = props;

  function formatCurrency(value?: number) {
    return value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  return (
    <div className={`group ${clasName ?? ""} main-card rounded-[20px] overflow-hidden relative transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl`}>
      <Link href={href}>
        <Image src={imgUrl} alt={nameTour} width={600} height={1000} quality={100} className="w-full h-full object-cover object-center transform transition-transform duration-500 ease-in-out will-change-transform delay-75 group-hover:scale-105" />
        <div className="absolute z-1 left-0 right-0 bottom-0 py-5 px-5 text-[#fff]" >
          {
            (!isDestination) && (
              <div className="flex flex-col gap-3 text-[#ffd220] uppercase text-[0.95rem] font-extrabold mb-2">
                <div className={`${startAddressHidden ? "hidden" : "flex"} items-center gap-2`}>
                  <div className="w-[23px] h-[23px] rounded-[50%] flex items-center justify-center bg-[#13c4fa81]"><IoMdAirplane size={18} /></div>
                  <div className="flex items-center gap-1">
                    <span>Xuất phát:</span>
                    <span>{startAddress}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-[23px] h-[23px] rounded-[50%] flex items-center justify-center bg-[#13c4fa81]"><MdAccessTime size={18} /></div>
                  <span>{time}</span>
                </div>
              </div>
            )
          }
          {
            isDestination ?
              <div>
                <div className="name-card font-extrabold text-[24px] mb-3 leading-[1.1]"><h3>{nameDestination}</h3></div>
                <p className="text-[1.1rem] mt-2 text-gray-300 mb-4" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>{descDestination}</p>
              </div>
              : <div className="font-extrabold text-[24px] mb-3 leading-[1.1] name-card"><h3>{nameTour}</h3></div>
          }
          <div className={`${bottomClassName ?? ""} flex gap-8`}>
            {
              !isDestination && (
                promotionPrice != undefined && promotionPrice > 0 && promotionPrice < originalPrice ? (
                  <div>
                    <p className="text-[#ffd220] text-[1.75rem] font-bold leading-[1.2]">{formatCurrency(promotionPrice)}</p>
                    <p className="font-medium line-through text-[1.25rem]">{formatCurrency(originalPrice)}</p>
                  </div>
                ) : (
                  <p className="text-[#ffd220] text-[1.75rem] font-bold leading-[1.2]">{formatCurrency(originalPrice)}</p>
                )
              )
            }
            <div className="flex-1">
              <CustomButton className="tour-learn-more">
                <span className="tour-circle" aria-hidden="true">
                  <span className="tour-icon tour-arrow"></span>
                </span>
                <span className="tour-button-text">{btnCard}</span>
              </CustomButton>
            </div>
          </div>
        </div>
        <div className="absolute z-0 left-0 right-0 bottom-0 h-[70%] bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div className="absolute top-5 right-5 flex flex-col gap-3">
          {Array.from({ length: Math.ceil(rating) }, (_, i) => (
            <FaStar key={i} className="text-yellow-400 text-[1rem]" />
          ))}
        </div>
      </Link >
    </div >
  )
}
