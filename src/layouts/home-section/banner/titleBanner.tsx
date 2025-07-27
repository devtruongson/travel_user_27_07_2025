'use client';

import { useState, useEffect } from 'react';

type TProps = {
  title?: string;
}

export default function TitleBanner({ title = 'DISCOVER VIETNAM' }: TProps) {
  const [displayText, setDisplayText] = useState<string>('');
  const [fadeOut, setFadeOut] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    if (!title) return;
    let index = 0;
    const typingInterval = setInterval(() => {
      index++;
      if (index <= title.length) {
        setDisplayText(title.substring(0, index));
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setFadeOut(true), 1000);
        setTimeout(() => setHidden(true), 2000);
      }
    }, 2000 / title.length);
    return () => clearInterval(typingInterval);
  }, [title]);

  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 flex justify-center items-center ' style={{ display: hidden ? 'none' : 'flex', }}>
      <h1
        className='uppercase text-[#fff] font-[900] text-center text-[100px]'
        style={{
          opacity: fadeOut ? 0 : 1,
          transition: 'opacity 1s ease-out',
          whiteSpace: 'pre',
        }}
      >
        {displayText}
      </h1>
    </div>
  );
}
