'use client';

import { SlArrowDown } from "react-icons/sl";

type TProps = {
  className?: string;
  text?: string;
  idSection: string;
}

export default function ScrollDownIndicator({ className, text, idSection }: TProps) {
  const handleClick = () => {
    const section = document.getElementById(idSection ?? "/");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`${className ?? ""} cursor-pointer flex flex-col items-center`} onClick={handleClick}>
      <div className="relative h-[40px]">
        <SlArrowDown
          size={23}
          color="#ffffffb8"
          className="absolute top-0 left-[50%] transform translate-x-[-50%] animate-bounce"
        />
        <SlArrowDown
          size={23}
          color="#fff"
          className="absolute top-[12px] left-[50%] transform translate-x-[-50%] animate-bounce"
        />
      </div>
      <span className="text-[#fff] uppercase font-bold">{text ?? "Khám phá"}</span>
    </div>
  )
}
