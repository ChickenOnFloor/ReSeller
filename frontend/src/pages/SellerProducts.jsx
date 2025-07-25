import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import gsap from 'gsap';
import { API_URL } from '../api';

const SellerProducts = () => {
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/products/seller/${sellerId}`);
        if (!res.ok) throw new Error('Failed to fetch seller products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [sellerId]);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.querySelectorAll('.product-card-anim'),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [products]);

  if (loading) return <div className="w-full flex justify-center items-center h-96">Loading...</div>;
  if (error) return <div className="w-full flex justify-center items-center h-96 text-red-500">{error}</div>;

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-50 p-4">
      <h2 className="text-2xl font-bold mb-4">Seller's Products</h2>
      <div ref={gridRef} className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length === 0 && <div className="col-span-full text-gray-500">No products found for this seller.</div>}
        {products.map(product => (
          <div key={product._id} className="relative product-card-anim">
            <Card product={product} />
            {product.sold && (
              <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">SOLD</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProducts; 