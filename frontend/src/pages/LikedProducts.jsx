import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { API_URL } from '../api';

const LikedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLikedProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/user/liked-products`, {
          headers: { 'Authorization': 'Bearer ' + token },
        });
        if (!res.ok) throw new Error('Failed to fetch liked products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message || 'Error fetching liked products');
      }
      setLoading(false);
    };
    fetchLikedProducts();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Liked Products</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div>No liked products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <Card key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedProducts; 