import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import { deleteProduct } from '../services/ProductServices';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [product, setProduct] = useState(null);
  const [sellerName, setSellerName] = useState('Loading...');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductAndSellerDetails = async () => {
      try {
        const productResponse = await fetch(`https://multivendorapp-products-microservice.onrender.com/${id}`, {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product details');
        }
        const productData = await productResponse.json();
        setProduct(productData);

        if (productData.seller) {
          try {
            const sellerResponse = await fetch(`https://multivendorapp-user-service.onrender.com/product/seller/${productData.seller}`, {
              headers: { Authorization: `Bearer ${authState.token}` },
            });
            if (!sellerResponse.ok) {
              throw new Error('Failed to fetch seller details');
            }
            const sellerData = await sellerResponse.json();
            setSellerName(sellerData.name || 'Name not available');
          } catch {
            setSellerName('Seller name not available');
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch product details');
      }
    };

    fetchProductAndSellerDetails();
  }, [id, authState.token]);

  const handleEditClick = () => navigate(`/edit-product/${id}`);

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id, authState.token);
        alert('Product deleted successfully');
        navigate('/products');
      } catch (err) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
  if (!product) return <p className="text-center text-gray-500 mt-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="container mx-auto max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-xl font-bold text-gray-800 text-center p-6 border-b">
          {product.name}
        </h2>

        <div className="flex flex-col lg:flex-row">
          <img
            src={product.img}
            alt={product.name}
            className="w-full lg:w-1/2 object-cover h-auto"
          />

          <div className="p-6 lg:flex-1">
            <p className="text-gray-700 mb-4">{product.desc}</p>
            <p className="text-lg font-bold text-orange-500 mb-2">Price: ${product.price}</p>
            <p className="text-gray-600 mb-2">Type: {product.type}</p>
            <p className="text-gray-600 mb-2">Available: {product.available ? 'Yes' : 'No'}</p>
            <p className="text-gray-600 mb-2">Stock: {product.stock}</p>
            <p className="text-gray-600 mb-2">Seller: {sellerName}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 p-6 border-t">
          <button
            onClick={handleEditClick}
            className="py-2 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Edit Product
          </button>
          <button
            onClick={handleDeleteClick}
            className="py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
