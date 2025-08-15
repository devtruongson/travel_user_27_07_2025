"use client";

import { motion } from "framer-motion";
// import { CiSearch } from "react-icons/ci";
// import CustomInput from "@/components/customInput";
// import CustomButton from "@/components/customButton";
import ScrollDownIndicator from "@/components/scrollDownIndicator";

export default function ContentBanner() {
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-3 flex flex-col justify-center items-center">
            <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2, duration: 1.2, ease: "easeOut" }}
            >
                <div className="text-center">
                    <h1 className="font-[900] text-[130px] uppercase text-[#ffffffec] leading-[1]">
                        VTRAVEL
                    </h1>
                    <h3 className="text-[50px] font-extrabold text-[#ffeb3b]">
                        Hành trình đáng nhớ bắt đầu
                    </h3>
                </div>
                {/* <div className="bg-[#ffffff] rounded-[30px] py-2 px-2 flex items-center gap-2 w-[800px] mt-10">
          <CiSearch size={25} className="ml-4" />
          <CustomInput placeholder="Tour Vịnh Hạ Long được yêu thích" className="flex-1 mb-0" disableFocusRing />
          <CustomButton className="bg-[#7775de] hover:bg-[#5756a3] py-6 px-5 rounded-[30px] text-[#fff] font-bold cursor-pointer">Tìm kiếm</CustomButton>
        </div> */}
                <ScrollDownIndicator
                    idSection="intro"
                    className="absolute bottom-[-100px] left-[50%] transform translate-x-[-50%] translate-y-[100%]"
                />
            </motion.div>
        </div>
    );
}
