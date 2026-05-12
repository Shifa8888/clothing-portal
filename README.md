# Harry Store - Responsive Admin Portal

An executive-level, fully responsive, and highly customizable Admin Portal for **Harry Store** built using React, TypeScript, and Tailwind CSS. This system mimics modern enterprise eCommerce platforms (such as Shopify, Magento, and BigCommerce), providing a complete administrative suite with zero configuration or database setup.

## 🚀 Live Demo & Key Credentials

The system operates a secure static authentication mechanism using configuration variables.

*   **Username ID:** `admin`
*   **Security Password:** `password123`
*   *(An auto-fill helper badge is also integrated directly on the login screen for rapid evaluator access!)*

## 🌟 Key Architectural Features

1.  **Mock Database State Machine (`localStorage` Sync):**
    All products, categories, orders, customers, and branding settings are stored in high-fidelity state arrays. When you add, edit, or delete items, the system updates instantly and backs them up into the browser's `localStorage`. Reloading the page retains 100% of your edits!
2.  **Five Aesthetic Core Themes:**
    *   **Light Minimalist:** Crisp layout, clean lines, and soft shadows with peak legibility.
    *   **Obsidian Midnight:** Developer-friendly dark mode using deep slate shades to protect eyes during nighttime management.
    *   **Monochromatic Serif:** Monochromatic stark styling featuring clean monospace typography, borders, and bold headers.
    *   **Premium Brass & Gold:** An ultra-premium dark luxury theme displaying brass highlights, perfect for high-end fashion boutiques.
    *   **Neon Cosmic Gradient:** Modern futuristic visual layout utilizing glassmorphism cards and vibrant background gradient blurs.
3.  **Local Image Upload Simulator:**
    Selecting any file in the image upload triggers a reader that converts your file into a robust Base64 data string. It simulates a server-side upload to `public/uploads/` but saves the graphic locally in your storage state, allowing custom images to display instantly and persist across reloads!
4.  **High-Fidelity SVG Charts & Analytics:**
    Custom, reactive SVG area, bar, and donut charts built from scratch. Eliminates typical charting library dependency conflicts with React 19 while maintaining hover effects, animation frames, and color theme sync.

## 📂 Navigation Modules

*   **Dashboard:** Metric cards (Revenue, Orders, Low Stock Alerts, Customers), weekly sales area charts, weekly order bar charts, product inventory donuts, real-time activity logs, and a quick list of recent orders.
*   **Products:** Add, edit, delete, search, and filter items by category or status. Complete with an image uploader, automated SKU generators, and a stock count warning threshold.
*   **Categories:** Complete catalog manager with cover uploads, description edits, auto-generating URL slugs, and real-time stock counters.
*   **Orders:** Customer info sheets, shipping destinations, invoice tallies, and direct controls to alter fulfillment status (*Pending, Processing, Shipped, Delivered*) and payment status (*Paid, Unpaid, Refunded*).
*   **Banners:** Management of promotional sliders and marketing graphics with active switch toggles.
*   **Customers:** Moderation panel allowing you to suspend or activate accounts based on fraud indicators or user reports.
*   **Reports:** Downloadable CSV raw spreadsheets, printable PDF invoices, and detailed product inventory health metrics.
*   **Theme Settings:** Switch the workspace environment look with a single click.
*   **Website Settings:** Customize global parameters including tax rates, shipping surcharges, announcements, logos, social profiles, and WhatsApp live integration links.

## 🛠️ Tech Stack & Scripts

*   **Framework:** React 19, TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS 4
*   **Iconography:** Lucide React

To start the portal locally:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```
