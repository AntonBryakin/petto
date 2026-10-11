import React from "react";
import Head from "next/head";
import Link from "next/link";

function sendEmail(email) {
  const body = `Здравствуйте, я нашёл Вашего питомца.\n\nС уважением, ${localStorage.user}`;
  window.open(`mailto:${email}?subject=Потерянный зверь&body=${body}`);
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#111",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 32px",
    background: "#000",
    borderBottom: "1px solid #222",
  },
  back: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "15px",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  logout: {
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#222",
    color: "#fff",
    fontSize: "14px",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 16px",
  },
  title: {
    margin: "0 0 24px 0",
    fontSize: "32px",
  },
  sliderWrapper: {
    width: "900px",
    height: "600px",
    maxWidth: "100%",
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
  },
  slide: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    cursor: "pointer",
  },
  bgImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 1,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55))",
    zIndex: 2,
    pointerEvents: "none",
  },
  headerText: {
    position: "absolute",
    top: "30%",
    left: 0,
    width: "100%",
    margin: 0,
    padding: "0 24px",
    boxSizing: "border-box",
    zIndex: 4,
    color: "#fff",
    textAlign: "center",
    fontSize: "42px",
    textShadow: "0 2px 10px rgba(0,0,0,0.9)",
  },
  contentText: {
    position: "absolute",
    top: "50%",
    left: 0,
    width: "100%",
    margin: 0,
    padding: "0 24px",
    boxSizing: "border-box",
    zIndex: 4,
    color: "#eee",
    textAlign: "center",
    fontSize: "22px",
    fontWeight: 400,
    textShadow: "0 2px 8px rgba(0,0,0,0.9)",
  },
  arrowLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "60px",
    background: "rgba(0,0,0,0.4)",
    color: "#fff",
    border: "none",
    fontSize: "48px",
    cursor: "pointer",
    zIndex: 10,
  },
  arrowRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "60px",
    background: "rgba(0,0,0,0.4)",
    color: "#fff",
    border: "none",
    fontSize: "48px",
    cursor: "pointer",
    zIndex: 10,
  },
  dots: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "16px",
  },
  dot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#555",
    cursor: "pointer",
    border: "none",
  },
  dotActive: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#fff",
    cursor: "pointer",
    border: "none",
  },
  loading: {
    color: "#fff",
    padding: "60px",
    fontSize: "18px",
  },
  footer: {
    textAlign: "center",
    padding: "14px",
    background: "#000",
    color: "#888",
    fontSize: "14px",
    borderTop: "1px solid #222",
  },
};

export default function Petto() {
	const [animals, setAnimals] = React.useState([]);
	const [current, setCurrent] = React.useState(0);

	React.useEffect(() => {
	fetch("/animals.json")
		.then((data) => data.json())
		.then(setAnimals)
		.catch(() => setAnimals([]));
	}, []);
	
	const [user, setUser] = React.useState(null);

	React.useEffect(() => {
		const saved = localStorage.getItem("user");
		if (saved) {
			setUser(saved);
			return;
		}

		let name = null;
		while (!name) {
			name = prompt("Введите Ваше имя пользователя");
			if (!name) alert("Обязательно!");
		}
		localStorage.setItem("user", name);
		setUser(name);
	}, []);

	function logout() {
		localStorage.clear();
		location.reload();
	}

	function prev() {
		setCurrent((c) => (c - 1 + animals.length) % animals.length);
	}

	function next() {
		setCurrent((c) => (c + 1) % animals.length);
	}

	if (!animals.length) {
		return (
			<div style={styles.container}>
				<Head><title>Petto</title></Head>
				<p style={styles.loading}>Loading...</p>
			</div>
		);
	}

	const animal = animals[current];

	return (
		<div style={styles.container}>
			<Head>
				<title>Petto</title>
				<meta name="description" content="Социальная сеть для питомцев" />
			</Head>

			<header style={styles.header}>
				<Link href="/" style={styles.back}>← На главную</Link>
				<span style={styles.logo}>Petto</span>
				<button style={styles.logout} onClick={logout}>logout</button>
			</header>

			<main style={styles.main}>
				<h1 style={styles.title}>Потерянные питомцы</h1>

				<div style={styles.sliderWrapper}>
					<div
						style={styles.slide}
						onClick={() => sendEmail(animal.email)}
					>
					<img style={styles.bgImg} src={animal.img} alt={animal.header} />
					<div style={styles.overlay} />
					<h1 style={styles.headerText}>{animal.header}</h1>
					<h2 style={styles.contentText}>{animal.content}</h2>
					</div>

					<button style={styles.arrowLeft} onClick={prev}>‹</button>
					<button style={styles.arrowRight} onClick={next}>›</button>
				</div>

				<div style={styles.dots}>
					{animals.map((_, i) => (
						<button
							key={i}
							style={i === current ? styles.dotActive : styles.dot}
							onClick={() => setCurrent(i)}
							aria-label={`Слайд ${i + 1}`}
						/>
					))}
				</div>
			</main>

			<footer style={styles.footer}>Petto, (c) 2022</footer>
		</div>
	);
}