import React from "react";
import MotionFade from "@/components/motionFade";
import { Card, CardContent } from "@/components/ui/card";
import * as icons from "lucide-react";

export type HighlightItem = {
  title: string;
  description: string;
};

interface HighlightSectionProps {
  data: HighlightItem[];
}

const ICON_NAMES = [
  "Mountain", "Sun", "TreePalm", "Plane", "Ship", "Compass", "Camera", "Map"
] as const;

type IconName = typeof ICON_NAMES[number];

const getRandomIcon = () => {
  const name = ICON_NAMES[Math.floor(Math.random() * ICON_NAMES.length)];
  return icons[name as IconName] || icons["Compass"];
};

const HighlightSection: React.FC<HighlightSectionProps> = ({ data }) => {
  if (!data?.length) return null;

  return (
    <section id="highlight" className="p-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item, idx) => {
            const Icon = getRandomIcon();

            return (
              <MotionFade
                key={idx}
                animation="fadeInBottomToTop"
                delay={idx * 0.1}
              >
                <Card className="h-full relative hover:translate-y-[-4px] transition-transform duration-300 bg-transparent">
                  <div className="absolute top-[50%] left-[50%] transform translate-y-[-50%] translate-x-[-50%]">
                    <Icon size={120} color="rgba(56, 241, 242, 0.19)" />
                  </div>

                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-bold mb-2 flex-1">
                      {item.title}
                    </h3>
                    <p className="flex-1 text-gray-700 leading-relaxed text-[19px]">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </MotionFade>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HighlightSection;
