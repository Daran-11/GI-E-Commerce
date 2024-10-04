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
  const [openEditModal, setOpenEditModal] = useState(false);

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

    // New function to set a bank account as default
    const setAsDefault = async (accountId) => {
      
      const res = await fetch(`/api/bank-accounts/${userId}/set-default`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: accountId }),
      });
  
      if (res.ok) {

        const updatedAccounts = await fetch(`/api/bank-accounts/${userId}`);
        const data = await updatedAccounts.json();
        setBankAccounts(data);
      }
    };

  const resetForm = () => {
    setAccountNumber('');
    setAccountName('');
    setSelectedBankId('');
    setIsDefault(false);
    setEditId(null);
    setOpenAddModal(false); // Close modal
    setOpenEditModal(false); // Close edit modal if opens
  };

    const handleEdit = (account) => {
    setEditId(account.id);
    setAccountNumber(account.accountNumber);
    setAccountName(account.accountName);
    setSelectedBankId(account.bankId); // Set selected bank ID for edit
    setIsDefault(account.isDefault);
    setOpenEditModal(true);
    
  };

  return (
    <div className='w-full h-screen bg-white rounded-xl p-6'>

      <div className=' flex justify-between border-b-2 mb-1 pb-2'>
      <h1 className='text-2xl md:text-4xl text-[#535353] '>
        บัญชีธนาคารของฉัน
      </h1>

        <button 
          className='!bg-[#4eac14] text-white rounded-xl hover:bg-[#417521] px-4 py-2' 
          onClick={() => setOpenAddModal(true)}
        >
          เพิ่มบัญชีธนาคาร
        </button>        
      </div>



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
          <h2 className='text-3xl mb-1'>ต้องการที่จะลบใช่หรือไม่?</h2>
          <p className='mb-3'> หากลบแล้วไม่สามารถย้อนกลับได้</p>
          <div className='flex justify-end'>
          <Button variant="text" onClick={() => setOpenDeleteModal(false)} className='text-gray-600'>ยกเลิก</Button> 
          <Button variant="contained" color="error" onClick={confirmDelete}>ลบ</Button>         
          </div>
        </div>
      </Modal>

            
      {/* Edit Account Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <div className='bg-white p-6 m-auto mt-[10%] md:w-[25%] rounded-xl'>
          <h2 className='mb-5 text-2xl'>แก้ไขบัญชีธนาคาร</h2>
          <form onSubmit={handleSubmit}>
            <div className='space-y-3'>
              <FormControl fullWidth>
                <InputLabel>เลือกธนาคาร</InputLabel>
                <Select
                  className='rounded-3xl'
                  MenuProps={{
                    PaperProps: {
                      className: 'max-h-45 overflow-auto rounded-2xl',
                    },
                  }}
                  label="เลือกธนาคาร"
                  
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                >
                  <MenuItem value="">Select Bank</MenuItem>
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
                  className: 'rounded-3xl',
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="ชื่อที่ปรากฎบนบัญชีธนาคาร"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                InputProps={{
                  className: 'rounded-3xl',
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
              <Button type="button" onClick={() => setOpenEditModal(false)} style={{ marginLeft: '10px' }}>ยกเลิก</Button>
              <Button type="submit"  variant="contained" color="primary">ยืนยัน</Button>

            </div>
          </form>
        </div>
      </Modal>


      <table className="min-w-full table-auto border-collapse mt-4">

    {bankAccounts.length > 0 && bankAccounts.map((account) => (
        <tbody className=''>
      <tr key={account.id} className='border-b-2'>
        <td className="w-[95px] md:py-4 py-2">
          <div className='w-[75px] h-[75px] border-2 text-center '>
          Image
          </div>
          </td>
        <td className="md:px-4 md:py-4">
          <div className="flex flex-col">
            <div>ธนาคาร  {account.isDefault && <span className='text-[#4eac14]'>(บัญชีหลัก)</span>}</div>
            <p>{account.accountName}</p>
            <p>{account.accountNumber}</p>
          </div>
        </td>
        <td className=' md:px-1 md:py-2 text-right'>

          

        </td>
        <td className='text-right md:px-1 md:py-4'>

          <button 
            onClick={() => setAsDefault(account.id)} 
            className={`px-3 py-1 rounded ${!account.isDefault &&  'text-[#4eac14] '}`}
            disabled={account.isDefault} // ทำให้ปุ่มไม่สามารถคลิกได้เมื่อบัญชีเป็น default
          >
            {!account.isDefault && 'ตั้งเป็นบัญชีหลัก'}
          </button>

          {account.isDefault ? 
            <Button variant="text" disabled="{!account.isDefault}" color="error" onClick={() => handleDelete(account.id)}>ลบ</Button>
          : 
          <Button variant="text"  color="error" onClick={() => handleDelete(account.id)}>ลบ</Button>
          }
           {/*<Button variant="text" color="primary" onClick={() => handleEdit(account)}>แก้ไข</Button>*/}

           {/* สร้างปุ่ม ตั้งเป็น default ตรงนี้*/}

        </td>

      </tr>
        </tbody>
    ))}

</table>


    </div>
  );
};

export default BankAccountsPage;
