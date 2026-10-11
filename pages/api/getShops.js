import fs from "fs";

export default (req, res) => {
  try {
    const fileContent = fs.readFileSync("public/petshops.json");
    res.status(200).send(fileContent);
  } catch (e) {
    res.status(200).send("[]");
  }
};