'use client';

import Head from 'next/head';

type SeoHeadProps = {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
};

export default function SeoHead({
  title = 'VTravel - Du lịch Việt Nam',
  description = 'Khám phá các địa điểm du lịch hấp dẫn trên khắp Việt Nam cùng VTravel. Tìm hiểu về các tour, điểm đến và trải nghiệm độc đáo.',
  keywords = 'tour du lịch, VTravel, điểm đến, trải nghiệm, khám phá, tour Việt Nam',
  image = '/images/og-image.png',
  url = 'https://vtravel.vn',
}: SeoHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="icon" href="/images/logo-title.png" />
    </Head>
  );
}
