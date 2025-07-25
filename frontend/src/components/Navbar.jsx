import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import AuthModal from './AuthModal';
import AccountSettingsModal from './AccountSettingsModal';
import { useAuth } from '../context/AuthContext';

const getShortName = (name) => {
  if (!name) return '';
  const words = name.split(' ').slice(0, 2).join(' ');
  return words.length > 16 ? words.slice(0, 16) + '...' : words;
};

const Navbar = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navRef = React.useRef(null);
  const logoRef = React.useRef(null);
  const sellRef = React.useRef(null);
  const userRef = React.useRef(null);
  const itemsRef = React.useRef([]);
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handler = () => setAuthOpen(true);
    window.addEventListener('open-auth-modal', handler);
    return () => window.removeEventListener('open-auth-modal', handler);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleSell = () => {
    if (user) {
      navigate('/upload');
    } else {
      setAuthOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <>
      <nav ref={navRef} className="w-full bg-white shadow-lg border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to='/' className='text-blue-600 text-3xl font-bold poetsen tracking-wider'>ReSeller</Link>
            </div>
            <div className="hidden md:flex md:items-center md:gap-4">
              <button ref={el => itemsRef.current[1] = el} onClick={handleSell} className='bg-blue-600 text-white font-semibold rounded px-4 py-2 hover:bg-blue-700 transition flex items-center'>SELL</button>
              {loading ? null : user ? (
                <div className="relative" ref={el => itemsRef.current[2] = el}>
                  <button
                    onClick={() => setDropdownOpen((open) => !open)}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 transition focus:outline-none border border-blue-200"
                  >
                    {user.avatar ? <img src={user.avatar} alt='avatar' className='w-9 h-9 rounded-full object-cover' /> : <img src='/defaultAvatar.png' alt='avatar' className='w-9 h-9 rounded-full object-cover' />}
                    <span className='font-semibold text-blue-600'>{getShortName(user.name)}</span>
                    <svg className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-50 flex flex-col">
                      <Link to='/my-products' className='px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-t transition' onClick={() => setDropdownOpen(false)}>My Products</Link>
                      <Link to='/liked-products' className='px-4 py-2 text-blue-600 hover:bg-blue-100 transition' onClick={() => setDropdownOpen(false)}>Liked Products</Link>
                      <button onClick={() => { setSettingsOpen(true); setDropdownOpen(false); }} className='px-4 py-2 text-blue-600 hover:bg-blue-100 transition text-left'>Account</button>
                      <button onClick={handleLogout} className='px-4 py-2 text-red-600 hover:bg-red-100 rounded-b text-left transition'>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <button ref={el => itemsRef.current[2] = el} onClick={() => setAuthOpen(true)} className='bg-blue-600 text-white font-semibold rounded px-4 py-2 hover:bg-blue-700 transition'>LOGIN</button>
              )}
            </div>
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenu}
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  {mobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-white border-t shadow-lg" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col">
              <button onClick={handleSell} className='w-full bg-blue-600 text-white font-semibold rounded px-4 py-2 hover:bg-blue-700 transition flex items-center justify-center mb-1'>SELL</button>
              {user ? (
                <>
                  <Link to='/my-products' className='block text-blue-600 font-semibold px-3 py-2 rounded hover:bg-blue-100 transition' onClick={() => setMobileMenu(false)}>My Products</Link>
                  <Link to='/liked-products' className='block text-blue-600 font-semibold px-3 py-2 rounded hover:bg-blue-100 transition' onClick={() => setMobileMenu(false)}>Liked Products</Link>
                  <button onClick={() => { setSettingsOpen(true); setMobileMenu(false); }} className='w-full border border-gray-300 h-9 rounded bg-white text-blue-600 font-semibold hover:bg-blue-600 hover:text-white px-3 transition mb-1'>Account</button>
                  <button onClick={handleLogout} className='w-full text-red-600 font-semibold rounded px-4 py-2 hover:bg-red-100 transition mb-1 text-left'>Logout</button>
                  <span className='block font-semibold text-blue-600 px-3'>{getShortName(user.name)}</span>
                  {user.avatar ? <img src={user.avatar} alt='avatar' className='w-9 h-9 rounded-full object-cover mx-3 my-2' /> : <img src='/defaultAvatar.png' alt='avatar' className='w-9 h-9 rounded-full object-cover mx-3 my-2' />}
                </>
              ) : (
                <button onClick={() => { setAuthOpen(true); setMobileMenu(false); }} className='w-full bg-blue-600 text-white font-semibold rounded px-4 py-2 hover:bg-blue-700 transition mb-1'>LOGIN</button>
              )}
            </div>
          </div>
        )}
      </nav>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={login} />
      <AccountSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} user={user} onUserUpdate={login} />
    </>
  )
}

export default Navbar