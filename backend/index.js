// backend/index.js
const express = require("express");
const app = express();
const PORT = 4000;

const tenants = ["acme", "beta"];

app.get("/validate", (req, res) => {
  const { tenant } = req.query;
  if (tenants.includes(tenant)) {
    res.json({ valid: true });
  } else {
    res.status(404).json({ valid: false });
  }
});

app.listen(PORT, () => {
  console.log(`Tenant validation server running on port ${PORT}`);
});
