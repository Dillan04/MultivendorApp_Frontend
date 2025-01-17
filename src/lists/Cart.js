import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import { 
  ShoppingCartIcon, 
  PackageIcon,
  ShoppingBasketIcon, 
  CreditCardIcon 
} from 'lucide-react';

const Cart = () => {
    const { authState } = useAuth();
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch cart items on component mount
    useEffect(() => {
        if (authState.isAuthenticated) {
            fetchCart();
        }
    }, [authState.isAuthenticated]);

    // Fetch the user's cart items
    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://multivendorplatform-shopping-service.onrender.com/cart', {
                headers: { Authorization: `Bearer ${authState.token}` },
            });
            const data = await response.json();
            setCart(data);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch cart');
            setLoading(false);
        }
    };

    // Calculate total cart amount
    const calculateTotal = () => {
        return cart.length > 0 
            ? cart[0].items.reduce((total, item) => total + item.product.price * item.amount, 0).toFixed(2)
            : '0.00';
    };

    // Handle placing the order
    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            setError('Your cart is empty. Please add items to the cart.');
            return;
        }

        const orderPayload = {
            items: cart[0].items.map(item => ({
                product: { _id: item.product._id },
                amount: item.amount
            })),
            amount: calculateTotal(),
            status: 'Pending',
        };

        try {
            await fetch('https://multivendorplatform-shopping-service.onrender.com/order', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authState.token}` 
                },
                body: JSON.stringify(orderPayload)
            });
            alert('Order placed successfully!');
            fetchCart();
        } catch (err) {
            setError(err.message || 'Failed to place order');
        }
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="px-6 py-4 bg-white flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <ShoppingCartIcon className="w-8 h-8 text-orange-500" />
                        <h1 className="text-3xl font-bold text-black">Cart</h1>
                        <span className="text-gray-600">{cart.length > 0 ? `${cart[0].items.length} items` : 'Empty'}</span>
                    </div>
                    {error && (
                        <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg">
                            {error}
                        </div>
                    )}
                </div>

                {/* Cart Items */}
                <div className="p-6">
                    {loading ? (
                        <div className="text-center text-gray-500 py-12">
                            Loading cart items...
                        </div>
                    ) : cart.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            <ShoppingBasketIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p>Your cart is empty, kindly purchase something</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart[0].items.map((item) => (
                                <div 
                                    key={item._id} 
                                    className="bg-white rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-50 transition-all border border-gray-200"
                                >
                                    <img 
                                        src={item.product.img} 
                                        alt={item.product.name} 
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-black">{item.product.name}</h3>
                                        <p className="text-gray-600">{item.product.desc}</p>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <span className="text-orange-500 font-semibold">
                                                ${item.product.price.toFixed(2)}
                                            </span>
                                            <span className="text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                                                Units: {item.amount}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xl font-bold text-green-600">
                                            ${(item.product.price * item.amount).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                {cart.length > 0 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <CreditCardIcon className="w-6 h-6 text-orange-500" />
                                <span className="text-xl font-semibold text-black">Total</span>
                            </div>
                            <span className="text-2xl font-bold text-orange-500">
                                ${calculateTotal()}
                            </span>
                        </div>
                        <button 
                            onClick={handlePlaceOrder}
                            className="w-full mt-4 bg-orange-500 text-white py-3 rounded-full 
                            hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                        >
                            <PackageIcon className="w-6 h-6" />
                            <span>Place Your Order</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
