ShopEase Management System
Project Overview

ShopEase is an offline-first store management system for small to medium retail businesses. It manages inventory, sales, employees, and customers — all within one simple, fast, and reliable web app that even works without an internet connection.

Key Highlights

Offline-First: Works smoothly without internet; stores data locally.

Progressive Web App (PWA): Installable on any device, behaves like a native app.

Modern Interface: Clean design, dark mode, responsive layout, and smooth performance.

User Roles

Admin:

Full system access: manage products, sales, employees, and reports.

Default login: admin / admin123

Cashier:

Handles billing and daily sales operations.

Default login: cashier / cashier123

Core Features

Dashboard: Real-time sales, profit, inventory, and employee overview.

Product Management: Add, edit, and track products; low-stock alerts; bulk import/export.

Stock Tracking: Record all stock changes with timestamps and reasons.

Billing System: Barcode scanning, tax and discount support, printable receipts.

Sales Reports: Daily, weekly, and monthly reports with profit analysis.

Employee Management: Attendance, payroll, and performance tracking.

Customer Management: Purchase history, spending analysis, and loyalty tracking.

Technology Stack

Frontend: React 18, React Router 6, Vite

UI & Styling: TailwindCSS, Lucide Icons, Dark Mode

Charts: Recharts

Data Storage: JSON-based localStorage (file-based system)

State Management: React Context API (Auth and App Contexts)

PWA Support: Service Workers, Vite PWA Plugin

Setup Instructions

Install dependencies

npm install


Run the development server

npm run dev


Open the app at http://localhost:5173

Log in using default credentials to begin setup.

Data Handling

All data is stored locally on the browser.

Import/export functionality for easy backup and restore.

No external servers or third-party APIs used.

Security

Password-protected login system.

Role-based access control (Admin and Cashier).

Data privacy ensured through local storage.

Future Enhancements

Cloud synchronization for multi-device access.

Supplier and expense management.

Loyalty programs and promotional tools.

Multi-store and multi-user support.

Conclusion

ShopEase is a complete store management system that prioritizes speed, privacy, and simplicity. It eliminates dependency on the internet and provides all the tools needed to manage retail operations effectively.

Key Points:

Works entirely offline

Secure and private

Fast and reliable

Simple to set up and scale

Start managing your business smarter with ShopEase