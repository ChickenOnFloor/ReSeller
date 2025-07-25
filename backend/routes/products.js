import express from 'express';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import Product from '../models/Product.js';
import Comment from '../models/Comment.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

const router = express.Router();

router.get('/', async (req, res) => {
  const { sortBy = 'createdAt', order = 'desc', category, min, max, search } = req.query;
  let filter = {};
  if (category) filter.category = category;
  if (min) filter.price = { ...filter.price, $gte: Number(min) };
  if (max) filter.price = { ...filter.price, $lte: Number(max) };
  if (search) filter.title = { $regex: search, $options: 'i' };
  filter.sold = false;
  try {
    const products = await Product.find(filter)
      .populate('seller', 'name email avatar')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/mine', auth, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const query = { seller: req.user._id };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    res.json({ products, total });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/seller/:sellerId', async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.sellerId })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email avatar')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name avatar' },
      });
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'olx-products',
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const product = new Product({
      title,
      description,
      price,
      category,
      image: imageUrl,
      seller: req.user._id,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    const liked = product.likes.includes(req.user._id);
    if (liked) {
      product.likes.pull(req.user._id);
      req.user.likedProducts.pull(product._id);
    } else {
      product.likes.push(req.user._id);
      req.user.likedProducts.push(product._id);
    }
    await product.save();
    await req.user.save();
    res.json({ liked: !liked, likesCount: product.likes.length });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const comment = new Comment({ user: req.user._id, text });
    await comment.save();
    const product = await Product.findById(req.params.id);
    product.comments.unshift(comment._id);
    await product.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/:id/comments/:commentId/reply', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    comment.replies.push({ user: req.user._id, text });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (!product.seller.equals(req.user._id)) return res.status(403).json({ msg: 'Not authorized' });
    const { title, description, price, category } = req.body;
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, { folder: 'olx-products' });
      product.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (!product.seller.equals(req.user._id)) return res.status(403).json({ msg: 'Not authorized' });
    await product.deleteOne();
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.patch('/:id/sold', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (!product.seller.equals(req.user._id)) return res.status(403).json({ msg: 'Not authorized' });
    product.sold = !product.sold;
    await product.save();
    res.json({ sold: product.sold });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router; 