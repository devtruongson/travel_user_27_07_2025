'use client';

import { useEffect } from 'react';

export default function ScrollBlocker() {
  useEffect(() => {
    document.body.style.overflowY = 'hidden';
    const timer = setTimeout(() => {
      document.body.style.overflow = 'auto';
    }, 5000);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return null;
}
