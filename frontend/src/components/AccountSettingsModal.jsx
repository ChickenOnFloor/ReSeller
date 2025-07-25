import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';

const AccountSettingsModal = ({ open, onClose, user, onUserUpdate }) => {
  const [phone, setPhone] = useState(user?.settings?.phone || '');
  const [address, setAddress] = useState(user?.settings?.address || '');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const saveBtnRef = useRef(null);
  const uploadBtnRef = useRef(null);
  const closeBtnRef = useRef(null);
  const { token, fetchUser } = useAuth();

  useEffect(() => {
    if (open && overlayRef.current && modalRef.current) {
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
  }, [open]);

  const animateBtn = (ref) => {
    if (ref.current) {
      gsap.fromTo(ref.current, { scale: 1 }, { scale: 0.95, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.inOut' });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded shadow-lg p-8 w-full max-w-sm relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <button ref={closeBtnRef} onClick={() => { animateBtn(closeBtnRef); onClose(); }} className="absolute top-2 right-2 text-gray-500 hover:text-black">&times;</button>
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError('');
              setSuccess('');
              try {
                const res = await fetch(`${API_URL}/user/settings`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                  },
                  body: JSON.stringify({ phone, address }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || 'Update failed');
                setSuccess('Settings updated!');
                fetchUser(token);
              } catch (err) {
                setError(err.message);
              } finally {
                setLoading(false);
              }
            }} className="flex flex-col gap-3 mb-4">
              <input type="text" placeholder="Phone" className="border p-2 rounded" value={phone} onChange={e => setPhone(e.target.value)} />
              <input type="text" placeholder="Address" className="border p-2 rounded" value={address} onChange={e => setAddress(e.target.value)} />
              <button ref={saveBtnRef} type="submit" className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700" disabled={loading} onClick={() => animateBtn(saveBtnRef)}>{loading ? 'Saving...' : 'Save Settings'}</button>
            </form>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError('');
              setSuccess('');
              try {
                const formData = new FormData();
                formData.append('avatar', avatar);
                const res = await fetch(`${API_URL}/user/avatar`, {
                  method: 'PUT',
                  headers: {
                    'Authorization': 'Bearer ' + token,
                  },
                  body: formData,
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || 'Avatar update failed');
                setSuccess('Avatar updated!');
                fetchUser(token);
              } catch (err) {
                setError(err.message);
              } finally {
                setLoading(false);
              }
            }} className="flex flex-col gap-3">
              <label className="font-semibold">Update Avatar</label>
              <input type="file" accept="image/*" className="border p-2 rounded" onChange={e => setAvatar(e.target.files[0])} required />
              <button ref={uploadBtnRef} type="submit" className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700" disabled={loading} onClick={() => animateBtn(uploadBtnRef)}>{loading ? 'Uploading...' : 'Upload Avatar'}</button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AccountSettingsModal; 