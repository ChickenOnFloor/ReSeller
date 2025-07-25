import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import axios from 'axios';
import { API_URL } from '../api';

const ProductUpload = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Mobiles');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/', { state: { openAuth: true } });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(image);
    } else {
      setImagePreview(null);
    }
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('image', image);
      const res = await axios.post(`${API_URL}/products`, formData, {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });
      setSuccess('Product uploaded successfully!');
      setTitle(''); setDescription(''); setPrice(''); setCategory(''); setImage(null); setImagePreview(null);
      setUploadProgress(0);
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  const previewProduct = {
    _id: 'preview',
    title: title || 'Product Title',
    price: price || 0,
    category: category || 'Category',
    image: imagePreview || 'https://via.placeholder.com/300x200?text=Preview',
    likes: [],
  };

  return (
    <div className="w-full flex flex-col items-center min-h-screen bg-gray-50">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-2">Upload Product</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <input type="text" placeholder="Title" className="border p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Description" className="border p-2 rounded" value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="number" placeholder="Price" className="border p-2 rounded" value={price} onChange={e => setPrice(e.target.value)} required />
        <select className="border p-2 rounded" value={category} onChange={e => setCategory(e.target.value)} required>
          <option value="Mobiles">Mobiles</option>
          <option value="Cosmetics">Cosmetics</option>
          <option value="Toys">Toys</option>
          <option value="Bikes">Bikes</option>
        </select>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded p-4 cursor-pointer hover:bg-blue-50 transition">
          <span className="text-blue-600 font-semibold mb-2">{image ? image.name : 'Click to select product image'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => setImage(e.target.files[0])} required />
        </label>
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
            <div className="bg-blue-500 h-3" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
        <button type="submit" className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700" disabled={loading}>{loading ? `Uploading... (${uploadProgress}%)` : 'Upload'}</button>
      </form>
      <div className="mt-8 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Preview</h3>
        <Card product={previewProduct} />
      </div>
    </div>
  );
};

export default ProductUpload; 