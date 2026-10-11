import React from "react";
import Head from "next/head";
import Link from "next/link";

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
  back: { color: "#fff", textDecoration: "none", fontSize: "15px" },
  logo: { fontSize: "22px", fontWeight: "bold", letterSpacing: "1px" },
  main: {
    flex: 1,
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: { margin: "0 0 24px 0", fontSize: "32px" },

  keyBox: {
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "10px",
    padding: "16px 24px",
    margin: "20px auto 0",
    maxWidth: "800px",
    width: "100%",
  },
  keyText: { margin: "0 0 10px 0", fontSize: "14px", color: "#ccc" },
  keyRow: { display: "flex", gap: "8px" },
  link: { color: "#4ea1ff" },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#4ea1ff",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "13px",
    padding: 0,
  },
  keyInfo: {
    padding: "10px 32px",
    fontSize: "13px",
    color: "#888",
    textAlign: "center",
  },

  content: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    width: "100%",
    maxWidth: "1300px",
    margin: "0 auto",
  },

  sidebar: {
    width: "320px",
    background: "#1a1a1a",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
  },
  sidebarTitle: { margin: "0 0 12px 0", fontSize: "18px" },
  label: {
    display: "block",
    fontSize: "13px",
    color: "#888",
    margin: "10px 0 4px 0",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #333",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "#0d0d0d",
    color: "#fff",
  },
  coords: {
    margin: "4px 0",
    fontFamily: "monospace",
    fontSize: "13px",
    background: "#0d0d0d",
    padding: "6px 10px",
    borderRadius: "6px",
    color: "#eee",
  },
  hint: { fontSize: "12px", color: "#666", margin: "4px 0 0 0" },
  btn: {
    padding: "10px 18px",
    background: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    maxHeight: "300px",
    overflowY: "auto",
  },
  listItem: {
    padding: "10px 0",
    borderBottom: "1px solid #222",
    fontSize: "14px",
  },
  listAddr: { color: "#888", fontSize: "13px" },

  mapWrapper: {
    flex: 1,
    minWidth: "400px",
    height: "600px",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    background: "#1a1a1a",
  },
  placeholder: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    textAlign: "center",
    padding: "20px",
    fontSize: "15px",
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

