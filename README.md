# OwnerView Admin Dashboard

OwnerView is a super admin panel for business owners to manage everything that comes through their store. You can track orders, manage customers, moderate reviews, handle working files, and connect your Shopify store so orders flow in automatically.

---

## How to Log In

Open http://localhost:5173/ and use these credentials:

| Field    | Value   |
|----------|---------|
| Username | `admin` |
| Password | `admin` |

Type admin in both fields and hit Sign In.

---

## How to Run It

```bash
npm install
npm run dev
```

Then open your browser and go to http://localhost:5173/

---

## Pages and Features

### Orders
- See all orders in one table with Order ID, client name, service type, status, date, amount, and file count
- Filter orders by status (Pending, In Progress, Completed, Cancelled)
- Search orders by client name, order ID, or service
- Upload files directly to an order using a drag and drop modal
- Stat cards at the top show Total Orders, Pending, In Progress, Completed, and Revenue at a glance
- When Shopify is connected, this page fetches your real orders live and shows a green "Connected" banner
- When not connected, a banner prompts you to go to Settings to connect Shopify

### Customers
- See all registered customers with name, email, phone, total orders, total spend, and join date
- Filter by status (Active, Inactive, Suspended)
- Search by name, email, or customer ID
- Add new customers using the Add Customer form
- Stat cards show Total, Active, Inactive, and Suspended counts

### Reviews
- See all customer reviews with star ratings and comment previews
- Take action on each review: Approve, Flag, or Hide
- Filter by status (Published, Flagged, Hidden)
- Stat cards show Average Rating, Total Reviews, Published count, and Flagged count

### Working Files
- See all project files uploaded across orders
- File type is shown as a badge (PDF, DOCX, ZIP, MP4, etc.)
- Approve or Reject pending files with one click
- Upload new files using a drag and drop modal
- Stat cards show Total Files, Pending Review, Approved, and Rejected

### Settings
- **Shopify Integration** (see below for setup steps)
- Update your profile name, email, phone, and timezone
- Change your password with validation
- Toggle notifications for new orders, reviews, file uploads, and monthly reports

---

## Connecting Your Shopify Store

You do not need to touch any code or config files. Everything is done through the Settings page inside the dashboard.

Here is how to do it:

**Step 1.** Log into your Shopify admin panel and click Settings at the bottom left.

**Step 2.** Click "Apps and sales channels" and then click "Develop apps".

**Step 3.** Click "Create an app" and give it any name, like "OwnerView".

**Step 4.** Click "Configure Admin API scopes", check the box for "read_orders", and save.

**Step 5.** Click "Install app". You will see your Admin API access token appear once. Copy it.

**Step 6.** Go to the Settings page in this dashboard. Paste your store URL and your token into the Shopify Integration section and click "Save and Connect".

That is it. Your orders will start showing up on the Orders page automatically. You can click Refresh on the Orders page anytime to pull in the latest ones.

---

## Tech Stack

- React 18 and Vite 5
- React Router for page navigation
- Axios for API calls
- Vanilla CSS with custom properties
- Inter font from Google Fonts
