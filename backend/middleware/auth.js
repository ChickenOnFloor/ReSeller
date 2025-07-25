import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password').populate('likedProducts');
    if (!req.user) throw new Error('User not found');
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}; 