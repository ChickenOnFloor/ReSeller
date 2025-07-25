import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../api';

const Product = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [reply, setReply] = useState('');
  const [showContact, setShowContact] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        setComments(data.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-modal'));
      return;
    }
    if (!comment.trim()) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ text: comment }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setComment('');
    } catch (err) {}
  };

  const handleReply = async (parentId) => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-modal'));
      return;
    }
    if (!reply.trim()) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}/comments/${parentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ text: reply }),
      });
      if (!res.ok) throw new Error('Failed to add reply');
      const updatedComment = await res.json();
      setComments(comments.map(c => c._id === parentId ? updatedComment : c));
      setReply('');
      setReplyingTo(null);
    } catch (err) {}
  };

  if (loading) return <div className='w-full flex justify-center items-center h-96'>Loading...</div>;
  if (error || !product) return <div className='w-full flex justify-center items-center h-96 text-red-500'>{error || 'Product not found'}</div>;

  return (
    <div className='w-full h-full flex justify-center items-center p-2'>
      <div className='w-full h-full max-w-[900px] border border-gray-200 shadow-lg flex flex-col md:flex-row justify-between gap-4 p-4 bg-white rounded-lg'>
        <div className='w-full md:w-[50%] h-full border border-gray-100 p-4 flex flex-col gap-3 rounded-lg bg-gray-50'>
          <div className='w-full aspect-video bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center'>
            <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
          </div>
          <h1 className='poetsen text-blue-600 text-2xl mt-2 flex items-center gap-3'>
            {product.title}
            {product.sold ? (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded shadow">Sold</span>
            ) : (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded shadow">Available</span>
            )}
          </h1>
          <h2 className='poetsen text-blue-700 text-xl'>Price: <span className='font-normal'>Rs {Number(product.price).toLocaleString()}</span></h2>
          <h3 className='poetsen text-blue-600 text-lg mt-2'>Description</h3>
          <div>
            <pre className='w-full border border-gray-200 rounded p-2 text-base bg-white whitespace-pre-wrap break-words font-sans'>{product.description}</pre>
          </div>
          <div className='mt-6'>
            <h2 className='font-semibold mb-3 text-base'>Comments</h2>
            <form onSubmit={handleSubmit} className='flex gap-2 mb-4'>
              <input
                type='text'
                placeholder={user ? 'Add a comment...' : 'Login to comment'}
                value={comment}
                onChange={e => setComment(e.target.value)}
                className='flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-600 focus:ring-0'
                disabled={!user}
              />
              <button
                type='submit'
                className='bg-blue-600 text-white rounded px-4 py-1 hover:bg-blue-700 border border-blue-600 text-sm transition'
                disabled={!user || !comment.trim()}
              >
                Post
              </button>
            </form>
            <div className='flex flex-col gap-3'>
              {comments.length === 0 && <p className='text-xs text-gray-500'>No comments yet.</p>}
              {comments.map((c) => (
                <div key={c._id} className='border border-gray-200 rounded p-3 bg-gray-50'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='font-semibold text-xs'>{c.user?.name || 'User'}</span>
                    <span className='text-gray-400 text-[10px]'>{new Date(c.date).toLocaleString()}</span>
                  </div>
                  <div className='text-sm mb-2'>{c.text}</div>
                  <div className='flex gap-2'>
                    <button
                      className='text-xs text-blue-600 hover:underline focus:outline-none'
                      onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)}
                    >
                      Reply
                    </button>
                  </div>
                  {c.replies.length > 0 && (
                    <div className='mt-2 pl-4 border-l-2 border-gray-200 flex flex-col gap-2'>
                      {c.replies.map((r) => (
                        <div key={r._id || r.date} className='bg-white border border-gray-100 rounded p-2'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='font-semibold text-xs'>{r.user?.name || 'User'}</span>
                            <span className='text-gray-400 text-[10px]'>{new Date(r.date).toLocaleString()}</span>
                          </div>
                          <div className='text-sm'>{r.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {replyingTo === c._id && (
                    <form
                      onSubmit={e => { e.preventDefault(); handleReply(c._id); }}
                      className='flex gap-2 mt-2'
                    >
                      <input
                        type='text'
                        placeholder='Write a reply...'
                        value={reply}
                        onChange={e => setReply(e.target.value)}
                        className='flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-600 focus:ring-0'
                      />
                      <button type='submit' className='bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700 border border-blue-600 text-sm transition'>Reply</button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='w-full md:w-[50%] flex flex-col gap-4'>
          <div className='p-4 w-full flex flex-col justify-between border border-gray-200 rounded-lg bg-gray-50 shadow'>
            <div className='flex gap-3 justify-start items-center border border-gray-200 rounded p-2 bg-white'>
              <img src={product.seller?.avatar || '/defaultAvatar.png'} alt="" className='object-cover rounded-full w-12 h-12'/>
              <h1 className='text-md font-semibold'>{product.seller?.name || 'Seller'}</h1>
            </div>
            <button
              className='poetsen w-full h-10 rounded bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 mt-4 transition'
              onClick={() => {
                if (!user) {
                  window.dispatchEvent(new CustomEvent('open-auth-modal'));
                  return;
                }
                setShowContact(!showContact);
              }}
            >
              {showContact ? (product.seller?.email || 'No email') : 'Show Contact'}
            </button>
            <button
              className='w-full h-10 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200 mt-2 transition font-semibold'
              onClick={() => navigate(`/seller/${product.seller?._id}/products`)}
              disabled={!product.seller?._id}
            >
              View More Products by Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
