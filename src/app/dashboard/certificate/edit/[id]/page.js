"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";

const EditCertificatePage = ({ params }) => {
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
  const { id } = params;

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`/api/certificate/add?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            variety: data.variety,
            plotCode: data.plotCode,
            registrationDate: new Date(data.registrationDate)
              .toISOString()
              .split("T")[0],
            expiryDate: new Date(data.expiryDate).toISOString().split("T")[0],
            status: data.status,
            imageUrl: data.imageUrl,
            farmerId: data.farmer?.id || "",
          });
        } else {
          alert("Failed to fetch certificate");
        }
      } catch (error) {
        console.error("Failed to fetch certificate:", error);
      }
    };

    fetchCertificate();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/certificate/add", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...formData }),
    });

    if (response.ok) {
      alert("Certificate updated successfully");
      router.push("/dashboard/certificate");
    } else {
      alert("Failed to update certificate");
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
      <button type="submit">แก้ไขใบรับรอง</button>
    </form>
  );
};

export default EditCertificatePage;
