import express from 'express';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import User from '../models/User.js';

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

router.put('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    req.user.avatar = req.file ? `/${req.file.path.replace(/\\/g, '/')}` : req.user.avatar;
    await req.user.save();
    res.json({ avatar: req.user.avatar });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router; 