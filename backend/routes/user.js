import express from 'express';
import { auth } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';
import User from '../models/User.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

const router = express.Router();

router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

router.put('/settings', auth, async (req, res) => {
  const { phone, address } = req.body;
  try {
    req.user.settings = { phone, address };
    await req.user.save();
    res.json({ settings: req.user.settings });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put('/avatar', auth, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload_stream({
        folder: 'olx-avatars',
      }, async (error, result) => {
        if (error) return res.status(500).json({ msg: error.message });
        req.user.avatar = result.secure_url;
        await req.user.save();
        res.json({ avatar: req.user.avatar });
      });
      result.end(req.file.buffer);
      return;
    }
    await req.user.save();
    res.json({ avatar: req.user.avatar });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/liked-products', auth, async (req, res) => {
  try {
    await req.user.populate({
      path: 'likedProducts',
      populate: { path: 'seller', select: 'name email avatar' }
    });
    res.json({ products: req.user.likedProducts });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router; 