"use client";

import Pagination from "@/app/ui/dashboard/pagination/pagination";
import styles from "@/app/ui/dashboard/products/products.module.css";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
const Users = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  // Fetch users data
  const fetchUsers = async (page = 1) => {
    setLoading(false);
    try {
      const response = await fetch(`/api/users?page=${page}&pageSize=${pageSize}`);
      const data = await response.json();
      console.log('API Response:', data); // Check the structure of the response
      setUsers(data || []);
      setTotalItems(data.length);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };


  // Handle user deletion
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/api/users/delete/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
          toast.success("ลบผู้ใช้สำเร็จ");
        } else {
          toast.error("ไม่สามารถลบผู้ใช้ได้");
        }
      } catch (error) {
        console.error("ไม่สามารถลบผู้ใช้ได้:", error);
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
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the user list
        handleCloseDialog(); // Close the dialog
      } else {
        toast.error("ไม่สามารถเพิ่มผู้ใช้ได้");
      }
    } catch (error) {
      console.error("ไม่สามารถเพิ่มผู้ใช้ได้:", error);
    }
  };

  // Use effect for fetching users on session change
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchUsers(page); // Fetch users when authenticated
    }
  }, [status, session, router, page]); // Added `page` to dependencies

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
            <td>Role</td>
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
                <td>{user.role}</td>
                <td>
                  <div>
                    <Tooltip title="View Details" arrow>
                      <Link href={`/admin-dashboard/user-management/${user.id}`}>
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
              <td colSpan={5}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={page}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchUsers(newPage); // Fetch users for the new page
        }} // Handle page changes
      />

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
