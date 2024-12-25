"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdAdd, MdDelete } from "react-icons/md";
import styles from "../../../../ui/dashboard/users/managetype/AddTypePage.module.css";

const EditTypePage = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    varieties: [{ name: "" }]
  });

  useEffect(() => {
    const fetchType = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/manage_type?id=${id}`);
        
        if (!response.ok) {
          throw new Error("ไม่สามารถโหลดข้อมูลได้");
        }
        
        const data = await response.json();
        setFormData({
          type: data.type,
          varieties: data.varieties.map(v => ({ name: v.name }))
        });
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch type:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchType();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      setIsSaving(true);
      
      const response = await fetch("/api/manage_type", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: parseInt(id),
          ...formData
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "ไม่สามารถบันทึกข้อมูลได้");
      }

      router.push("/municipality-dashboard/manage-type");
    } catch (err) {
      setError(err.message);
      console.error("Failed to save:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddVariety = () => {
    setFormData(prev => ({
      ...prev,
      varieties: [...prev.varieties, { name: "" }]
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
    setFormData(prev => {
      const newVarieties = [...prev.varieties];
      newVarieties[index].name = value;
      return { ...prev, varieties: newVarieties };
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className="text-2xl ">เเก้ไขชนิดสินค้า</h1><br></br>

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
                value={variety.name}
                onChange={(e) => handleVarietyChange(index, e.target.value)}
                className={styles.input}
                placeholder={`สายพันธุ์ที่ ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveVariety(index)}
                className={styles.deleteButton}
                title="ลบสายพันธุ์"
              >
                <MdDelete />
              </button>
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
            disabled={isSaving}
            className={styles.submitButton}
          >
            {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTypePage;