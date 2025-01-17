import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, PlusIcon, MinusIcon, InfoIcon } from 'lucide-react';

const ProductCard = ({
  product,
  isInWishlist,
  isInCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onRemoveFromCart,
  loadingWishlist,
  loadingCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <div
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-md p-4 space-y-4 
      transform transition-all duration-300 hover:scale-105 hover:shadow-lg group relative overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-40 object-cover rounded-md 
          transition-transform duration-300"
        />
        <Link
          to={`/product/${product._id}`}
          className="absolute top-2 right-2 bg-white/20 p-2 rounded 
          hover:bg-white/40 transition-all duration-300"
        >
          <InfoIcon className="w-5 h-5 text-white" />
        </Link>
      </div>

      {/* Product Details */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white truncate">{product.name}</h3>
        <p className="text-white/75 line-clamp-2 text-sm">{product.desc}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-300">${product.price}</span>
          <span className={`text-sm ${product.available ? 'text-green-400' : 'text-red-400'}`}>
            {product.available ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Hover-based Add to Cart */}
      <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center bg-white/10 rounded">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-1.5 hover:bg-white/20 rounded-l"
            >
              <MinusIcon className="w-4 h-4 text-white" />
            </button>
            <span className="px-3 text-white">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="p-1.5 hover:bg-white/20 rounded-r"
            >
              <PlusIcon className="w-4 h-4 text-white" />
            </button>
          </div>
          <button
            onClick={() => onAddToCart(quantity)}
            disabled={loadingCart}
            className="flex items-center justify-center space-x-2 py-1 px-4 bg-blue-600/70 
            text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <span>{loadingCart ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        {/* Wishlist Button */}
        <button
          onClick={isInWishlist ? onRemoveFromWishlist : onAddToWishlist}
          disabled={loadingWishlist}
          className={`flex items-center justify-center space-x-2 py-1.5 px-3 rounded 
          transition-all duration-300 ${
            isInWishlist
              ? 'bg-red-600/70 text-white hover:bg-red-700'
              : 'bg-white/10 text-white hover:bg-white/20'
          } disabled:opacity-50`}
        >
          <HeartIcon className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
          <span>{loadingWishlist ? 'Processing...' : isInWishlist ? 'Remove' : 'Wishlist'}</span>
        </button>

        {/* Cart Button */}
        {isInCart && (
          <button
            onClick={onRemoveFromCart}
            disabled={loadingCart}
            className="flex items-center justify-center space-x-2 py-1.5 px-3 
            bg-red-600/70 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <span>{loadingCart ? 'Processing...' : 'Remove'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
