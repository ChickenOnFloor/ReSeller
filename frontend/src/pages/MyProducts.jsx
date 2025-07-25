import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import gsap from 'gsap';
import { API_URL } from '../api';

const PAGE_SIZE = 6;

const MyProducts = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '', price: '', category: '' });
  const [editImage, setEditImage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showSold, setShowSold] = useState(false);
  const gridRef = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/products/mine`, {
        headers: { 'Authorization': 'Bearer ' + token },
        params: { search, page, limit: PAGE_SIZE },
      });
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      setError('Failed to fetch your products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) fetchProducts();
  }, [user, token, search, page]);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.querySelectorAll('.product-card-anim'),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [products]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { 'Authorization': 'Bearer ' + token },
      });
      fetchProducts();
    } catch (err) {
      alert('Delete failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSold = async (id) => {
    setActionLoading(true);
    try {
      const res = await axios.patch(`${API_URL}/products/${id}/sold`, {}, {
        headers: { 'Authorization': 'Bearer ' + token },
      });
      setProducts(products.map(p => p._id === id ? { ...p, sold: res.data.sold } : p));
    } catch (err) {
      alert('Failed to update sold status');
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);
    setEditData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
    });
    setEditImage(null);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditImage = (e) => {
    setEditImage(e.target.files[0]);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', editData.title);
      formData.append('description', editData.description);
      formData.append('price', editData.price);
      formData.append('category', editData.category);
      if (editImage) formData.append('image', editImage);
      const res = await axios.put(`${API_URL}/products/${editId}`, formData, {
        headers: { 'Authorization': 'Bearer ' + token },
      });
      setProducts(products.map(p => p._id === editId ? res.data : p));
      setEditId(null);
    } catch (err) {
      alert('Edit failed');
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (loading) return <div className="w-full flex justify-center items-center h-96">Loading...</div>;
  if (error) return <div className="w-full flex justify-center items-center h-96 text-red-500">{error}</div>;

  return (
    <div className="w-full flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <h2 className="text-2xl font-bold mb-4">My Products</h2>
      <div className="w-full max-w-2xl flex flex-col gap-4 mb-4">
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="Search by title or category..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <button
          className={`self-end px-3 py-1 rounded border text-sm font-semibold transition ${showSold ? 'bg-blue-600 text-white' : 'bg-gray-200 text-blue-600'}`}
          onClick={() => setShowSold(s => !s)}
        >
          {showSold ? 'Hide Sold' : 'Show Sold'}
        </button>
      </div>
      {products.length === 0 && <div>You have not uploaded any products yet.</div>}
      <div className="w-full max-w-2xl flex flex-col gap-6" ref={gridRef}>
        {products
          .filter(p => showSold ? true : !p.sold)
          .map(product => (
          <div key={product._id} className="border rounded p-4 bg-white shadow flex flex-col gap-2 product-card-anim">
            <Card product={product} />
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => startEdit(product)} disabled={actionLoading}>Edit</button>
              <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(product._id)} disabled={actionLoading}>Delete</button>
              <button className={`px-3 py-1 rounded ${product.sold ? 'bg-gray-400' : 'bg-green-600 text-white'}`} onClick={() => handleSold(product._id)} disabled={actionLoading}>{product.sold ? 'Mark as Unsold' : 'Mark as Sold'}</button>
            </div>
            {editId === product._id && (
              <form className="flex flex-col gap-2 mt-2 bg-gray-50 p-2 rounded" onSubmit={handleEditSubmit}>
                <input type="text" name="title" value={editData.title} onChange={handleEditChange} className="border p-2 rounded" placeholder="Title" required />
                <textarea name="description" value={editData.description} onChange={handleEditChange} className="border p-2 rounded" placeholder="Description" required />
                <input type="number" name="price" value={editData.price} onChange={handleEditChange} className="border p-2 rounded" placeholder="Price" required />
                <select name="category" value={editData.category} onChange={handleEditChange} className="border p-2 rounded" required>
                  <option value="Mobiles">Mobiles</option>
                  <option value="Cosmetics">Cosmetics</option>
                  <option value="Toys">Toys</option>
                  <option value="Bikes">Bikes</option>
                </select>
                <input type="file" accept="image/*" onChange={handleEditImage} className="border p-2 rounded" />
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded" disabled={actionLoading}>Save</button>
                  <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditId(null)} disabled={actionLoading}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex gap-2 mt-6">
          <button
            className="px-3 py-1 rounded border"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded border ${page === idx + 1 ? 'bg-blue-600 text-white' : ''}`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded border"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
