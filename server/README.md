# Purple Cart API

This repository contains the backend API for Purple Cart, a TypeScript-based e-commerce server built with Express and MongoDB.

## What it does

- User registration, login, logout, and profile management
- JWT-based authentication with secure cookies
- Product management, reviews, and admin product CRUD operations
- Order creation, user order history, and admin order management
- Password reset flow with token-based verification
- Environment validation using `zod`

## Technologies

- Node.js
- TypeScript
- Express
- MongoDB + Mongoose
- JSON Web Tokens (`jsonwebtoken`)
- `bcrypt` for password hashing
- `zod` for runtime config validation
- `helmet`, `cors`, `morgan`, `cookie-parser`
- `cloudinary` for image uploads

## Quick Start

### Requirements

- Node.js 18+
- npm
- MongoDB connection URI

### Install dependencies

```bash
npm install
```

### Create `.env`

Add a `.env` file in `server/` with the following values:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
NODE_ENV=development
```

### Run locally

Development mode with file watching:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

The API is available at `http://localhost:8000` by default.

## API Base Path

All endpoints are mounted under `/api/v1`.

## Main Routes

### Authentication

- `POST /api/v1/register`
  - Create a new user
  - Body: `{ name, email, password }`

- `POST /api/v1/login`
  - Sign in and receive an auth cookie
  - Body: `{ email, password }`

- `GET /api/v1/logout`
  - Clear authentication cookie

- `POST /api/v1/password/forgot`
  - Request password reset
  - Body: `{ email }`

- `PUT /api/v1/password/reset/:token`
  - Reset password using token
  - Body: `{ password, confirmPassword }`

### User

- `GET /api/v1/me`
  - Get current user profile
  - Requires authentication

- `PUT /api/v1/password/update`
  - Update user password
  - Body: `{ oldPassword, newPassword, confirmPassword }`

- `PUT /api/v1/me/update`
  - Update user profile details
  - Body: `{ name, email, avatar? }`

### Products

- `GET /api/v1/products`
  - List products with optional search, filters, and pagination

- `GET /api/v1/product/:id`
  - Get product details by ID

- `PUT /api/v1/review`
  - Add or update a product review
  - Requires authentication
  - Body: `{ rating, comment, productId }`

- `GET /api/v1/reviews?id=<productId>`
  - Fetch reviews for a product

- `DELETE /api/v1/reviews?productId=<productId>&id=<reviewId>`
  - Remove a review
  - Requires authentication

### Admin Product Management

- `GET /api/v1/admin/products`
  - Get all products for admin dashboard
  - Requires admin authorization

- `POST /api/v1/admin/product/new`
  - Create a new product
  - Requires admin authorization

- `PUT /api/v1/admin/product/:id`
  - Update a product
  - Requires admin authorization

- `DELETE /api/v1/admin/product/:id`
  - Delete a product
  - Requires admin authorization

### Orders

- `POST /api/v1/order/new`
  - Create a new order
  - Requires authentication
  - Body: `{ shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice }`

- `GET /api/v1/order/:id`
  - Get a single order by ID
  - Requires authentication

- `GET /api/v1/orders/me`
  - Get orders for the current user
  - Requires authentication

- `GET /api/v1/admin/orders`
  - Get all orders
  - Requires admin authorization

- `PUT /api/v1/admin/order/:id`
  - Update order status
  - Requires admin authorization

- `DELETE /api/v1/admin/order/:id`
  - Delete an order
  - Requires admin authorization

## Notes

- The app stores JWT tokens in an HTTP cookie.
- CORS is configured for `http://localhost:5173`.
- Environment variables are validated before startup with `zod`.

## Project Structure

- `src/index.ts` — server entry point
- `src/configs/` — app configuration and middleware setup
- `src/controllers/` — controller logic for routes
- `src/models/` — Mongoose schema definitions
- `src/routes/` — route definitions
- `src/middlewares/` — auth and error-handling middleware
- `src/types/` — shared TypeScript types

## Scripts

- `npm run dev` — start development server with hot reload
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled production server

## License

ISC


- `src/index.ts` — app bootstrap and server startup
- `src/config/env.ts` — environment validation and export
- `src/config/db.ts` — MongoDB connection helper
- `src/routes/` — Express route definitions
- `src/controllers/` — request handlers and business logic
- `src/models/` — Mongoose models
- `src/middleware/` — auth, error handling, async wrapper
- `src/utils/` — JWT token helper, API filtering utilities, error helper

## License

ISC
