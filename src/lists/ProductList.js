import React, { useEffect, useState } from 'react';
import { useAuth } from '../authentication/AuthContext';
import { Link } from 'react-router-dom';
import { fetchProducts, updateLocalStorageWishlist, updateLocalStorageCart, addToWishlist, removeFromWishlist, addToCart, removeFromCart } from '../services/ProductServices';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  PlusIcon, 
  MinusIcon, 
  InfoIcon 
} from 'lucide-react';

const ProductCard = ({ 
  product, 
  isInWishlist, 
  isInCart, 
  onAddToWishlist, 
  onRemoveFromWishlist, 
  onAddToCart, 
  onRemoveFromCart,
  loadingWishlist,
  loadingCart 
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6 space-y-4 transform transition-all duration-300 
    hover:scale-105 hover:shadow-xl group relative overflow-hidden">
      {/* Product Image */}
      <div className="relative">
        <img 
          src={product.img} 
          alt={product.name} 
          className="w-full h-48 object-cover rounded-lg 
          group-hover:scale-110 transition-transform duration-300"
        />
        <Link 
          to={`/product/${product._id}`} 
          className="absolute top-2 right-2 bg-white p-2 rounded-full 
          hover:bg-gray-200 transition-all duration-300"
        >
          <InfoIcon className="w-5 h-5 text-black" />
        </Link>
      </div>

      {/* Product Details */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-black truncate">{product.name}</h3>
        <p className="text-black/75 line-clamp-2">{product.desc}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-orange-500">${product.price}</span>
          <span className={`text-sm ${product.available ? 'text-green-500' : 'text-red-500'}`}>
            {product.available ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {/* Wishlist Button */}
        <button
          onClick={isInWishlist ? onRemoveFromWishlist : onAddToWishlist}
          disabled={loadingWishlist}
          className={`flex items-center justify-center space-x-2 py-2 rounded-full 
          transition-all duration-300 ${
            isInWishlist 
              ? 'bg-orange-500 text-white hover:bg-orange-600' 
              : 'bg-white/10 text-black hover:bg-gray-200'
          } 
          disabled:opacity-50`}
        >
          <HeartIcon 
            className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} 
          />
          <span>{loadingWishlist ? 'Processing...' : (isInWishlist ? 'Remove' : 'Wishlist')}</span>
        </button>

        {/* Cart Button */}
        {isInCart ? (
          <button
            onClick={onRemoveFromCart}
            disabled={loadingCart}
            className="flex items-center justify-center space-x-2 py-2 
            bg-orange-500 text-white rounded-full hover:bg-orange-600 
            disabled:opacity-50"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <span>{loadingCart ? 'Processing...' : 'Remove'}</span>
          </button>
        ) : (
          <div className="grid grid-cols-[auto,1fr] gap-2">
            <div className="flex items-center bg-white/10 rounded-full">
              <button 
                onClick={() => handleQuantityChange(-1)}
                className="p-2 hover:bg-white/20 rounded-l-full"
              >
                <MinusIcon className="w-4 h-4 text-black" />
              </button>
              <span className="px-3 text-black">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)}
                className="p-2 hover:bg-white/20 rounded-r-full"
              >
                <PlusIcon className="w-4 h-4 text-black" />
              </button>
            </div>
            <button
              onClick={() => onAddToCart(quantity)}
              disabled={loadingCart}
              className="flex items-center justify-center space-x-2 py-2 
              bg-orange-500 text-white rounded-full hover:bg-orange-600 
              disabled:opacity-50"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span>{loadingCart ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductList = () => {
  const { authState } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  const [loadingWishlist, setLoadingWishlist] = useState(new Map());
  const [loadingCart, setLoadingCart] = useState(new Map());

  // Initialize wishlist and cart from localStorage
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(new Set(Array.isArray(storedWishlist) ? storedWishlist : []));
  
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(new Set(Array.isArray(storedCart) ? storedCart : []));
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProductsFromService = async () => {
      try {
        const data = await fetchProducts(authState.token);
        console.log('Fetched Products:', data);
        setProducts(data);
      } catch (error) {
        setError(error.message || 'Failed to fetch products');
      }
    };

    fetchProductsFromService();
  }, [authState.token]); 

  // Save wishlist to localStorage
  const updateLocalStorageWishlistFromService = (updatedWishlist) => {
    updateLocalStorageWishlist(updatedWishlist);
  };

  // Save cart to localStorage
  const updateLocalStorageCartFromService = (updatedCart) => {
    updateLocalStorageCart(updatedCart);
  };

  // Add product to wishlist
  const addToWishlistFromService = async (productId) => {
    setLoadingWishlist((prev) => new Map(prev).set(productId, true));
    try {
      const response = await addToWishlist(productId, authState.token);
      console.log('Product added to wishlist:', response.data);
      setWishlist((prev) => {
        const updatedWishlist = new Set(prev).add(productId);
        updateLocalStorageWishlistFromService(updatedWishlist);
        return updatedWishlist;
      });
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
    } finally {
      setLoadingWishlist((prev) => {
        const updatedLoading = new Map(prev);
        updatedLoading.delete(productId);
        return updatedLoading;
      });
    }
  };

  // Remove product from wishlist
  const removeFromWishlistFromService = async (productId) => {
    setLoadingWishlist((prev) => new Map(prev).set(productId, true));
    try {
      const response = await removeFromWishlist(productId, authState.token);
      console.log('Product removed from wishlist:', response.data);
      setWishlist((prev) => {
        const updatedWishlist = new Set(prev);
        updatedWishlist.delete(productId);
        updateLocalStorageWishlistFromService(updatedWishlist);
        return updatedWishlist;
      });
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
    } finally {
      setLoadingWishlist((prev) => {
        const updatedLoading = new Map(prev);
        updatedLoading.delete(productId);
        return updatedLoading;
      });
    }
  };

  // Add product to cart with quantity
  const addToCartFromService = async (productId, quantity) => {
    setLoadingCart((prev) => new Map(prev).set(productId, true));
    try {
      const response = await addToCart(productId, quantity, authState.token);
      console.log('Product added to cart:', response.data);
      setCart((prev) => {
        const updatedCart = new Set(prev).add(productId);
        updateLocalStorageCartFromService(updatedCart);
        return updatedCart;
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    } finally {
      setLoadingCart((prev) => {
        const updatedLoading = new Map(prev);
        updatedLoading.delete(productId);
        return updatedLoading;
      });
    }
  };

  // Remove product from cart
  const removeFromCartFromService = async (productId) => {
    setLoadingCart((prev) => new Map(prev).set(productId, true));
    try {
      const response = await removeFromCart(productId, authState.token);
      console.log('Product removed from cart:', response.data);
      setCart((prev) => {
        const updatedCart = new Set(prev);
        updatedCart.delete(productId);
        updateLocalStorageCartFromService(updatedCart);
        return updatedCart;
      });
    } catch (error) {
      console.error('Error removing product from cart:', error);
    } finally {
      setLoadingCart((prev) => {
        const updatedLoading = new Map(prev);
        updatedLoading.delete(productId);
        return updatedLoading;
      });
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-6 relative overflow-hidden">
      {/* Decorative Blurred Circles */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/30 rounded-full blur-3xl"></div>

      <div className="container mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 
        bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-black">
          Shop Products
        </h1>

        {error && (
          <div className="bg-red-600/30 text-white p-4 rounded-lg text-center mb-4">
            {error}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center text-black/75">
            No products available at the moment...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isInWishlist={wishlist.has(product._id)}
                isInCart={cart.has(product._id)}
                onAddToWishlist={() => addToWishlistFromService(product._id)}
                onRemoveFromWishlist={() => removeFromWishlistFromService(product._id)}
                onAddToCart={(quantity) => addToCartFromService(product._id, quantity)}
                onRemoveFromCart={() => removeFromCartFromService(product._id)}
                loadingWishlist={loadingWishlist.get(product._id)}
                loadingCart={loadingCart.get(product._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
