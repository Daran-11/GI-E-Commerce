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
            variety: data.variety || "",
            plotCode: data.plotCode || "",
            registrationDate: new Date(data.registrationDate)
              .toISOString()
              .split("T")[0],
            expiryDate: new Date(data.expiryDate).toISOString().split("T")[0],
            status: data.status || "",
            imageUrl: data.imageUrl || "",
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
      <div className={styles.formGroup}>
        <label htmlFor="variety">Variety</label>
        <input
          type="text"
          id="variety"
          name="variety"
          value={formData.variety}
          onChange={handleChange}
          placeholder="Enter variety"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="plotCode">Plot Code</label>
        <input
          type="text"
          id="plotCode"
          name="plotCode"
          value={formData.plotCode}
          onChange={handleChange}
          placeholder="Enter plot code"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="registrationDate">Registration Date</label>
        <input
          type="date"
          id="registrationDate"
          name="registrationDate"
          value={formData.registrationDate}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="expiryDate">Expiry Date</label>
        <input
          type="date"
          id="expiryDate"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="status">Status</label>
        <input
          type="text"
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          placeholder="Enter status"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Enter image URL"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="farmerId">Farmer ID</label>
        <input
          type="text"
          id="farmerId"
          name="farmerId"
          value={formData.farmerId}
          onChange={handleChange}
          placeholder="Enter farmer ID"
        />
      </div>
      
      <button type="submit">แก้ไขใบรับรอง</button>
    </form>
  );
};

export default EditCertificatePage;
