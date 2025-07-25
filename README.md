
# Reseller


![Node.js](https://img.shields.io/badge/Node.js-16%2B-green?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-black?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?logo=open-source-initiative&logoColor=white)

 - Full Stack Marketplace Clone

Reseller is a full-stack marketplace application inspired by OLX, featuring a Node.js/Express backend and a React frontend. Users can register, log in, upload products, browse listings, like products, and manage their own products and profile.

## Features
- User registration and login (JWT authentication)
- User profile, avatar, and settings management
- Product listing, upload (with image), update, and deletion
- Product search, filtering, sorting, and pagination
- Like/unlike products
- View your liked products
- Product comments and replies
- Mark products as sold/unsold
- Responsive UI with modern design

## Tech Stack & Libraries

### **Backend**
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT (jsonwebtoken)** — Authentication
- **bcryptjs** — Password hashing
- **multer** — File uploads
- **Cloudinary** — Image hosting
- **CORS**, **dotenv**
- **nodemon** (dev) — Development server

### **Frontend**
- **React** (React 18)
- **React Router DOM**
- **Axios**
- **Tailwind CSS**
- **FontAwesome** (icons)
- **GSAP** — Animations
- **Vite** — Fast bundling and development
- **ESLint**, **PostCSS**, **Autoprefixer** (dev)

## Backend API Endpoints

### Auth (`/api/auth`)
- `POST /register` — Register a new user
- `POST /login` — Login and receive JWT

### User (`/api/user`)
- `GET /me` — Get current user info (auth required, used for all user state)
- `PUT /settings` — Update user settings (auth required)
- `PUT /avatar` — Update user avatar (auth required, file upload to Cloudinary)
- `GET /liked-products` — Get current user's liked products (auth required)

### Products (`/api/products`)
- `GET /` — List products (filter, sort, search, price range)
- `GET /mine` — List current user's products (auth, search, pagination)
- `GET /seller/:sellerId` — List products by seller
- `GET /:id` — Get single product (with seller and comments)
- `POST /` — Create product (auth, image upload)
- `PUT /:id` — Update product (auth, only by owner, image upload)
- `DELETE /:id` — Delete product (auth, only by owner)
- `PATCH /:id/sold` — Toggle product sold status (auth, only by owner)
- `POST /:id/like` — Like/unlike product (auth)
- `POST /:id/comments` — Add comment (auth)
- `POST /:id/comments/:commentId/reply` — Reply to comment (auth)

## Project Structure
```
Reseller/
  backend/      # Node.js/Express API
  frontend/     # React client app
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud instance)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend directory with the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000` by default.

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the frontend directory with the following variable (optional, but recommended for easy API URL changes):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` by default.

   > **Note:** The frontend now uses `import.meta.env.VITE_API_URL` for all API requests. Change this value in your `.env` file to point to a different backend if needed.

## Usage
- Register a new account or log in.
- Browse, search, and filter products.
- Upload new products with images.
- Like/unlike products and view your liked products.
- Manage your own products from the "My Products" page.
- Edit account settings and upload an avatar (stored on Cloudinary).

## Environment Variables
### Backend
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `PORT` - Port for backend server (default: 5000)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Frontend
- `VITE_API_URL` - Base URL for API requests (default: http://localhost:5000/api)

## Security Notes
- Only the JWT token is stored in localStorage. User info is always fetched from the backend using the token.
- Avatars and product images are stored on Cloudinary, not locally.

## License
This project is for educational purposes. 