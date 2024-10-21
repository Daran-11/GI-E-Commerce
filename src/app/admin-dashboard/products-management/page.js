"use client";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import styles from "@/app/ui/dashboard/products/products.module.css";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const ProductManagement = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 10; // Number of items per page
    const [dialogOpen, setDialogOpen] = useState(false); // For add/edit product dialog
    const [newProduct, setNewProduct] = useState({ name: '', price: 0 }); // New product state

    // Fetch products data
    const fetchProducts = async () => {
        setLoading(false); // Set loading state before fetching
        try {
            const response = await fetch(`/api/product`);
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            setProducts(data || []); // Adjust to match your API response
            setTotalItems(data.length);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    // Handle product deletion
    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`/api/products/${productId}/delete`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    setProducts(products.filter(product => product.id !== productId));
                } else {
                    alert("Failed to delete product");
                }
            } catch (error) {
                console.error("Failed to delete product:", error);
            }
        }
    };

    // Open dialog to add product
    const handleAddProduct = () => {
        setNewProduct({ name: '', price: 0 }); // Reset form
        setDialogOpen(true);
    };

    // Close dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    // Handle adding a new product
    const handleSaveProduct = async () => {
        if (!newProduct.name || newProduct.price <= 0) {
            alert("Name and price are required!");
            return;
        }

        try {
            const response = await fetch(`/api/products/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct),
            });

            if (response.ok) {
                const savedProduct = await response.json();
                setProducts([...products, savedProduct]);
                setDialogOpen(false); // Close the dialog
                await fetchProducts(); // Refresh product list after addition
            } else {
                alert("Failed to save product");
            }
        } catch (error) {
            console.error("Failed to save product:", error);
        }
    };

    // Use effect for fetching products on session change
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && session?.user?.id) {
            fetchProducts(); // Fetch products when authenticated
        }
    }, [status, session, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen fixed top-0 left-0 bg-white bg-opacity-80 z-50">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Tooltip title="Add Product" arrow>
                    <IconButton aria-label="add" onClick={handleAddProduct} size="large">
                        <AddBoxIcon fontSize="inherit" style={{ color: "#388e3c" }} />
                    </IconButton>
                </Tooltip>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Name</td>
                        <td>Type</td>
                        <td>Price</td>
                        <td>Amount</td>
                        <td>Soldcount</td>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map(product => (
                            <tr key={product.ProductID}>
                                <td>{product.ProductID}</td>
                                <td>{product.ProductName}</td>
                                <td>{product.ProductType}</td>
                                <td>฿{product.Price}</td>
                                <td>{product.Amount}</td>
                                <td>{product.soldCount}</td>
                                <td>
                                    <div>
                                        <Tooltip title="View Details" arrow>
                                            <Link href={`/admin-dashboard/products-management/${product.ProductID}`}>
                                                <IconButton aria-label="view" color="primary">
                                                    <EditIcon fontSize="inherit" />
                                                </IconButton>
                                            </Link>
                                        </Tooltip>
                                        <Tooltip title="Delete User" arrow>
                                            <IconButton aria-label="delete" color="error" onClick={() => handleDelete(user.id)}>
                                                <DeleteIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>No products found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Pagination
                currentPage={page}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={(newPage) => setPage(newPage)} // Handle page changes
            />

            {/* Add Product Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveProduct} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductManagement;
