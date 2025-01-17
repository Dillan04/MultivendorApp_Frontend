import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../authentication/AuthContext';
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  LogOutIcon,
  ArrowRightIcon,
} from 'lucide-react';
import Cart from '../lists/Cart';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
    },
  },
};

const FeatureCard = ({ icon, title, description, linkTo, linkText }) => (
  <motion.div
    variants={itemVariants}
    className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white border border-gray-200 rounded-lg p-6 space-y-4"
  >
    <div className="flex items-center justify-between">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="bg-orange-100 p-3 rounded-full"
      >
        {icon}
      </motion.div>
      <Link
        to={linkTo}
        className="text-orange-600 hover:text-orange-800 transition-colors flex items-center gap-1 font-semibold"
      >
        {linkText}
        <ArrowRightIcon size={16} className="opacity-70" />
      </Link>
    </div>
    <div>
      <h4 className="text-lg font-bold text-black mb-2">{title}</h4>
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const LoggedOutHome = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-r from-orange-500 to-white text-black flex items-center justify-center"
    >
      <div className="bg-white rounded-lg p-8 shadow-lg max-w-xl w-full text-center">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-4xl font-extrabold mb-6 text-orange-600"
        >
          Welcome to Dee-N
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-10"
        >
          Making everything happen for you. Join in and buy anything you love.
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
              },
            },
          }}
          className="flex justify-center space-x-6"
        >
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  type: 'spring',
                  damping: 12,
                  stiffness: 100,
                },
              },
            }}
          >
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-lg transition hover:bg-orange-700"
            >
              Log In <ArrowRightIcon size={20} />
            </Link>
          </motion.div>
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  type: 'spring',
                  damping: 12,
                  stiffness: 100,
                },
              },
            }}
          >
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-3 bg-gray-200 text-black rounded-lg transition hover:bg-gray-300"
            >
              Sign Up <ArrowRightIcon size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const { authState, dispatch } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authState.isAuthenticated) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://multivendorapp-user-service.onrender.com/profile',
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            dispatch({ type: 'LOGOUT' });
            throw new Error('Session expired. Please log in again.');
          }
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message || 'Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [authState.token, authState.isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  if (!authState.isAuthenticated) {
    return <LoggedOutHome />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-orange-600">
          Welcome to Dee-N Shop, {profile?.name || 'User'}!
        </h1>
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<UserIcon size={24} className="text-orange-600" />}
              title="Your Profile"
              description={`Name: ${profile.name || 'N/A'}\nEmail: ${
                authState.user.email || 'N/A'
              }`}
              linkTo="/view-profile"
              linkText="View Profile"
            />
            <FeatureCard
              icon={<HeartIcon size={24} className="text-orange-600" />}
              title="Wishlist"
              description={`Items in Wishlist: ${
                profile.wishlist?.length || 0
              }`}
              linkTo="/wishlist"
              linkText="View Wishlist"
            />
            <FeatureCard
              icon={<ShoppingCartIcon size={24} className="text-orange-600" />}
              title="Cart"
              description={`Items in Cart: ${profile.cart?.length || 0}`}
              linkTo="/cart"
              linkText="View Cart"
            />
          </div>
        )}
        {authState.isAuthenticated && <Cart />}
        <div className="mt-12 text-center">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-md transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        {error && (
          <div className="mt-6 bg-red-100 text-red-600 p-4 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