export default function PetShops() {
  const [shops, setShops] = React.useState([]);
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [coords, setCoords] = React.useState([53.195878, 45.018329]);

  const [apiKey, setApiKey] = React.useState("");
  const [keySubmitted, setKeySubmitted] = React.useState(false);

  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const ymapsRef = React.useRef(null);

  // Загрузка ключа из localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("ymaps_key");
    if (saved) {
      setApiKey(saved);
      setKeySubmitted(true);
    }
  }, []);

  // Загрузка магазинов
  React.useEffect(() => {
    fetch("/api/getShops")
      .then((r) => r.json())
      .then(setShops)
      .catch(() => setShops([]));
  }, []);

  // Загрузка Яндекс.Карт
  React.useEffect(() => {
    if (!keySubmitted || !apiKey) return;

    const initMap = (ymaps) => {
      ymapsRef.current = ymaps;
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = new ymaps.Map(mapRef.current, {
        center: [53.195878, 45.018329],
        zoom: 12,
      });
      mapInstanceRef.current = map;

      // Клик по карте — выбор координат
      map.events.add("click", (e) => {
        setCoords(e.get("coords"));
      });

      // Первая отрисовка меток
      drawPlacemarks();
    };

    const drawPlacemarks = () => {
      const map = mapInstanceRef.current;
      const ymaps = ymapsRef.current;
      if (!map || !ymaps) return;

      map.geoObjects.removeAll();

      // Синие метки магазинов
      shops.forEach((s) => {
        const pm = new ymaps.Placemark(
          s.coords,
          {
            hintContent: s.name,
            balloonContent: `${s.name}<br/>${s.address}`,
          },
          { preset: "islands#blueIcon" }
        );
        map.geoObjects.add(pm);
      });

      // Красная метка «новый магазин»
      const red = new ymaps.Placemark(
        coords,
        { hintContent: "Новый магазин" },
        { preset: "islands#redIcon" }
      );
      map.geoObjects.add(red);
    };

    if (window.ymaps) {
      window.ymaps.ready(() => initMap(window.ymaps));
    } else {
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.onload = () => window.ymaps.ready(() => initMap(window.ymaps));
      document.body.appendChild(script);
    }
  }, [keySubmitted, apiKey]);

  // Обновление меток при изменении shops или coords
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    const ymaps = ymapsRef.current;
    if (!map || !ymaps) return;

    map.geoObjects.removeAll();

    shops.forEach((s) => {
      const pm = new ymaps.Placemark(
        s.coords,
        {
          hintContent: s.name,
          balloonContent: `${s.name}<br/>${s.address}`,
        },
        { preset: "islands#blueIcon" }
      );
      map.geoObjects.add(pm);
    });

    const red = new ymaps.Placemark(
      coords,
      { hintContent: "Новый магазин" },
      { preset: "islands#redIcon" }
    );
    map.geoObjects.add(red);
  }, [shops, coords]);

  const saveShop = async () => {
    if (!name || !address) {
      alert("Заполните название и адрес!");
      return;
    }
    const newShop = { name, address, coords };
    const response = await fetch("/api/addShop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newShop),
    });
    if (response.ok) {
      setShops([...shops, newShop]);
      setName("");
      setAddress("");
      alert("Зоомагазин добавлен!");
    } else {
      alert("Ошибка сохранения");
    }
  };

  const applyKey = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      alert("Введите API-ключ");
      return;
    }
    localStorage.setItem("ymaps_key", trimmed);
    setKeySubmitted(true);
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Зоомагазины Пензы</title>
      </Head>

      <header style={styles.header}>
        <Link href="/" style={styles.back}>← На главную</Link>
        <span style={styles.logo}>Зоомагазины</span>
        <span style={{ width: "120px" }} />
      </header>

      {!keySubmitted && (
        <div style={styles.keyBox}>
          <p style={styles.keyText}>
            Введите API-ключ Яндекс.Карт.{" "}
            <a
              href="https://developer.tech.yandex.ru/services/"
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              Получить бесплатно
            </a>
          </p>
          <div style={styles.keyRow}>
            <input
              type="text"
              placeholder="e14144b2-718c-42c8-a212-d9dbf96e42d6"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={styles.input}
            />
            <button style={styles.btn} onClick={applyKey}>
              Применить
            </button>
          </div>
        </div>
      )}

      {keySubmitted && (
        <div style={styles.keyInfo}>
          Ключ применён.{" "}
          <button
            style={styles.linkBtn}
            onClick={() => {
              localStorage.removeItem("ymaps_key");
              setApiKey("");
              setKeySubmitted(false);
              mapInstanceRef.current = null;
            }}
          >
            Сменить ключ
          </button>
        </div>
      )}

      <main style={styles.main}>
        <h1 style={styles.title}>Зоомагазины Пензы</h1>

        <div style={styles.content}>
          <aside style={styles.sidebar}>
            <h3 style={styles.sidebarTitle}>Добавить магазин</h3>

            <label style={styles.label}>Название</label>
            <input
              placeholder="Например: Зоомагазин «Барсик»"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Адрес</label>
            <input
              placeholder="ул. Ленина, 10"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Координаты</label>
            <p style={styles.coords}>
              {coords[0].toFixed(6)}, {coords[1].toFixed(6)}
            </p>
            <p style={styles.hint}>Кликните по карте, чтобы выбрать место</p>

            <button style={{ ...styles.btn, marginTop: "12px" }} onClick={saveShop}>
              Сохранить
            </button>

            <h3 style={{ ...styles.sidebarTitle, marginTop: "24px" }}>
              Список ({shops.length})
            </h3>
            <ul style={styles.list}>
              {shops.map((s, i) => (
                <li key={i} style={styles.listItem}>
                  <b>{s.name}</b>
                  <br />
                  <span style={styles.listAddr}>{s.address}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div style={styles.mapWrapper}>
            {keySubmitted ? (
              <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
            ) : (
              <div style={styles.placeholder}>
                Введите API-ключ выше, чтобы увидеть карту
              </div>
            )}
          </div>
        </div>
      </main>

      <footer style={styles.footer}>Petto, (c) 2022</footer>
    </div>
  );
}