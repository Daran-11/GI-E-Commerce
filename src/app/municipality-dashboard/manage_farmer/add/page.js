"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/manage_farmer/manage_farmer.module.css";
import { useRouter } from "next/navigation";
import { MdAdd, MdDelete } from 'react-icons/md';

const AddUsers = ({ UsersId }) => {
  const [farmerNameApprove, setFarmerNameApprove] = useState("");
  const [certificates, setCertificates] = useState([{ type: "", variety: "", standardName: "", certificateNumber: "", approvalDate: "" }]);
  const [standards, setStandards] = useState([]);
  const [standardsInfo, setStandardsInfo] = useState({});
  const [types, setTypes] = useState([]); // เพิ่ม state สำหรับเก็บข้อมูลชนิด
  const [selectedTypes, setSelectedTypes] = useState({}); // เก็บ selected type สำหรับแต่ละ certificate
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        
        // สร้าง object ที่เก็บ certificationInfo ของแต่ละมาตรฐาน
        const infoMap = {};
        standardsData.forEach(standard => {
          infoMap[standard.name] = standard.certificationInfo;
        });
        setStandardsInfo(infoMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchUsersData = async () => {
      if (UsersId) {
        try {
          const response = await fetch(`/api/manage_farmer?id=${UsersId}`);
          const data = await response.json();
          const [firstNameData, lastNameData] = data.farmerNameApprove.split(" ");
          setFirstName(firstNameData || "");
          setLastName(lastNameData || "");
          setCertificates(data.certificates.length > 0 ? data.certificates : [{ type: "", variety: "", standardName: "", certificateNumber: "", approvalDate: "" }]);
        } catch (error) {
          console.error("Failed to fetch Users data:", error);
        }
      }
    };

    fetchData();
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
          farmerNameApprove: `${firstName} ${lastName}`.trim(), // รวมชื่อและนามสกุล
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
    }
  };

  const handleAddCertificate = () => {
    setCertificates([...certificates, { type: "", variety: "", standardName: "", certificateNumber: "", approvalDate: "" }]);
  };

  const handleRemoveCertificate = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
    // ลบ selected type สำหรับ certificate ที่ถูกลบ
    const newSelectedTypes = { ...selectedTypes };
    delete newSelectedTypes[index];
    setSelectedTypes(newSelectedTypes);
  };

  const handleCertificateChange = (index, field, value) => {
    const newCertificates = [...certificates];
    
    if (field === 'type') {
      // เมื่อเปลี่ยนชนิด ให้เก็บ selected type และรีเซ็ตค่าพันธุ์
      const selectedType = types.find(t => t.type === value);
      setSelectedTypes(prev => ({
        ...prev,
        [index]: selectedType
      }));
      newCertificates[index] = {
        ...newCertificates[index],
        type: value,
        variety: '' // รีเซ็ตค่าพันธุ์
      };
    } else {
      newCertificates[index] = {
        ...newCertificates[index],
        [field]: value
      };
    }
    
    setCertificates(newCertificates);
  };

  const getCertificateLabel = (standardName) => {
    return standardsInfo[standardName] || "เลขที่ใบรับรอง";
  };

  return (
    <div className={styles.container}>
    <h1 className="text-2xl ">เพิ่มรายชื่อเกษตรกร</h1><br></br>
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

        {certificates.map((cert, index) => (
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
                onChange={(e) => handleCertificateChange(index, "certificateNumber", e.target.value)}
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
                onChange={(e) => handleCertificateChange(index, "approvalDate", e.target.value)}
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
          <button type="submit" className={styles.Submitbutton}>
            {UsersId ? "อัปเดตเกษตรกร" : "เพิ่มรายชื่อเกษตรกร"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUsers;