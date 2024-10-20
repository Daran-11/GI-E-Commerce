"use client";

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

const Users = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10; // Number of items per page
  const [dialogOpen, setDialogOpen] = useState(false); // For add/edit user dialog
  const [newUser, setNewUser] = useState({ name: '', email: '' }); // New user state

  // Fetch users data
  const fetchUsers = async (page = 1) => {
    setLoading(false);
    try {
      const response = await fetch(`/api/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data || []); // Adjust to match your API response
      setTotalItems(data.length);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/api/users/${userId}/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
        } else {
          alert("Failed to delete user");
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  // Open dialog to add user
  const handleAddUser = () => {
    setNewUser({ name: '', email: '' }); // Reset form
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Handle adding a new user
  const handleSaveUser = async () => {
    // Your API call logic to save a new user goes here
    // After successful save, close the dialog and fetch users again
    setDialogOpen(false);
    await fetchUsers(); // Refresh user list
  };

  // Use effect for fetching users on session change
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchUsers(); // Fetch users when authenticated
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
        <Tooltip title="Add User" arrow>
          <IconButton aria-label="add" onClick={handleAddUser} size="large">
            <AddBoxIcon fontSize="inherit" style={{ color: "#388e3c" }} />
          </IconButton>
        </Tooltip>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <td>ID</td>
            <td>Name</td>
            <td>Email</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <div>
                    <Tooltip title="Edit User" arrow>
                      <IconButton aria-label="edit" color="success" onClick={() => { /* Edit user logic here */ }}>
                        <EditIcon fontSize="inherit" />
                      </IconButton>
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
              <td colSpan={4}>No users found</td>
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

      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveUser} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
