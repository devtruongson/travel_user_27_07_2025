'use client'

import styles from "./style.module.css";
import CustomButton from "../customButton";
import { IoIosArrowUp } from "react-icons/io";

export default function BackToTop() {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return (
    <div className="fixed z-15 bottom-[70px] right-[25px]">
      <CustomButton className={`${styles.button}`} onClick={handleBackToTop}>
        <div className={`${styles.buttonBox}`}>
          <span className={`${styles.buttonElem}`}>
            <IoIosArrowUp size={25} />
          </span>
          <span className={`${styles.buttonElem}`}>
            <IoIosArrowUp size={25} />
          </span>
        </div>
      </CustomButton>
    </div>
  )
}
