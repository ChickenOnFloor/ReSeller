import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/olx';
export const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
export const PORT = process.env.PORT || 5000;
export const UPLOADS_DIR = 'uploads'; 