const PORT = process.env.PORT || 5000;
const express = require("express");
const multer = require("multer");
const AdmZip = require("adm-zip");
const parser = require("@babel/parser");
const cors = require("cors");
const fs = require("fs");
// const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors({ origin: "http://localhost:3000" }));

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.post("/upload", upload.single("zipFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const zip = new AdmZip(req.file.path);
    const zipEntries = zip.getEntries();
    const astResults = {};

    zipEntries.forEach((entry) => {
      if (entry.entryName.endsWith(".js")) {
        const content = entry.getData().toString("utf8");
        try {
          astResults[entry.entryName] = parser.parse(content, {
            sourceType: "module",
          });
        } catch (err) {
          astResults[entry.entryName] = { error: "Parsing failed" };
        }
      }
    });

    fs.unlinkSync(req.file.path); // Clean up uploaded zip file
    res.json(astResults);
  } catch (err) {
    res.status(500).json({ error: "Error processing zip file" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});