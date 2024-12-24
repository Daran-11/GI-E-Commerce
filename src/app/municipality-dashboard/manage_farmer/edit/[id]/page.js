"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/manage_farmer/manage_farmer.module.css";
import { useRouter } from "next/navigation";
import { MdAdd, MdDelete } from 'react-icons/md';

const EditUsers = ({ params }) => {
  const UsersId = params.id;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formData, setFormData] = useState({
    farmerNameApprove: "",
    certificates: [{ type: "", variety: "", standardName: "", certificateNumber: "", approvalDate: "" }],
  });
  const [standards, setStandards] = useState([]);
  const [standardsInfo, setStandardsInfo] = useState({});
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchDataAndInitialize = async () => {
      try {
        // 1. Fetch types and standards first
        const [typesRes, standardsRes] = await Promise.all([
          fetch("/api/manage_type"),
          fetch("/api/standards")
        ]);

        if (!typesRes.ok || !standardsRes.ok) {
          throw new Error("ไม่สามารถโหลดข้อมูลได้");
        }

        const [typesData, standardsData] = await Promise.all([
          typesRes.json(),
          standardsRes.json()
        ]);

        setTypes(typesData);
        setStandards(standardsData);

        const infoMap = {};
        standardsData.forEach(standard => {
          infoMap[standard.name] = standard.certificationInfo;
        });
        setStandardsInfo(infoMap);

        // 2. Then fetch user data
        if (UsersId) {
          const response = await fetch(`/api/manage_farmer?id=${UsersId}`);
          if (!response.ok) throw new Error("Network response was not ok");

          const userData = await response.json();
          // แยกชื่อและนามสกุล
          const [firstNameData, lastNameData] = (userData.farmerNameApprove || "").split(" ");
          setFirstName(firstNameData || "");
          setLastName(lastNameData || "");
          
          // 3. Set form data
          const certificates = userData.certificates?.length > 0
            ? userData.certificates.map(cert => ({
              type: cert.type || "",
              variety: cert.variety || "",
              standardName: cert.standardName || "",
              certificateNumber: cert.certificateNumber || "",
              approvalDate: cert.approvalDate ? new Date(cert.approvalDate).toISOString().split('T')[0] : "",
            }))
            : [{ type: "", variety: "", standardName: "", certificateNumber: "", approvalDate: "" }];

          setFormData({
            farmerNameApprove: userData.farmerNameApprove || "",
            certificates,
          });

          // 4. Set selected types for each certificate
          const newSelectedTypes = {};
          certificates.forEach((cert, index) => {
            if (cert.type) {
              const selectedType = typesData.find(t => t.type === cert.type);
              if (selectedType) {
                newSelectedTypes[index] = selectedType;
              }
            }
          });
          setSelectedTypes(newSelectedTypes);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndInitialize();
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
          farmerNameApprove: `${firstName} ${lastName}`.trim(),
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
        router.push("/municipality-dashboard/manage_farmer");
      } else {
        throw new Error("Failed to update Users");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    router.push("/municipality-dashboard/manage_farmer");
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
    const newSelectedTypes = { ...selectedTypes };
    delete newSelectedTypes[index];
    setSelectedTypes(newSelectedTypes);
  };

  const handleCertificateChange = (index, field, value) => {
    setFormData(prevData => {
      const newCertificates = [...prevData.certificates];
      
      if (field === 'type') {
        const selectedType = types.find(t => t.type === value);
        setSelectedTypes(prev => ({
          ...prev,
          [index]: selectedType
        }));
        newCertificates[index] = {
          ...newCertificates[index],
          type: value,
          variety: ''
        };
      } else {
        newCertificates[index][field] = value;
      }
      
      return { ...prevData, certificates: newCertificates };
    });
  };

  const getCertificateLabel = (standardName) => {
    return standardsInfo[standardName] || "เลขที่ใบรับรอง";
  };

  return (
    <div className={styles.container}>
      <h1 className="text-2xl ">เเก้ไขรายชื่อเกษตรกร</h1><br></br>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.nameFieldContainer}>
          <div className={styles.certificateField}>
            <label className={styles.formLabel} htmlFor="firstName">ชื่อ</label>
            <input
              id="firstName"
              type="text"
              placeholder="ชื่อ"
              className={styles.input}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className={styles.certificateField}>
            <label className={styles.formLabel} htmlFor="lastName">นามสกุล</label>
            <input
              id="lastName"
              type="text"
              placeholder="นามสกุล"
              className={styles.input}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        {formData.certificates.map((cert, index) => (
          <div key={index} className={styles.certificateGroup}>
            <div className={styles.certificateField}>
              <label className={styles.formLabel} htmlFor={`type-${index}`}>ชนิด</label>
              <select
                id={`type-${index}`}
                value={cert.type}
                onChange={(e) => handleCertificateChange(index, 'type', e.target.value)}
                className={styles.selectcertificates}
                required
              >
                <option value="" disabled hidden>-</option>
                {types.map((type) => (
                  <option key={type.id} value={type.type}>
                    {type.type}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.certificateField}>
              <label className={styles.formLabel} htmlFor={`variety-${index}`}>สายพันธุ์</label>
              <select
                id={`variety-${index}`}
                value={cert.variety}
                onChange={(e) => handleCertificateChange(index, 'variety', e.target.value)}
                className={styles.selectcertificates}
                required
                disabled={!selectedTypes[index]}
              >
                <option value="" disabled hidden>เลือกสายพันธุ์</option>
                {selectedTypes[index]?.varieties.map((variety) => (
                  <option key={variety.id} value={variety.name}>
                    {variety.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.certificateField}>
              <label className={styles.formLabel} htmlFor={`standardName-${index}`}>ประเภทใบรับรอง</label>
              <select
                id={`standardName-${index}`}
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
            </div>

            <div className={styles.certificateField}>
              <label className={styles.formLabel} htmlFor={`certificateNumber-${index}`}>
                {getCertificateLabel(cert.standardName)}
              </label>
              <input
                id={`certificateNumber-${index}`}
                type="text"
                placeholder={getCertificateLabel(cert.standardName)}
                className={styles.selectcertificates}
                value={cert.certificateNumber}
                onChange={(e) => handleCertificateChange(index, 'certificateNumber', e.target.value)}
                required
              />
            </div>

            <div className={styles.certificateField}>
              <label className={styles.formLabel} htmlFor={`approvalDate-${index}`}>วันที่อนุมัติ</label>
              <input
                id={`approvalDate-${index}`}
                type="date"
                className={styles.selectcertificates}
                value={cert.approvalDate}
                onChange={(e) => handleCertificateChange(index, 'approvalDate', e.target.value)}
                required
              />
            </div>

            <button
              className={styles.delete}
              type="button"
              onClick={() => handleRemoveCertificate(index)}
              aria-label="ลบรายการ"
            >
              <MdDelete />
            </button>
          </div>
        ))}

        <button
          className={styles.addButton}
          type="button"
          onClick={handleAddCertificate}
          aria-label="เพิ่มรายการใหม่"
        >
          <MdAdd />
        </button>

        <div className={styles.buttonContainer}>
          <button 
            type="button" 
            onClick={handleCancel} 
            className={styles.cancelButton}
          >
            ยกเลิก
          </button>
          <button type="submit" className={styles.Submitbutton}>
            อัปเดตเกษตรกร
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUsers;