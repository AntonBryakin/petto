import Head from "next/head";
import Link from "next/link";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import styles from "../styles/Content.module.css";

export default function Content() {
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Content — Слайдер</title>
      </Head>

      <Link href="/" className={styles.back}>
        ← На главную
      </Link>

      <h1 className={styles.title}>Слайдер изображений</h1>

      <div className={styles.sliderContainer}>
        <AwesomeSlider>
          <div data-src="/images/img1.jpeg" />
          <div data-src="/images/img2.jpeg" />
          <div data-src="/images/img3.jpeg" />
        </AwesomeSlider>
      </div>
    </div>
  );
}