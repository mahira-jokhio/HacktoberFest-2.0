# 🏙️ Smart City – Waste Collection & Tracking Portal

A **Smart City Waste Management Web Application** designed to **digitize and track municipal waste collection** activities.  
The system connects **Administrators**, **Drivers**, and **Citizens** to make waste collection more **efficient**, **transparent**, and **real-time**.

---

## 📌 Table of Contents

- [📖 Overview](#-overview)
- [✨ Features](#-features)
- [🧑‍💻 User Roles](#-user-roles)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Folder Structure](#-folder-structure)
- [🧭 Pages Description](#-pages-description)
- [🚀 How to Run](#-how-to-run)
- [🧠 Future Enhancements](#-future-enhancements)
- [📝 License](#-license)

---

## 📖 Overview

This project is a **front-end based waste collection portal** aimed at providing:
- Smart tracking of waste collection routes 🚛
- Digital complaint submission 📝
- Driver task management 🧑‍🔧
- Centralized control for Admins 🧑‍💼

All data is stored in the **browser’s Local Storage**, making the app **lightweight** and easy to set up.

---

## ✨ Features

✅ Centralized dashboard for all user roles  
✅ Driver route assignments and completion tracking  
✅ Citizen complaint submission and status tracking  
✅ Admin management for staff, vehicles, and zones  
✅ Custom alert system with beautiful UI feedback  
✅ Responsive & clean design (works across all pages)  
✅ Modular JavaScript (one file controls all pages)

---

## 🧑‍💻 User Roles

### 🧑‍💼 **Admin**
- Add / View / Delete:
  - Staff
  - Vehicles
  - Zones
- View Reports & Statistics
- Monitor routes and complaints

### 🚛 **Driver**
- View assigned routes for the day
- Update route status (Completed / Pending)

### 🧑 **Citizen**
- Submit complaints
- View complaint status
- Access public dashboard

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: Browser `localStorage`
- **Responsive Design**: Flexbox & Grid Layout
- **Icons**: Font Awesome

---

## 📁 Folder Structure

SmartCity/
│
├── index.html # Login / Landing page
├── signup.html # Registration page
│
├── citizen-dashboard.html # Citizen main dashboard
├── driver-dashboard.html # Driver main dashboard
│
├── admin-dashboard.html # Admin dashboard
├── manage-staff.html # Admin staff management
├── manage-vehicles.html # Admin vehicles management
├── manage-zones.html # Admin zones management
├── reports.html # Admin reports page
│
├── assets/
│ ├── css/
│ │ └── style.css # Global styling for all pages
│ ├── js/
│ │ └── main.js # All project logic in one file
│ └── images/ # Logos / Icons / Illustrations
│
└── README.md # Project documentation

---

## 🧭 Pages Description

| Page Name | Description | Role |
|-----------|-------------|------|
| `index.html` | Login page for all users (Admin, Driver, Citizen) | All |
| `signup.html` | New user registration | All |
| `citizen-dashboard.html` | View complaint status, submit complaint | Citizen |
| `driver-dashboard.html` | View routes, update status | Driver |
| `admin-dashboard.html` | Overall stats, shortcuts | Admin |
| `manage-staff.html` | Add/Delete staff | Admin |
| `manage-vehicles.html` | Add/Delete vehicles | Admin |
| `manage-zones.html` | Add/Delete zones | Admin |
| `reports.html` | View performance and logs | Admin |

---

🌐 Run the project:

Just open index.html in your browser (no server required)

Or use Live Server extension in VS Code for better experience.
