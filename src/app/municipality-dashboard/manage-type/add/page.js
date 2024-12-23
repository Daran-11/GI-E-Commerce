"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import styles from "../../../ui/dashboard/users/managetype/AddTypePage.module.css";

const AddTypePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    varieties: [""]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      setIsLoading(true);
      
      if (!formData.type.trim()) {
        throw new Error("กรุณาระบุชนิด");
      }

      if (formData.varieties.length === 0 || !formData.varieties.some(v => v.trim())) {
        throw new Error("กรุณาระบุสายพันธุ์อย่างน้อย 1 รายการ");
      }

      const data = {
        type: formData.type,
        varieties: formData.varieties
          .filter(name => name.trim())
          .map(name => ({ name }))
      };
      
      const response = await fetch("/api/manage_type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "ไม่สามารถบันทึกข้อมูลได้");
      }

      router.push("/municipality-dashboard/manage-type");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVariety = () => {
    setFormData(prev => ({
      ...prev,
      varieties: [...prev.varieties, ""]
    }));
  };

  const handleRemoveVariety = (index) => {
    if (formData.varieties.length === 1) {
      setError("ต้องมีสายพันธุ์อย่างน้อย 1 รายการ");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      varieties: prev.varieties.filter((_, i) => i !== index)
    }));
  };

  const handleVarietyChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      varieties: prev.varieties.map((v, i) => i === index ? value : v)
    }));
  };

  return (
    <div className={styles.container}>
       <h1 className="text-2xl ">เพิ่มชนิดเเละสายพันธุ์</h1><br></br>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            ชนิด
          </label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className={styles.input}
            placeholder="กรอกชื่อชนิด"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.varietyHeader}>
            <label className={styles.label}>
              สายพันธุ์
            </label>
            <button
              type="button"
              onClick={handleAddVariety}
              className={styles.addButton}
            >
              <MdAdd /> เพิ่มสายพันธุ์
            </button>
          </div>

          {formData.varieties.map((variety, index) => (
            <div key={index} className={styles.varietyItem}>
              <input
                type="text"
                value={variety}
                onChange={(e) => handleVarietyChange(index, e.target.value)}
                className={styles.input}
                placeholder={`สายพันธุ์ที่ ${index + 1}`}
                required
              />
              {formData.varieties.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveVariety(index)}
                  className={styles.deleteButton}
                  title="ลบสายพันธุ์"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.cancelButton}
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTypePage;