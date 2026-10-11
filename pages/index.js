import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Главная страница</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Брякин Антон Алексеевич</h1>
        <h2 className={styles.group}>Группа: 23ВВИ1</h2>

        <Link href="/content" className={styles.link}>
          Перейти на страницу content
        </Link>

        <Link href="/petto" className={styles.link} style={{ marginTop: "16px" }}>
          Перейти в Petto
        </Link>

		<Link href="/petshops" className={styles.link} style={{ marginTop: "16px" }}>
          Найти зоомагазины
        </Link>

      </main>
    </div>
  );
}