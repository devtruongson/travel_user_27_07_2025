import styles from './style.module.css';
import ContentBanner from './contentBanner';
import ScrollAnimation from './scrollAnimation';

export default function Banner() {

  return (
    <>
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
          <ContentBanner />
        </section>
      </ScrollAnimation>
      <div className={`${styles.spacing}`}></div>
    </>
  );
}
