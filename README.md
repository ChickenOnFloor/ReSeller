# OLX Full Stack Clone

This is a full stack OLX-like marketplace application, featuring a Node.js/Express backend and a React frontend. Users can register, log in, upload products, browse listings, and manage their own products.

## Features
- User registration and login (JWT authentication)
- User profile, avatar, and settings management
- Product listing, upload (with image), update, and deletion
- Product search, filtering, sorting, and pagination
- Like/unlike products
- Product comments and replies
- Mark products as sold/unsold
- Responsive UI with modern design

## Tech Stack & Libraries

### Backend
- **express** — Web framework for Node.js
- **mongoose** — MongoDB object modeling
- **bcryptjs** — Password hashing
- **jsonwebtoken** — JWT authentication
- **multer** — File uploads
- **cloudinary** — Image hosting
- **cors** — Cross-origin resource sharing
- **dotenv** — Environment variable management
- **nodemon** (dev) — Auto-restart server during development

### Frontend
- **react** — UI library
- **react-dom** — React DOM rendering
- **react-router-dom** — Routing
- **axios** — HTTP requests
- **@fortawesome/fontawesome-svg-core** — Icon core
- **@fortawesome/free-solid-svg-icons** — Solid icons
- **@fortawesome/free-brands-svg-icons** — Brand icons
- **@fortawesome/free-regular-svg-icons** — Regular icons
- **@fortawesome/react-fontawesome** — React icon components
- **gsap** — Animations
- **framer-motion** — Animations
- **tailwindcss** — Utility-first CSS
- **vite** — Build tool
- **eslint, postcss, autoprefixer** (dev) — Linting and CSS tooling

## Backend API Endpoints

### Auth (`/api/auth`)
- `POST /register` — Register a new user
- `POST /login` — Login and receive JWT

### User (`/api/user`)
- `GET /me` — Get current user info (auth required)
- `PUT /settings` — Update user settings (auth required)
- `PUT /avatar` — Update user avatar (auth required, file upload)

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
OLX/
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
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` by default.

   > **Note:** The frontend uses hardcoded API URLs pointing to `http://localhost:5000/api`. If you need to change the backend URL, update the relevant fetch/axios calls in the frontend source code.

## Usage
- Register a new account or log in.
- Browse, search, and filter products.
- Upload new products with images.
- Manage your own products from the "My Products" page.
- Edit account settings from the profile menu.

## Environment Variables
### Backend
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `PORT` - Port for backend server (default: 5000)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Frontend
- No environment variables required by default. API URLs are hardcoded in the source code.

## License
This project is for educational purposes and is not affiliated with OLX. 