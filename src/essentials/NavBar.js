import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import { 
  Home, 
  ShoppingCart, 
  Box, 
  PlusSquare, 
  LogOut, 
  User, 
  Menu, 
  X 
} from 'lucide-react';

const PRODUCT_CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Kitchen', 
  'Health & Personal Care', 'Books & Stationery', 
  'Sports & Outdoors', 'Toys & Games', 
  'Beauty & Cosmetics', 'Automotive', 
  'Jewelry & Accessories', 'Groceries & Food', 
  'Baby Products', 'Pet Supplies', 
  'Tools & Hardware', 'Office Supplies', 
  'Musical Instruments', 'Furniture', 
  'Art & Craft', 'Industrial & Scientific', 
  'Video Games', 'Music'
];

const ProductDropdown = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute right-0 mt-2 w-80 bg-white border border-orange-200 shadow-lg rounded-xl z-50"
      onMouseLeave={onClose}
    >
      <div className="grid grid-cols-4 gap-2 p-4 max-h-96 overflow-y-auto">
        {PRODUCT_CATEGORIES.map((category) => (
          <Link 
            key={category} 
            to={`/products/${category.replace(/\s+/g, '-')}`} 
            className="text-xs text-black hover:bg-orange-100 p-2 rounded text-center transition-all duration-200"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
};

const NavBar = () => {
  const { authState, dispatch } = useAuth();
  const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLinks = () => (
    <>
      {authState.isAuthenticated ? (
        <>
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-black hover:bg-orange-100 px-3 py-2 rounded-md transition-all"
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          <div className="relative">
            <button 
              onMouseEnter={() => setProductDropdownOpen(true)}
              className="flex items-center space-x-2 text-black hover:bg-orange-100 px-3 py-2 rounded-md transition-all"
            >
              <Box size={18} />
              <span>Products</span>
            </button>
            <ProductDropdown 
              isOpen={isProductDropdownOpen}
              onClose={() => setProductDropdownOpen(false)}
            />
          </div>

          <Link 
            to="/cart" 
            className="flex items-center space-x-2 text-black hover:bg-orange-100 px-3 py-2 rounded-md transition-all"
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
          </Link>

          <Link 
            to="/add-product" 
            className="flex items-center space-x-2 text-black hover:bg-orange-100 px-3 py-2 rounded-md transition-all"
          >
            <PlusSquare size={18} />
            <span>Add Product</span>
          </Link>

          <Link 
            to="/all-products" 
            className="flex items-center space-x-2 text-black hover:bg-orange-100 px-3 py-2 rounded-md transition-all"
          >
            <PlusSquare size={18} />
            <span>All Products</span>
          </Link>

          <Link 
            to="/view-profile" 
            className="flex items-center space-x-2 text-black hover:bg-orange-100 px-3 py-2 rounded-md transition-all"
          >
            <User size={18} />
            <span>View Profile</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-black hover:bg-orange-100 px-3 py-2 rounded-md transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <>
          <Link to="/login">
            <button className="flex items-center space-x-2 text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md transition-all">
              <User size={18} />
              <span>Login</span>
            </button>
          </Link>
          <Link to="/register">
            <button className="flex items-center space-x-2 text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md transition-all">
              <User size={18} />
              <span>Sign Up</span>
            </button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white p-4 shadow-md relative border-b border-orange-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-orange-500 text-2xl font-bold flex items-center space-x-2">
          <img 
            src="/logo.png" 
            alt="MultiVendorApp" 
            className="h-8 w-8 rounded-full mr-2" 
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          Dee-N
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </div>

        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="text-black focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-orange-300 z-50">
          <div className="flex flex-col space-y-2 p-4">
            <NavLinks />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
