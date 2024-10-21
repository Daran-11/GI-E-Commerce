"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CircularProgress from '@mui/material/CircularProgress';
import styles from '../user.module.css';

const UserDetail = ({ params }) => {
    const { userId } = params;  // Get user ID from the route parameters
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for error handling

    // Fetch the user details
    const fetchUser = async () => {
        setLoading(false);
        setError(null); // Reset error state before fetching
        try {
            console.log('Fetching user with ID:', userId);
            const response = await fetch(`/api/users/${userId}`);
            console.log('API Response:', response); // Log the entire response object

            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }

            const data = await response.json();
            console.log('User data:', data); // Log the actual data from the response
            setUser(data); // Update the state with user data
        } catch (error) {
            console.error("Error fetching user details:", error);
            setError("User not found or failed to load."); // Set user-friendly error message
        }
    };

    // Use effect to fetch user details when component mounts
    useEffect(() => {
        console.log('Session:', session);
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role === 'admin') {
                fetchUser();
            }
        }
    }, [status, session, router, userId]);

    // Display loading spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen fixed top-0 left-0 bg-white bg-opacity-80 z-50">
                <CircularProgress />
            </div>
        );
    }

    // Display user details or error message
    return (
        <div className="bg-white w-full h-fit p-4 md:p-6 rounded-xl ">
            <button
                variant="contained"
                onClick={() => router.push('/admin-dashboard/user-management')}
                className="px-4 py-2 bg-white-100 text-black rounded-2xl border-2 border-\[\#d4d4d4\]  hover:border-[#4EAC14]"

            >
                กลับ
            </button>
            {error ? (
                <p>{error}</p>
            ) : user ? (
                <>
                    <h1 className=' pt-3'>User Details ID: <strong>{user.id}</strong> </h1>
                    <div className={styles.detail}>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                        <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
                    </div>


                    <h2 className=' pt-3'>Addresses</h2>
                    {user.Addresses && user.Addresses.length > 0 ? (
                        <ul className={styles.addressList}>
                            {user.Addresses.map((address) => (
                                <li key={address.id} className={styles.addressItem}>
                                    <p><strong>Address Line:</strong> {address.addressLine}</p>
                                    <p><strong>Postal Code:</strong> {address.postalCode}</p>
                                    <p><strong>Province:</strong> {address.province.name_th} ({address.province.name_en})</p>
                                    <p><strong>Amphoe:</strong> {address.amphoe.name_th} ({address.amphoe.name_en})</p>
                                    <p><strong>Tambon:</strong> {address.tambon.name_th} ({address.tambon.name_en})</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No addresses found.</p>
                    )}
                </>
            ) : (
                <p>User not found</p>
            )}
        </div>
    );
};

export default UserDetail;
