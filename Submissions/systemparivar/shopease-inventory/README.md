# ShopEase - Inventory & Sales Management System

A comprehensive web application for small businesses to manage inventory, track sales, and monitor stock levels in real time.

## Features

### Product Management
- Add, edit, and delete products
- Track SKU, category, price, and quantity
- Automatic low-stock alerts
- Product image uploads via Cloudinary
- Dynamic search and filtering

### Sales & Invoicing
- Create and manage invoices
- Automatic total calculations
- Multiple payment methods
- Real-time inventory updates
- Tax calculation

### Reports & Analytics
- Daily and monthly sales reports
- Export to CSV and JSON formats
- Revenue and profit tracking
- Transaction history
- Top-selling products analysis

### Dashboard
- Real-time sales statistics
- Sales trend charts
- Revenue distribution pie charts
- Low stock alerts
- Top products overview

### User Management
- Admin and Cashier roles
- Role-based access control
- User activity tracking
- Secure authentication with JWT

### Data Visualization
- Bar charts for sales trends
- Pie charts for revenue distribution
- Real-time statistics
- Interactive dashboards

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt
- **Image Storage**: Cloudinary
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd shopease
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Setup environment variables
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your credentials
\`\`\`

4. Run development server
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for all required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `CLOUDINARY_UPLOAD_PRESET`: Cloudinary upload preset

## Project Structure

\`\`\`
shopease/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── products/         # Product management
│   ├── sales/           # Sales creation
│   ├── reports/         # Reports page
│   ├── users/           # User management
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   └── page.tsx         # Home page
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── dashboard/       # Dashboard components
│   ├── products/        # Product components
│   ├── sales/          # Sales components
│   └── users/          # User components
├── lib/
│   ├── db.ts           # MongoDB connection
│   ├── auth.ts         # Authentication utilities
│   ├── middleware.ts   # Auth middleware
│   ├── models/         # MongoDB models
│   └── cloudinary.ts   # Cloudinary utilities
└── public/             # Static assets
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product (Admin)
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product (Admin)
- `DELETE /api/products/[id]` - Delete product (Admin)
- `POST /api/products/upload` - Upload product image

### Sales
- `GET /api/sales` - List sales
- `POST /api/sales` - Create sale
- `GET /api/sales/[id]` - Get sale details
- `GET /api/sales/stats` - Get sales statistics

### Reports
- `GET /api/reports/daily` - Daily report
- `GET /api/reports/monthly` - Monthly report
- `GET /api/reports/export` - Export report (CSV/JSON)

### Users
- `GET /api/users` - List users (Admin)
- `PUT /api/users/[id]` - Update user (Admin)
- `DELETE /api/users/[id]` - Delete user (Admin)

## Usage

### Creating a Sale
1. Navigate to "New Sale"
2. Select products and quantities
3. Review the summary
4. Choose payment method
5. Complete the transaction

### Generating Reports
1. Go to Reports (Admin only)
2. Select report type (Daily/Monthly)
3. Choose date range
4. Click "Generate Report"
5. Export to CSV or JSON

### Managing Products
1. Go to Products (Admin only)
2. Click "Add Product"
3. Fill in product details
4. Upload product image
5. Save product

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Secure HTTP-only cookies
- MongoDB connection pooling
- Input validation

## Performance Optimizations

- Server-side rendering with Next.js
- Image optimization with Cloudinary
- Database indexing
- Pagination for large datasets
- Caching strategies

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the repository or contact the development team.
