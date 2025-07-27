"use client"

import React, { useEffect, useState } from "react";
import MotionFade from "@/components/motionFade";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export type Dish = {
  name: string;
  image: string;
};

export interface DelicaciesData {
  intro: string;
  dishes: Dish[];
}

interface DelicaciesSectionProps {
  data: DelicaciesData;
}

const DelicaciesSection: React.FC<DelicaciesSectionProps> = ({ data }) => {
  const { intro, dishes } = data;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!dishes?.length) return;
    const timer = setInterval(() => {
      setCurrent((idx) => (idx + 1) % dishes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [dishes]);

  if (!dishes?.length) return null;

  return (
    <section id="delicacies" className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-center">

          <div className="w-full lg:w-1/2">
            <MotionFade animation="fadeInLeft" className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-10">
                Món ngon vùng miền
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {intro}
              </p>
            </MotionFade>
          </div>

          <div className="w-full lg:w-1/2 relative h-[320px] sm:h-[400px]">
            <AnimatePresence>
              {dishes.map((dish, idx) =>
                idx === current ? (
                  <motion.div
                    key={dish.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  >
                    <div className="relative w-full h-full mb-4 shadow-lg rounded-2xl overflow-hidden">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        sizes="100%"
                        className="object-cover"
                      />
                    </div>
                    <Card className="border-0 shadow-none bg-transparent">
                      <CardContent className="border-0">
                        <h3 className="text-xl font-semibold">{dish.name}</h3>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DelicaciesSection;
