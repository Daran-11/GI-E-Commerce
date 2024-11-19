"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/manage_farmer/manage_farmer.module.css";
import { useRouter } from "next/navigation";
import { MdAdd, MdDelete } from 'react-icons/md';

const AddUsers = ({ UsersId }) => {
  const [farmerNameApprove, setFarmerNameApprove] = useState("");
  const [certificates, setCertificates] = useState([{ type: "", variety: "", standardName: "", certificateNumber: "", approvalDate: "" }]);
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
          const data = await response.json();
          setFarmerNameApprove(data.farmerNameApprove);
          setCertificates(data.certificates.length > 0 ? data.certificates : [{ type: "", variety: "", standardName: "", certificateNumber: "", approvalDate: "" }]);
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
        method: UsersId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: UsersId,
          farmerNameApprove,
          certificates: certificates.map(cert => ({
            type: cert.type,
            variety: cert.variety,
            standardName: cert.standardName,
            certificateNumber: cert.certificateNumber,
            approvalDate: new Date(cert.approvalDate).toISOString(),
          })),
        }),
      });

      if (res.ok) {
        router.push("/municipality-dashboard/manage_farmer");
      } else {
        throw new Error(UsersId ? "Failed to update Users" : "Failed to create Users");
      }
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDelete = async () => {
    if (!UsersId) return;

    try {
      const res = await fetch("/api/manage_farmer", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: UsersId }),
      });

      if (res.ok) {
        router.push("/municipality-dashboard/manage_farmer");
      } else {
        throw new Error("Failed to delete Users");
      }
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleAddCertificate = () => {
    setCertificates([...certificates, { type: "", variety: "", standardName: "", certificateNumber: "", approvalDate: "" }]);
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
          placeholder="ชื่อ-นามสกุล"
          className={styles.input}
          value={farmerNameApprove}
          onChange={(e) => setFarmerNameApprove(e.target.value)}
          required
        />
        {certificates.map((cert, index) => (
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
            <br />
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
              onChange={(e) =>
                handleCertificateChange(
                  index,
                  "certificateNumber",
                  e.target.value
                )
              }
              required
            />
            <input
              type="date"
              className={styles.selectcertificates}
              value={cert.approvalDate}
              onChange={(e) =>
                handleCertificateChange(index, "approvalDate", e.target.value)
              }
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
          <button type="submit" className={styles.Submitbutton}>
            {UsersId ? "อัปเดตเกษตรกร" : "เพิ่มรายชื่อเกษตรกร"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUsers;