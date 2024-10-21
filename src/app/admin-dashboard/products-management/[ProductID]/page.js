"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CircularProgress from '@mui/material/CircularProgress';
import styles from '../product.module.css';

const ProductDetail = ({ params }) => {
    const { ProductID } = params; // Get ProductID from the route parameters
    const { data: session, status } = useSession();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for error handling

    // Fetch product details
    const fetchProduct = async () => {
        setLoading(true);
        setError(null); // Reset error state before fetching
        try {
            console.log('Fetching product with ID:', ProductID);
            const response = await fetch(`/api/product/${ProductID}`);
            console.log('API Response:', response); // Log the entire response object

            if (!response.ok) {
                throw new Error("Failed to fetch product details");
            }

            const data = await response.json();
            console.log('Product data:', data); // Log the actual data from the response
            setProduct(data); // Update the state with product data
        } catch (error) {
            console.error("Error fetching product details:", error);
            setError("Product not found or failed to load."); // Set user-friendly error message
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    // Use effect to fetch product details when component mounts or ProductID changes
    useEffect(() => {
        console.log('Session:', session);
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchProduct();
        }
    }, [status, session, router, ProductID]);

    // Display loading spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen fixed top-0 left-0 bg-white bg-opacity-80 z-50">
                <CircularProgress />
            </div>
        );
    }

    // Display product details or error message
    return (
        <div className="bg-white w-full h-fit p-4 md:p-6 rounded-xl ">
            <button
                variant="contained"
                onClick={() => router.push('/admin-dashboard/products-management')}
                className="px-4 py-2 bg-white-100 text-black rounded-2xl border-2 border-[#d4d4d4] hover:border-[#4EAC14]"
            >
                กลับ
            </button>
            {error ? (
                <p>{error}</p>
            ) : product ? (
                <>
                    <h1 className='pt-3'>Product Details ID: <strong> {product.ProductID} </strong> </h1>
                    <div >
                        <p><strong>Name:</strong> {product.ProductName}</p>
                        <p><strong>Type:</strong> {product.ProductType}</p>
                        <p><strong>Price:</strong> {product.Price}</p>
                        <p><strong>Amount:</strong> {product.Amount}</p>
                        <p><strong>Sold Count:</strong> {product.soldCount}</p>
                    </div>

                    <h2 className='pt-3'>Farmer Details ID:<strong> {product.farmerId}</strong></h2>
                    {product.farmer ? (
                        <div>
                            <p><strong>Name:</strong> {product.farmer.farmerName}</p>
                            <p><strong>Location:</strong> {product.farmer.location}</p>
                            <p><strong>Contact:</strong> {product.farmer.contactLine}</p>
                        </div>
                    ) : (
                        <p>No farmer information found.</p>
                    )}
                </>
            ) : (
                <p>Product not found</p>
            )}
        </div>
    );
};

export default ProductDetail;
