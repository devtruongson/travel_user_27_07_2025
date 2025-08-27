"use client";

import { motion } from "framer-motion";
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
                <ScrollDownIndicator
                    idSection="intro"
                    className="absolute bottom-[-100px] left-[50%] transform translate-x-[-50%] translate-y-[100%]"
                />
            </motion.div>
        </div>
    );
}
