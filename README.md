# OwnerView Admin Dashboard

This is the admin panel for OwnerView. It lets you manage orders, customers, reviews, and working files all from one place.

---

## How to Log In

Go to http://localhost:5173/ and use these credentials:

| Field    | Value   |
|----------|---------|
| Username | `admin` |
| Password | `admin` |

That's it. Type admin in both fields and hit Sign In.

---

## How to Run It

```bash
npm install
npm run dev
```

Then open your browser and go to http://localhost:5173/

---

## Pages

| Page | What it does |
|------|-------------|
| Sign In | Login screen |
| Orders | See all orders, search by name or ID, upload files |
| Customers | See all customers, add new ones |
| Reviews | Read customer reviews, approve or flag them |
| Working Files | See uploaded files, approve or reject them |
| Settings | Update your name, email, password, and notifications |

---

## Shopify Integration

Right now the orders page shows demo data. To pull in real orders from your Shopify store, you need a Shopify API token.

Here is how to get one and set it up:

**Step 1.** Log into your Shopify admin panel and go to Settings.

**Step 2.** Click on "Apps and sales channels" and then click "Develop apps".

**Step 3.** Click "Create an app", give it a name like "OwnerView Admin", and click Create.

**Step 4.** Go to "API credentials" inside that app and copy the "Admin API access token".

**Step 5.** Create a file called `.env` in the root of this project and add these two lines:

```
VITE_SHOPIFY_TOKEN=paste_your_token_here
VITE_SHOPIFY_STORE=your-store-name.myshopify.com
```

**Step 6.** Open `src/pages/Orders.jsx`. At the top of the file you will find a comment block labeled "SHOPIFY INTEGRATION PLACEHOLDER". Follow the instructions written there to swap the demo data for real Shopify orders. It is about 5 lines of code.

Once that is done, every new order placed on your Shopify store will automatically show up in the dashboard.

---

## Tech Stack

- React 18 and Vite 5
- React Router for page navigation
- Axios for API calls
- Vanilla CSS with custom properties
- Inter font from Google Fonts

---

## Backend API

The app also has a backend at https://hiteshy44.pythonanywhere.com/api/v1/ for when you want to manage orders that come through your own platform instead of Shopify.
