'use client';

import { Button, Checkbox, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const BankAccountsPage = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [bankAccounts, setBankAccounts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [selectedBankId, setSelectedBankId] = useState('');
  const [editId, setEditId] = useState(null);
  const [isDefault, setIsDefault] = useState(false);
  
  // State for modals
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  // Fetch bank accounts for the user
  useEffect(() => {
    if (userId) {
      fetch(`/api/bank-accounts/${userId}`)
        .then((res) => res.json())
        .then((data) => setBankAccounts(data));
    }
  }, [userId]);

  // Fetch banks list
  useEffect(() => {
    fetch(`/api/bank-accounts/banks`)
      .then((res) => res.json())
      .then((data) => setBanks(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!accountNumber || !accountName || !selectedBankId) {
      alert("Please fill in all fields.");
      return;
    }

    // Check if accountNumber is numeric
    if (!/^\d+$/.test(accountNumber)) {
      alert("Account number must be numeric.");
      return;
    }

    // Automatically set the first bank account as default if none exist
    const hasDefaultAccount = bankAccounts.some(account => account.isDefault);
    if (!hasDefaultAccount && !isDefault) {
      setIsDefault(true); // Automatically set this account as default
    }

    const method = editId ? 'PUT' : 'POST';
    const url = `/api/bank-accounts/${userId}`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, accountNumber, accountName, bankId: selectedBankId, isDefault }),
    });

    if (res.ok) {
      // Reset form fields
      resetForm();

      // Fetch updated bank accounts
      const updatedAccounts = await fetch(`/api/bank-accounts/${userId}`);
      const data = await updatedAccounts.json();
      setBankAccounts(data);
    }
  };

  const handleDelete = (id) => {
    setAccountToDelete(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    const res = await fetch(`/api/bank-accounts/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: accountToDelete }),
    });

    if (res.ok) {
      setBankAccounts((prev) => prev.filter((acc) => acc.id !== accountToDelete));
    }
    
    setOpenDeleteModal(false);
  };

  const resetForm = () => {
    setAccountNumber('');
    setAccountName('');
    setSelectedBankId('');
    setIsDefault(false);
    setEditId(null);
    setOpenAddModal(false); // Close modal
  };

  return (
    <div className='w-full h-screen bg-white rounded-xl p-6'>
      <h1 className='page-header'>บัญชีธนาคาร</h1>
      <Button 
        variant="contained" 
        style={{ backgroundColor: '#4eac14', color: 'white' }} 
        onClick={() => setOpenAddModal(true)}
      >
        เพิ่มบัญชีธนาคาร
      </Button>

      {/* Add Account Modal */}
      <Modal open={openAddModal} onClose={resetForm}>
        <div className='bg-white p-6 m-auto mt-[10%] md:w-[25%] rounded-xl'>
          <h2 className='mb-5 text-2xl'>{editId ? 'Edit Account' : 'เพิ่มบัญชีธนาคาร'}</h2>
          <form onSubmit={handleSubmit}>
            <div className='space-y-3'>
            <FormControl fullWidth >
            <InputLabel>เลือกธนาคาร</InputLabel>
              <Select
                className='rounded-3xl'
                MenuProps={{
                    
                    PaperProps: {
                      className: 'max-h-45 overflow-auto rounded-2xl', // Tailwind classes for menu
                    },
                    
                  }}
                  InputProps={{
                    className: 'rounded-2xl',
                  }}
                label="เลือกธนาคาร"
                value={selectedBankId}
                onChange={(e) => setSelectedBankId(e.target.value)}
              >
                <MenuItem  value="">Select Bank</MenuItem>
                {banks.map((bank) => (
                  <MenuItem key={bank.id} value={bank.id}>{bank.brand}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth

              margin="normal"
              label="เลขบัญชีธนาคาร"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              InputProps={{
                className: 'rounded-3xl ',
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="ชื่อที่ปรากฎบนบัญชีธนาคาร"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              InputProps={{
                className: 'rounded-3xl ',
              }}
            />
            <label>
              <Checkbox
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
              ตั้งเป็นบัญชีหลัก
            </label>   
            </div>

            <div className='mt-2 flex justify-end space-x-2'>
            <Button type="button" onClick={resetForm} style={{ marginLeft: '10px' }}>ยกเลิก</Button>
              <Button type="submit" variant="contained" color="primary">ยืนยัน</Button>
             
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <div className='bg-white p-6 m-auto mt-[20%] w-[20%] rounded-xl'>
          <h2>คุณต้องการที่จะลบใช่หรือไม่?</h2>
          <p> หากลบแล้วไม่สามารถย้อนกลับได้</p>
          <Button variant="contained" color="error" onClick={confirmDelete}>ลบ</Button>
          <Button variant="text" onClick={() => setOpenDeleteModal(false)} className='text-gray-600'>ยกเลิก</Button>
        </div>
      </Modal>

      <ul>
        {bankAccounts.length > 0 && bankAccounts.map((account) => (
          <li key={account.id}>
            <span>{account.accountName} - {account.accountNumber}</span>
            {account.isDefault && <span> (Default)</span>}
            {!account.isDefault && (
              <Button variant="text" color="error" onClick={() => handleDelete(account.id)}>ลบ</Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BankAccountsPage;
