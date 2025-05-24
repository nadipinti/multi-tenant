# 🚀 Multi-Tenant Affine + Chatwoot + React Setup

This project integrates:

- 🧠 [Affine](https://github.com/toeverything/AFFiNE) (collaborative workspace)
- 💬 [Chatwoot](https://github.com/chatwoot/chatwoot) (support chat)
- ⚛️ React frontend with dynamic white labeling
- 🐳 Docker Compose for local orchestration

---

## 📁 Project Structure

```
multi-tenant/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── public/
│   │   └── logos/
│   │       ├── acme.png
│   │       └── beta.png
│   └── src/
│       ├── App.jsx
│       └── TenantConfig.js
├── backend/
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── affine/ (cloned from GitHub)
│   ├── Dockerfile
│   └── ...
└── README.md
```

---

## 🛠️ Prerequisites

- Docker Desktop
- Node.js (if testing outside Docker)
- Git

---

## ✅ How to Run Locally

### 1. Clone Affine Repo

```
git clone https://github.com/toeverything/AFFiNE.git affine
```

Add a `Dockerfile` inside `affine/`:

```Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install
EXPOSE 3000
CMD ["yarn", "dev"]
```

---

### 2. Fill in Missing Files

#### `backend/package.json`
```json
{
  "name": "tenant-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

#### `backend/index.js`
```js
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
```

#### `frontend/Dockerfile` (for React Vite)
```Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

> If you use Create React App, change `dist` to `build` in the Dockerfile.

#### `frontend/src/TenantConfig.js`
```js
const tenants = {
  acme: {
    logo: "/logos/acme.png",
    primaryColor: "#ff6600",
    chatwootWebsiteToken: "<your_token>",
    chatwootBaseUrl: "http://localhost:3001",
  },
};
export default tenants;
```

---

### 3. Start All Services

```bash
docker-compose down -v
docker-compose up --build
```

✅ This launches:
- Affine: [http://localhost:3000](http://localhost:3000)
- Chatwoot: [http://localhost:3001](http://localhost:3001)
- Frontend: [http://localhost:3002/?tenant=acme](http://localhost:3002/?tenant=acme)
- Backend: [http://localhost:4000](http://localhost:4000)

---

## 💬 Chatwoot Setup

### 1. Open [http://localhost:3001](http://localhost:3001) and log in

If it's the first time:
```bash
docker-compose exec chatwoot bundle exec rails db:setup
```
Or:
```bash
docker-compose exec chatwoot bundle exec rails db:create db:migrate
```

### 2. Create a Website Inbox

- Go to **Settings → Inboxes → Add Inbox → Website**
- Copy the **Website Token**
- Paste it into `TenantConfig.js`

---

## 🧪 Test It

1. Visit: [http://localhost:3002/?tenant=acme](http://localhost:3002/?tenant=acme)
2. Chat bubble should appear
3. Open [http://localhost:3001](http://localhost:3001) and reply to chats

---

## 📌 Notes

- Logos must be inside `frontend/public/logos/`
- Chatwoot must be running and seeded to show replies
- Affine currently prompts for package — needs manual start or default config

Let me know if you want a deployable version or CI/CD instructions!
