import styles from './style.module.css';
import OverlayBanner from './overlayBanner';
import TitleBanner from './titleBanner';
import ContentBanner from './contentBanner';
import ScrollAnimation from './scrollAnimation';
import ScrollBlocker from '@/components/scrollBlocker';

export default function Banner() {

  return (
    <>
      {/* <ScrollBlocker /> */}
      <ScrollAnimation >
        <section className={styles.banner}>
          <div className={styles.wrapper}>
            <iframe
              src="https://intro-vtravel.pages.dev/"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay"
              loading="eager"
              className={styles.iframe}
            ></iframe>
          </div>
          {/* <TitleBanner title='KHÁM PHÁ VIỆT NAM' /> */}
          <ContentBanner />
          {/* <OverlayBanner /> */}
        </section>
      </ScrollAnimation>
      <div className={`${styles.spacing}`}></div>
    </>
  );
}
