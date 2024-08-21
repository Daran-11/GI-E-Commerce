"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddCertificatePage() {
  const [formData, setFormData] = useState({
    variety: "",
    plotCode: "",
    registrationDate: "",
    expiryDate: "",
    status: "",
    imageUrl: "",
    farmerId: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/certificate/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Certificate added successfully");
      router.push("/dashboard/certificate");
    } else {
      alert("Failed to add certificate");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="variety"
        type="text"
        placeholder="สายพันธุ์"
        value={formData.variety}
        onChange={handleChange}
        required
      />
      <input
        name="plotCode"
        type="text"
        placeholder="รหัสแปลงปลูก"
        value={formData.plotCode}
        onChange={handleChange}
        required
      />
      <input
        name="registrationDate"
        type="date"
        placeholder="วันจดทะเบียน"
        value={formData.registrationDate}
        onChange={handleChange}
        required
      />
      <input
        name="expiryDate"
        type="date"
        placeholder="วันหมดอายุ"
        value={formData.expiryDate}
        onChange={handleChange}
        required
      />
      <input
        name="status"
        type="text"
        placeholder="สถานะ"
        value={formData.status}
        onChange={handleChange}
        required
      />
      <input
        name="imageUrl"
        type="text"
        placeholder="รูปภาพ"
        value={formData.imageUrl}
        onChange={handleChange}
        required
      />
      <input
        name="farmerId"
        type="number"
        placeholder="รหัสเกษตร"
        value={formData.farmerId}
        onChange={handleChange}
        required
      />
      <button type="submit">เพิ่มใบรับรอง</button>
    </form>
  );
}
