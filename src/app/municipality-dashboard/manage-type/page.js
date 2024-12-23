"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MdEdit, MdDelete } from "react-icons/md";
import styles from "../../ui/dashboard/users/managetype/managetype.module.css";

const ManageTypePage = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/manage_type");
      if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลได้");
      const data = await response.json();
      setTypes(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch types:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) return;

    try {
      const response = await fetch(`/api/manage_type?id=${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("ไม่สามารถลบข้อมูลได้");
      
      setTypes(types.filter(type => type.id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Failed to delete:", err);
    }
  };

  if (loading) {
    return <div className={styles.loading}>กำลังโหลด...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
      <h1 className="text-2xl ">จัดการมาตรฐาน</h1><br></br>
        <Link href="/municipality-dashboard/manage-type/add">
          <span className={styles.addButton}>เพิ่มชนิดใหม่</span>
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <td>#</td>
            <td>ชนิด</td>
            <td>สายพันธุ์</td>
            <td>วันที่สร้าง</td>
            <td>วันที่อัพเดต</td>
            <td>การจัดการ</td>
          </tr>
        </thead>
        <tbody>
          {types.length > 0 ? (
            types.map((type, index) => (
              <tr key={type.id}>
                <td>{index + 1}</td>
                <td>{type.type}</td>
                <td>
                  <div className={styles.varietyCell}>
                    {type.varieties.map(variety => (
                      <span key={variety.id} className={styles.varietyTag}>
                        {variety.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{new Date(type.createdAt).toLocaleDateString('th-TH')}</td>
                <td>{new Date(type.updatedAt).toLocaleDateString('th-TH')}</td>
                <td>
                  <div className={styles.buttons}>
                    <Link href={`/municipality-dashboard/manage-type/edit/${type.id}`}>
                      <button className={styles.editButton}>
                        <MdEdit size={20} />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(type.id)}
                      className={styles.deleteButton}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className={styles.noData}>ไม่พบข้อมูล</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTypePage;