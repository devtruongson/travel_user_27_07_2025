'use client';

import { motion } from 'framer-motion';

export default function OverlayBanner() {
  return (
    <div className="fixed w-full h-screen top-0 left-0 z-5 pointer-events-none flex overflow-hidden">
      <motion.div
        initial={{
          x: 0,
          boxShadow: 'none',
        }}
        animate={{
          x: '-110%',
          boxShadow: 'inset -10px 0 15px rgba(0,0,0,0.5)',
        }}
        transition={{ delay: 3, duration: 2, ease: 'easeInOut' }}
        style={{
          backgroundImage: 'url(/images/thumnail_banner.png)',
          backgroundSize: '200% 100%',
          backgroundPosition: 'left center',
          width: '50vw',
          height: '100vh',
          transformOrigin: 'right center',
          perspective: '1000px',
        }}
      />
      <motion.div
        initial={{
          x: 0,
          boxShadow: 'none',
        }}
        animate={{
          x: '110%',
          boxShadow: 'inset 10px 0 15px rgba(0,0,0,0.5)',
        }}
        transition={{ delay: 3, duration: 2, ease: 'easeInOut' }}
        style={{
          backgroundImage: 'url(/images/thumnail_banner.png)',
          backgroundSize: '200% 100%',
          backgroundPosition: 'right center',
          width: '50vw',
          height: '100vh',
          transformOrigin: 'left center',
          perspective: '1000px',
        }}
      />
    </div>
  );
}
