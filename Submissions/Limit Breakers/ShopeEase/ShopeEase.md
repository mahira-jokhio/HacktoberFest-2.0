ShopEase - Inventory & Sales Management System</br>
📋 Project Overview</br>
ShopEase is a comprehensive web-based inventory and sales management system designed to help businesses efficiently manage their products, process sales, track transactions, and generate insightful reports. The application features role-based access control with separate interfaces for administrators and regular users.</br>

✨ Key Features
🔐 Authentication System
User Registration & Login with role-based access (Admin/User)

Secure session management with localStorage

Role-specific dashboard redirection

🏠 Admin Dashboard
Real-time business overview with key metrics

Total products, daily sales, low stock alerts, and revenue tracking

Recent transactions display

Top-selling products analytics

📦 Product Management (Admin)
Complete CRUD operations for products

Product categorization and inventory tracking

Low stock highlighting (less than 5 items)

Advanced search functionality by name, SKU, or category

Bulk product management

🛒 Sales & Point of Sale (User)
Product selection from available inventory

Shopping cart functionality with quantity validation

Automatic tax calculation (10%)

Stock validation during checkout

Transaction processing with inventory updates

📊 Reports & Analytics
Date-range filtering for sales data

Sales summary cards with key metrics

Detailed transaction reporting

CSV export functionality for data analysis

Top product performance tracking

🛠️ Technology Stack
Frontend: HTML5, CSS3, JavaScript (ES6+)

Styling: Custom CSS with gradient designs and responsive layouts

Storage: Browser localStorage for data persistence

Icons: Unicode emojis for visual elements

🎯 User Roles & Permissions
👨‍💼 Administrator
Full access to all features

Product management (add, edit, delete)

View comprehensive dashboard analytics

Access to all reporting features

👤 Regular User
Access to sales interface only

Process transactions and checkout

View available products for sale

📁 Project Structure
ShopEase/
├── index.html              # Login page
├── signup.html             # User registration
├── dashboard.html          # Admin dashboard
├── products.html           # Product management
├── sales.html              # POS & sales processing
├── reports.html            # Analytics & reporting
├── assets/
│   ├── css/
│   │   └── style.css       # Authentication styles
│   └── js/
│       └── script.js       # Main application logic

🚀 Installation & Setup
Clone or download the project files

No server required - runs directly in modern web browsers

Open index.html in your browser to start the application

Register a new account or use existing credentials

💾 Data Storage
The application uses browser localStorage to persist:

User accounts and credentials

Product inventory data

Sales transactions

Shopping cart sessions

Note: Data is stored locally in the browser and will persist between sessions but is limited to the specific browser and device.

🎨 Design Features
Modern gradient UI with purple/blue color scheme

Fully responsive design for mobile and desktop

Intuitive navigation with sidebar menu

Interactive elements with hover effects and transitions

Professional typography using Poppins font family

🔄 Key Functionalities
Product Management
Add new products with SKU, name, category, price, and quantity

Edit existing product information

Remove products from inventory

Real-time stock level monitoring

Sales Processing
Dynamic product dropdown with stock levels

Quantity validation against available stock

Automatic cart total calculations with tax

Inventory deduction upon successful checkout

Reporting
Filter transactions by date range

Export sales data to CSV format

View sales performance metrics

Identify top-selling products

🛡️ Security Features
Client-side validation for all form inputs

Password confirmation during registration

Role-based route protection

Duplicate user email prevention

Stock validation to prevent overselling

📱 Browser Compatibility
Chrome (recommended)

Firefox

Safari

Edge

🔮 Future Enhancements
Potential improvements for production deployment:

Backend integration with database

User authentication with encryption

PDF invoice generation

Barcode scanning integration

Multi-store support

Advanced analytics with charts

Email notifications for low stock
