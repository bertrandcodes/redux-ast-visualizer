const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors({ origin: "http://localhost:3000" }));

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});