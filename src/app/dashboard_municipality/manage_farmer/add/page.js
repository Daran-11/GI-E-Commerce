"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import { useRouter } from "next/navigation";
import { MdAdd, MdDelete } from 'react-icons/md';

const AddFarmer = ({ farmerId }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [certificates, setCertificates] = useState([{ standardName: "", certificateNumber: "", approvalDate: "" }]);
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
          const data = await response.json();
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setCertificates(data.certificates.length > 0 ? data.certificates : [{ standardName: "", certificateNumber: "", approvalDate: "" }]);
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
        method: farmerId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: farmerId,
          firstName,
          lastName,
          certificates: certificates.map(cert => ({
            standardName: cert.standardName,
            certificateNumber: cert.certificateNumber,
            approvalDate: new Date(cert.approvalDate).toISOString(),
          })),
        }),
      });

      if (res.ok) {
        router.push("/dashboard_municipality/manage_farmer");
      } else {
        throw new Error(farmerId ? "Failed to update farmer" : "Failed to create farmer");
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
    setCertificates([...certificates, { standardName: "", certificateNumber: "", approvalDate: "" }]);
  };

  const handleRemoveCertificate = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const handleCertificateChange = (index, field, value) => {
    const newCertificates = [...certificates];
    newCertificates[index][field] = value;
    setCertificates(newCertificates);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="ชื่อ"
          className={styles.input}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="นามสกุล"
          className={styles.input}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {certificates.map((cert, index) => (
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
        <button type="submit" className={styles.button}>{farmerId ? 'อัปเดตเกษตรกร' : 'เพิ่มรายชื่อเกษตรกร'}</button>
        {farmerId && (
          <button type="button" onClick={handleDelete} className={styles.deleteButton}>ลบเกษตรกร</button>
        )}
      </form>
    </div>
  );
};

export default AddFarmer;