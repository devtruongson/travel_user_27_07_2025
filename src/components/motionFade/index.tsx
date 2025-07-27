"use client";

import { motion, Variants } from "framer-motion";

type TProps = {
  children?: React.ReactNode;
  className?: string;
  animation?: keyof typeof animationVariants;
  scroll?: boolean;
  delay?: number; // ✅ thêm delay
};

const animationVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    show: (delay: number = 0) => ({
      opacity: 1,
      transition: { duration: 1, delay },
    }),
  },
  fadeInBottomToTop: {
    hidden: { opacity: 0, y: 70 },
    show: (delay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay },
    }),
  },
  fadeInTopToBottom: {
    hidden: { opacity: 0, y: -70 },
    show: (delay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay },
    }),
  },
  fadeInLeftToRight: {
    hidden: { opacity: 0, x: -70 },
    show: (delay: number = 0) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 1, delay },
    }),
  },
  fadeInRightToLeft: {
    hidden: { opacity: 0, x: 70 },
    show: (delay: number = 0) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 1, delay },
    }),
  },
};

export default function MotionFade({
  children,
  className = "",
  animation = "fadeIn",
  scroll = false,
  delay = 0,
}: TProps) {
  const variants = animationVariants[animation];

  if (!variants) {
    console.warn(`Animation "${animation}" not found.`);
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={variants}
      custom={delay} // ✅ truyền delay vào variants
      initial="hidden"
      animate={scroll ? undefined : "show"}
      whileInView={scroll ? "show" : undefined}
      viewport={scroll ? { once: true, amount: 0.3 } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
