# 🛍️ Fashion Market - E-Commerce Platform

A modern, full-stack E-Commerce platform built for fashion and clothing retail. Featuring a robust **Node.js / Express** REST API backend paired with a high-performance **React 19 + Vite** frontend styled with **Tailwind CSS v4**.

---

## 📸 Screenshots & UI Showcase

The project includes UI screenshots located in the [`image of project/`](file:///d:/2026/Projects/Fashion%20Market%28clothes%29/image%20of%20project) directory:

- **Product Catalog & Storefront**: Interactive browsing, search, and category filtering.
- **Admin Dashboard & Analytics**: System overview, product, brand, and category controls.
- **User Management & Audit Logs**: Detailed user roles and system action logs.

---

## ✨ Features

### 👤 Customer Features
- **User Authentication**: Secure registration, login, and JWT-based session handling.
- **Catalog Browsing**: Browse fashion items filtered by category, brand, price range, and real-time search queries.
- **Order Management**: Shopping cart checkout, order placement, and personal order status tracking.
- **Ratings & Reviews**: Product rating system with user reviews.
- **Profile & Security**: Manage user profile details and password reset capabilities.

### 🛡️ Admin & Manager Features
- **Role-Based Access Control (RBAC)**: Secure access restrictions for `user`, `admin`, and `manager` roles.
- **Admin Dashboards**:
  - **Product Management**: Full CRUD operations for products, stock control, and multi-file image uploads via Multer.
  - **Category & Brand Management**: Organize store categories and brand directory.
  - **Order Administration**: Inspect and update customer order statuses.
  - **User & Log Management**: View users and inspect system audit logs (`manager` role exclusive).

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

### **Backend**
- **Runtime & Framework**: [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose 9](https://mongoosejs.com/)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & password hashing via `bcrypt` / `bcryptjs`
- **Validation**: [Joi](https://joi.dev/) schema validation
- **Security & Utilities**: `helmet`, `cors`, `express-rate-limit`, `compression`, `winston`, `morgan`
- **File Uploads**: `multer` for handling product image assets

---

## 📁 Project Architecture

```
Fashion Market/
├── Backend/                   # Node.js / Express REST API Server
│   ├── seeding/               # Database seed scripts for products & categories
│   ├── src/
│   │   ├── config/            # Database connection configuration
│   │   ├── controllers/       # Controller logic for API routes
│   │   ├── middlewares/       # Authentication, logging, rate-limit, and error handlers
│   │   ├── models/            # Mongoose schemas (User, Product, Order, Category, Brand, Review, UserLogs)
│   │   ├── routes/            # API endpoints definitions
│   │   ├── services/          # Core business services logic
│   │   ├── utils/             # Winston logger & error handlers
│   │   ├── validators/        # Joi schema validation
│   │   └── uploads/           # Product images upload storage
│   ├── .env                   # Server environment variables
│   ├── package.json           # Backend dependencies and scripts
│   └── vercel.json            # Deployment configuration
│
├── Frontend/                  # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── app/               # Routes configuration & global providers
│   │   ├── components/        # Reusable UI components
│   │   ├── features/          # Feature components (Auth, User, Admin)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Views (Home, Menu, Orders, Reviews, Admin pages)
│   │   ├── services/          # Axios API communication
│   │   └── styles/            # CSS styling
│   ├── public/                # Static public assets
│   ├── package.json           # Frontend dependencies and scripts
│   └── vite.config.js         # Vite build configuration
│
└── image of project/          # Project screenshots & visual assets
```

---

## ⚡ Quick Start & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas connection string)

---

### 1️⃣ Backend Setup

1. **Navigate to the Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create or update `.env` in the `Backend` directory:
   ```env
   PORT=3006
   MONGO_URI=mongodb://localhost:27017/FashionMarket
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Seed Database (Optional):**
   ```bash
   npm run seed:products
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Backend API server will start on **`http://localhost:3006`**.

---

### 2️⃣ Frontend Setup

1. **Navigate to the Frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Frontend application will start on **`http://localhost:5173`**.

---

## 🔌 API Endpoints Overview

| Base Endpoint | Description | Auth Required | Access Level |
| :--- | :--- | :---: | :---: |
| `/api/users` | Authentication, Profile, Password Reset & User Admin | Partial | Public / User / Admin |
| `/api/userslogs` | System Activity & Audit Logs | Yes | Manager |
| `/api/products` | Product listings, CRUD, and image upload | Partial | Public / Admin |
| `/api/categories` | Product category management | Partial | Public / Admin |
| `/api/brands` | Clothing brand management | Partial | Public / Admin |
| `/api/orders` | Checkout, order creation & status updates | Yes | User / Admin |
| `/api/reviews` | Product ratings and reviews | Partial | Public / User |


