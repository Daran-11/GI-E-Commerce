"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";

const ManageTypePage = () => {
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/manage_type");
      if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลได้");
      const data = await response.json();
      setTypes(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch types:", err);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">จัดการชนิดและสายพันธุ์</h1>
        <Link href="/municipality-dashboard/manage-type/add">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
            <MdAdd /> เพิ่มชนิดใหม่
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชนิด</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สายพันธุ์</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สร้าง</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่อัพเดต</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {types.map((type, index) => (
              <tr key={type.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{type.type}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {type.varieties.map(variety => (
                      <span 
                        key={variety.id}
                        className="inline-block px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded"
                      >
                        {variety.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(type.createdAt).toLocaleDateString('th-TH')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(type.updatedAt).toLocaleDateString('th-TH')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Link href={`/municipality-dashboard/manage-type/edit/${type.id}`}>
                      <button className="text-blue-600 hover:text-blue-800">
                        <MdEdit size={20} />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(type.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTypePage;