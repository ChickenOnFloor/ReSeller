import { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import Card from '../components/Card'
import gsap from 'gsap'

const sortOptions = [
  { label: 'Newest', value: 'createdAt-desc' },
  { label: 'Oldest', value: 'createdAt-asc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
]

const Home = () => {
  const [searchInput, setSearchInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('All');
  const [sortInput, setSortInput] = useState('createdAt-desc');
  const [priceRangeInput, setPriceRangeInput] = useState(['', '']);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('createdAt-desc');
  const [priceRange, setPriceRange] = useState(['', '']);
  const [sortDropdown, setSortDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const productGridRef = useRef(null);
  const [categoryDropdown, setCategoryDropdown] = useState(false)
  const categoryOptions = ['All', 'Mobiles', 'Cosmetics', 'Toys', 'Bikes'];
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const [sortBy, order] = sort.split('-');
        let url = `http://localhost:5000/api/products?sortBy=${sortBy}&order=${order}`;
        if (category !== 'All') url += `&category=${encodeURIComponent(category)}`;
        if (priceRange[0] !== '') url += `&min=${priceRange[0]}`;
        if (priceRange[1] !== '') url += `&max=${priceRange[1]}`;
        if (search.trim() !== '') url += `&search=${encodeURIComponent(search.trim())}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError('API offline or error fetching products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [sort, category, priceRange, search]);

  useEffect(() => {
    if (productGridRef.current) {
      gsap.fromTo(
        productGridRef.current.querySelectorAll('.product-card-anim'),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [products]);

  return (
    <div className='w-full h-full bg-gray-50 min-h-screen'>
      <div className='w-full h-16 bg-gray-50 flex justify-center items-center border-b'>
        <div className='w-full max-w-[400px] flex justify-center items-center gap-1 px-2'>
          <input
            type='text'
            className='border border-gray-300 rounded w-full h-9 outline-blue-600 pl-2'
            placeholder='Mobile, Bikes...'
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setSearch(searchInput.trim()); } }}
          />
          <button className='w-14 h-9 border border-gray-300 bg-blue-600 text-white rounded hover:text-blue-600 hover:bg-white'
            onClick={() => setSearch(searchInput.trim())}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </div>
      <div className='w-full h-auto p-2 md:p-4 flex flex-col md:flex-row gap-4 justify-center items-stretch'>
        <div className='w-full md:w-[200px] max-w-full md:max-w-[200px] border border-gray-300 rounded p-2 flex flex-col gap-2 md:h-screen md:max-h-[1080px] self-start bg-white sticky top-0 z-10'>
          <div
            className='min-w-[140px] md:w-full border border-gray-300 rounded bg-white h-10 md:h-7 text-sm px-2 flex items-center poetsen relative text-gray-500 cursor-pointer flex-shrink-0'
            onClick={() => setSortDropdown(!sortDropdown)}
          >
            <span className='truncate'>Sort By: {sortOptions.find(opt => opt.value === sortInput)?.label || 'Sort'}</span>
            <FontAwesomeIcon icon={faCaretDown} className='absolute right-1 text-black' />
          </div>
          {sortDropdown && (
          <div className='absolute mt-10 md:static md:mt-0 w-[140px] md:w-full border border-gray-300 rounded bg-white text-sm poetsen overflow-hidden z-20'>
            {sortOptions.map(opt => (
              <div
                key={opt.value}
                className={`w-full h-7 flex justify-start items-center px-2 border-b border-gray-300 cursor-pointer ${
                  sortInput === opt.value ? 'bg-blue-100' : ''
                }`}
                onClick={() => {
                  setSortInput(opt.value)
                  setSortDropdown(false)
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
          )}

          <div
            className='min-w-[140px] md:w-full border border-gray-300 rounded bg-white h-10 md:h-7 text-sm px-2 flex items-center poetsen relative text-gray-500 cursor-pointer flex-shrink-0'
            onClick={() => setCategoryDropdown(!categoryDropdown)}
          >
            <span className='truncate'>Category: {categoryInput === 'All' ? 'All' : categoryInput}</span>
            <FontAwesomeIcon icon={faCaretDown} className='absolute right-1 text-black' />
          </div>
          {categoryDropdown && (
            <div className='absolute mt-10 md:static md:mt-0 w-[140px] md:w-full border border-gray-300 rounded bg-white text-sm poetsen overflow-hidden z-20'>
              {categoryOptions.map(cat => (
                <div
                  key={cat}
                  className={`w-full h-7 flex justify-start items-center px-2 border-b border-gray-300 cursor-pointer ${
                    categoryInput === cat ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => {
                    setCategoryInput(cat);
                    setCategoryDropdown(false);
                  }}
                >
                  {cat === 'All' ? 'All Categories' : cat}
                </div>
              ))}
            </div>
          )}

          <div className='w-full h-auto border border-gray-300 rounded bg-white h-7 text-sm p-2 flex items-center poetsen relative text-gray-500 gap-1 flex-col md:flex-col '>
            <span>Price:</span>
            <div className='flex flex-row w-full gap-1'>
              <input
                type="number"
                className="w-1/2 border rounded px-1"
                value={priceRangeInput[0]}
                min={0}
                placeholder="Min"
                onChange={e => setPriceRangeInput([e.target.value, priceRangeInput[1]])}
              />
              <span className='mx-1'>-</span>
              <input
                type="number"
                className="w-1/2 border rounded px-1"
                value={priceRangeInput[1]}
                min={0}
                placeholder="Max"
                onChange={e => setPriceRangeInput([priceRangeInput[0], e.target.value])}
              />
            </div>
          </div>
         <button
           className='w-full mt-2 bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition font-semibold'
           onClick={() => {
             setCategory(categoryInput);
             setSort(sortInput);
             setPriceRange(priceRangeInput);
           }}
         >
           Apply Filters
         </button>
        </div>
        <div ref={productGridRef} className='w-full max-w-full md:max-w-[1000px] border border-gray-300 rounded overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 self-start bg-white'>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className='text-orange-500'>{error}</div>
          ) : products.length === 0 ? (
            <div>No products found.</div>
          ) : (
            products.map(product => <div key={product._id} className='product-card-anim'><Card product={product} /></div>)
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
