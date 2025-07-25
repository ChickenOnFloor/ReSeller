import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { API_URL } from '../api';
const Card = ({ product }) => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [likesCount, setLikesCount] = useState(product.likes ? product.likes.length : 0);
  const [liked, setLiked] = useState(user && product.likes && product.likes.includes(user.id));
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-modal'));
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`${API_URL}/products/${product._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (err) {
    } finally {
      setLikeLoading(false);
    }
  };

  if (!product) return null;
  return (
    <div className="w-full h-72 max-h-72 border rounded-md overflow-hidden shadow-lg shadow-gray-400 bg-gray-50 flex flex-col">
      <div className="w-full h-32 relative">
        {product.sold ? (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow z-10">Sold</span>
        ) : (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow z-10">Available</span>
        )}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full h-full flex justify-between flex-1 flex-col">
        <div className="px-2 pt-2 flex flex-col justify-center items-start gap-2">
          <h1 className="font-semibold text-sm line-clamp-2 ">{product.title}</h1>
          <h1 className="text-sm bg-gray-200 p-1 rounded text-blue-600">Rs.{Number(product.price).toLocaleString()}</h1>
          <h1 className="text-xs bg-gray-200 p-1 rounded text-blue-600">Category: {product.category}</h1>
        </div>
        <div className="w-full h-12 p-2 flex items-center gap-2">
          <button onClick={() => navigate(`/product/${product._id}`)} className="flex-1 h-full bg-blue-600 text-white rounded hover:bg-white hover:text-blue-600 border font-semibold">
            Show Item
          </button>
          <button
            className={`h-full px-2 flex items-center justify-center rounded ${liked ? 'text-red-500' : 'text-gray-400'} ${likeLoading ? 'opacity-50' : ''}`}
            onClick={handleLike}
            disabled={likeLoading || (user && product.seller === user.id)}
          >
            <FontAwesomeIcon icon={liked ? faSolidHeart : faRegularHeart} size="lg" />
            <span className="ml-1 text-xs">{likesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
