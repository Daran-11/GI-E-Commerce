"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/manage_farmer/manage_farmer.module.css";
import { useRouter } from "next/navigation";
import { MdAdd, MdDelete } from 'react-icons/md';

const EditUsers = ({ params }) => {
  const UsersId = params.id;
  const [formData, setFormData] = useState({
    farmerNameApprove: "",
    certificates: [{ type: "", variety: "", standardName: "", certificateNumber: "", approvalDate: "" }],
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

    const fetchUsersData = async () => {
      if (UsersId) {
        try {
          const response = await fetch(`/api/manage_farmer?id=${UsersId}`);
          if (!response.ok) throw new Error("Network response was not ok");

          const data = await response.json();
          setFormData({
            farmerNameApprove: data.farmerNameApprove || "",
            certificates: data.certificates?.length > 0 
              ? data.certificates.map(cert => ({
                  type: cert.type || "",
                  variety: cert.variety || "",
                  standardName: cert.standardName || "",
                  certificateNumber: cert.certificateNumber || "",
                  approvalDate: cert.approvalDate ? new Date(cert.approvalDate).toISOString().split('T')[0] : "",
                }))
              : [{ type: "", variety: "", standardName: "", certificateNumber: "", approvalDate: "" }],
          });
        } catch (error) {
          console.error("Failed to fetch Users data:", error);
        }
      }
    };

    fetchStandards();
    fetchUsersData();
  }, [UsersId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/manage_farmer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: UsersId,
          farmerNameApprove: formData.farmerNameApprove,
          certificates: formData.certificates.map(cert => ({
            type: cert.type,
            variety: cert.variety,
            standardName: cert.standardName,
            certificateNumber: cert.certificateNumber,
            approvalDate: new Date(cert.approvalDate).toISOString(),
          })),
        }),
      });

      if (res.ok) {
        router.push("/dashboard_municipality/manage_farmer");
      } else {
        throw new Error("Failed to update Users");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCertificate = () => {
    setFormData(prevData => ({
      ...prevData,
      certificates: [...prevData.certificates, { type: "", variety: "", standardName: "", certificateNumber: "", approvalDate: "" }],
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
          placeholder="ชื่อ-นามสกุล"
          className={styles.input}
          value={formData.farmerNameApprove}
          onChange={(e) => setFormData(prevData => ({ ...prevData, farmerNameApprove: e.target.value }))}
          required
        />
        {formData.certificates.map((cert, index) => (
          <div key={index} className={styles.certificateGroup}>
            <input
              type="text"
              placeholder="ชนิด"
              className={styles.selectcertificates}
              value={cert.type}
              onChange={(e) => handleCertificateChange(index, 'type', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="พันธุ์"
              className={styles.selectcertificates}
              value={cert.variety}
              onChange={(e) => handleCertificateChange(index, 'variety', e.target.value)}
              required
            />
            <select
              value={cert.standardName}
              className={styles.selectcertificates}
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
              className={styles.selectcertificates}
              value={cert.certificateNumber}
              onChange={(e) => handleCertificateChange(index, 'certificateNumber', e.target.value)}
              required
            />
            <input
              type="date"
              className={styles.selectcertificates}
              value={cert.approvalDate}
              onChange={(e) => handleCertificateChange(index, 'approvalDate', e.target.value)}
              required
            />
            <button
              className={styles.delete}
              type="button"
              onClick={() => handleRemoveCertificate(index)}
            >
              <MdDelete />
            </button>
          </div>
        ))}
        <button
          className={styles.addButton}
          type="button"
          onClick={handleAddCertificate}
        >
          <MdAdd />
        </button>
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.Submitbutton}>อัปเดตเกษตรกร</button>
        </div>
      </form>
    </div>
  );
};

export default EditUsers;
