const express = require("express");
const app = express();
const PORT = 3000;

// همه فایل‌های داخل public رو استاتیک کن
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
