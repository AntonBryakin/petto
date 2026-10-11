import fs from "fs";

export default (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Invalid method, use POST");
  }

  try {
    const filePath = "public/petshops.json";
    let shops = [];
    if (fs.existsSync(filePath)) {
      shops = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    shops.push(req.body);
    fs.writeFileSync(filePath, JSON.stringify(shops, null, 2));
    res.status(201).json({ ok: true });
  } catch (e) {
    console.log("Ошибка:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
};