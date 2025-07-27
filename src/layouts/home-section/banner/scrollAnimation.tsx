'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ScrollAnimation({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll();
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);
    }
  }, []);

  const opacity = useTransform(scrollY, [0, windowHeight || 1], [1, 0]);
  const translateY = useTransform(scrollY, [0, windowHeight || 1], [0, -100]);

  return (
    <motion.div
      style={{
        opacity,
        translateY,
        position: 'fixed',
        width: '100%',
        height: '100vh',
        zIndex: 9
      }}
    >
      {children}
    </motion.div>
  );
}
