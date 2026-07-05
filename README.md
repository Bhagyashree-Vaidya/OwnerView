# OwnerView — Super Admin Dashboard

A React + Vite super admin panel for managing orders, customers, reviews, and working files on the OwnerView freelancing platform.

---

## 🔐 Admin Login Credentials

To access the dashboard, use the following credentials on the Sign In page:

| Field    | Value   |
|----------|---------|
| Username / Email | `admin`   |
| Password | `admin`   |

> **Note:** These are mock/demo credentials that work offline without the backend. When the real backend is connected, the production credentials will replace these.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open: **http://localhost:5173/**

---

## 📋 Pages

| Route            | Description                          |
|------------------|--------------------------------------|
| `/`              | Sign In                              |
| `/orders`        | Orders list with stats, search, upload |
| `/customers`     | Customer management                  |
| `/reviews`       | Review moderation (approve/flag/hide)|
| `/working-files` | File management (approve/reject)     |
| `/settings`      | Account settings, password, notifications |

---

## 🔧 Tech Stack

- **React 18** + **Vite 5**
- **React Router DOM v7**
- **Axios** — for API calls
- **Inter** — typography (Google Fonts)
- Vanilla CSS with CSS custom properties

---

## 🌐 Backend API

The app connects to: `https://hiteshy44.pythonanywhere.com/api/v1/`

When the backend is ready, replace mock data imports in each page with real `axios.get()` calls. The mock data structure already mirrors the API shape.
