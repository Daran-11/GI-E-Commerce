'use client'

import { useState } from 'react';

export default function AddCertificatePage() {
  const [formData, setFormData] = useState({
    variety: '',
    plotCode: '',
    registrationDate: '',
    expiryDate: '',
    status: '',
    imageUrl: '',
    farmerId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/certificate/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert('Certificate added successfully');
    } else {
      alert('Failed to add certificate');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="variety" type="text" placeholder="Variety" value={formData.variety} onChange={handleChange} required />
      <input name="plotCode" type="text" placeholder="Plot Code" value={formData.plotCode} onChange={handleChange} required />
      <input name="registrationDate" type="date" placeholder="Registration Date" value={formData.registrationDate} onChange={handleChange} required />
      <input name="expiryDate" type="date" placeholder="Expiry Date" value={formData.expiryDate} onChange={handleChange} required />
      <input name="status" type="text" placeholder="Status" value={formData.status} onChange={handleChange} required />
      <input name="imageUrl" type="text" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} required />
      <input name="farmerId" type="number" placeholder="Farmer ID" value={formData.farmerId} onChange={handleChange} required />
      <button type="submit">Add Certificate</button>
    </form>
  );
}
