import styles from "./style.module.css";
import { MdSupportAgent } from "react-icons/md";
import CustomButton from "@/components/customButton";

export default function BtnBookNow() {
  return (
    <div className="fixed right-[25px] bottom-[230px] z-15">
      <CustomButton className={`${styles.button}`}>
        <span className="font-bold leading-3.5 text-[12px]">Book</span>
        <span className="font-bold leading-3.5 text-[12px]">now</span>
      </CustomButton>
    </div >
  )
}
