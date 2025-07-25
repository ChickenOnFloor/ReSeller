import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Product from './pages/Product'
import ProductUpload from './pages/ProductUpload'
import MyProducts from './pages/MyProducts'
import SellerProducts from './pages/SellerProducts'
import LikedProducts from './pages/LikedProducts';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className='bg-gray-50 min-h-screen w-full max-w-[1920px]'>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/product/:id' element={<Product />} />
            <Route path='/upload' element={<ProductUpload />} />
            <Route path='/my-products' element={<MyProducts />} />
            <Route path='/liked-products' element={<LikedProducts />} />
            <Route path='/seller/:sellerId/products' element={<SellerProducts />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App