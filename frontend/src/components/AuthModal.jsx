import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { API_URL } from '../api';

const AuthModal = ({ open, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(open);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      if (overlayRef.current && modalRef.current) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
        gsap.fromTo(
          modalRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 }
        );
      }
    } else if (visible) {
      if (overlayRef.current && modalRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => setVisible(false),
        });
        gsap.to(modalRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.3,
        });
      } else {
        setVisible(false);
      }
    }
  }, [open]);

  const validate = () => {
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    if (/\s/.test(password)) {
      setError('Password must not contain spaces.');
      return false;
    }
    return true;
  };

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        ref={modalRef}
        className="bg-white rounded shadow-lg p-8 w-full max-w-sm relative"
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">&times;</button>
        <h2 className="text-xl font-bold mb-4">{mode === 'login' ? 'Login' : 'Register'}</h2>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <form onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          if (!validate()) return;
          setLoading(true);
          try {
            const body = mode === 'register' ? { name, email, password } : { email, password };
            const res = await fetch(`${API_URL}/auth/${mode}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Auth failed');
            localStorage.setItem('token', data.token);
            onAuthSuccess && onAuthSuccess(data.token, data.user);
            onClose();
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }} className="flex flex-col gap-3">
          {mode === 'register' && (
            <input type="text" placeholder="Name" className="border p-2 rounded" value={name} onChange={e => setName(e.target.value)} required />
          )}
          <input type="email" placeholder="Email" className="border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700" disabled={loading}>{loading ? (mode === 'login' ? 'Logging in...' : 'Registering...') : (mode === 'login' ? 'Login' : 'Register')}</button>
        </form>
        <div className="mt-4 text-sm text-center">
          {mode === 'login' ? (
            <>Don't have an account? <button className="text-blue-600 hover:underline" onClick={() => setMode('register')}>Register</button></>
          ) : (
            <>Already have an account? <button className="text-blue-600 hover:underline" onClick={() => setMode('login')}>Login</button></>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 