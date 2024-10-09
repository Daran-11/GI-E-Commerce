"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import { useRouter } from "next/navigation";
import { MdAdd, MdDelete } from 'react-icons/md';

const EditFarmer = ({ params }) => {
  const farmerId = params.id; // Extract farmerId from params
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    certificates: [{ standardName: "", certificateNumber: "", approvalDate: "" }],
  });
  const [standards, setStandards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await fetch("/api/standards");
        const data = await response.json();
        setStandards(data);
      } catch (error) {
        console.error("Failed to fetch standards:", error);
      }
    };

    const fetchFarmerData = async () => {
      if (farmerId) {
        try {
          const response = await fetch(`/api/manage_farmer?id=${farmerId}`);
          if (!response.ok) throw new Error("Network response was not ok");
          
          const data = await response.json();
          // Check if the response contains the expected fields
          if (data) {
            setFormData({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              certificates: data.certificates?.length > 0 
                ? data.certificates.map(cert => ({
                    standardName: cert.standardName || "",
                    certificateNumber: cert.certificateNumber || "",
                    approvalDate: cert.approvalDate ? new Date(cert.approvalDate).toISOString().split('T')[0] : "",
                  })) 
                : [{ standardName: "", certificateNumber: "", approvalDate: "" }],
            });
          }
        } catch (error) {
          console.error("Failed to fetch farmer data:", error);
        }
      }
    };

    fetchStandards();
    fetchFarmerData();
  }, [farmerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/manage_farmer", {
        method: "PUT", // Use PUT for updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: farmerId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          certificates: formData.certificates.map(cert => ({
            standardName: cert.standardName,
            certificateNumber: cert.certificateNumber,
            approvalDate: new Date(cert.approvalDate).toISOString(),
          })),
        }),
      });

      if (res.ok) {
        router.push("/dashboard_municipality/manage_farmer");
      } else {
        throw new Error("Failed to update farmer");
      }
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDelete = async () => {
    if (!farmerId) return;

    try {
      const res = await fetch("/api/manage_farmer", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: farmerId }),
      });

      if (res.ok) {
        router.push("/dashboard_municipality/manage_farmer");
      } else {
        throw new Error("Failed to delete farmer");
      }
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleAddCertificate = () => {
    setFormData(prevData => ({
      ...prevData,
      certificates: [...prevData.certificates, { standardName: "", certificateNumber: "", approvalDate: "" }],
    }));
  };

  const handleRemoveCertificate = (index) => {
    setFormData(prevData => ({
      ...prevData,
      certificates: prevData.certificates.filter((_, i) => i !== index),
    }));
  };

  const handleCertificateChange = (index, field, value) => {
    setFormData(prevData => {
      const newCertificates = [...prevData.certificates];
      newCertificates[index][field] = value;
      return { ...prevData, certificates: newCertificates };
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="ชื่อ"
          className={styles.input}
          value={formData.firstName}
          onChange={(e) => setFormData(prevData => ({ ...prevData, firstName: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="นามสกุล"
          className={styles.input}
          value={formData.lastName}
          onChange={(e) => setFormData(prevData => ({ ...prevData, lastName: e.target.value }))}
          required
        />
        {formData.certificates.map((cert, index) => (
          <div key={index} className={styles.certificateGroup}>
            <select
              value={cert.standardName}
              onChange={(e) => handleCertificateChange(index, 'standardName', e.target.value)}
              required
            >
              <option value="">เลือกมาตรฐาน</option>
              {standards.map(std => (
                <option key={std.id} value={std.name}>{std.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="เลขที่ใบรับรอง"
              value={cert.certificateNumber}
              onChange={(e) => handleCertificateChange(index, 'certificateNumber', e.target.value)}
              required
            />
            <input
              type="date"
              value={cert.approvalDate}
              onChange={(e) => handleCertificateChange(index, 'approvalDate', e.target.value)}
              required
            />
            <button type="button" onClick={() => handleRemoveCertificate(index)}>
              <MdDelete />
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddCertificate} className={styles.addButton}>
          <MdAdd /> เพิ่มใบรับรอง
        </button>
        <button type="submit" className={styles.button}>อัปเดตเกษตรกร</button>
        
      </form>
    </div>
  );
};

export default EditFarmer;
