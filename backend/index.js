import express from "express";
const app = express();
const PORT = 4000;

const tenants = ["acme", "beta"];

app.get("/validate", (req, res) => {
  const tenant = req.query.tenant;
  if (tenants.includes(tenant)) {
    res.json({ valid: true });
  } else {
    res.status(404).json({ valid: false });
  }
});

app.listen(PORT, () => {
  console.log(`Tenant validation server running on http://localhost:${PORT}`);
});
