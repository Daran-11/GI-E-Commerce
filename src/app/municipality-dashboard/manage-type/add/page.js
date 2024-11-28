"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

const AddTypePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    varieties: [""] // เริ่มต้นด้วยช่องว่างเปล่า 1 ช่อง
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      setIsLoading(true);
      
      // ตรวจสอบข้อมูล
      if (!formData.type.trim()) {
        throw new Error("กรุณาระบุชนิด");
      }

      if (formData.varieties.length === 0 || !formData.varieties.some(v => v.trim())) {
        throw new Error("กรุณาระบุสายพันธุ์อย่างน้อย 1 รายการ");
      }

      // เตรียมข้อมูลสำหรับส่ง API
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">เพิ่มชนิดใหม่</h1>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ชนิด
          </label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="กรอกชื่อชนิด"
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              สายพันธุ์
            </label>
            <button
              type="button"
              onClick={handleAddVariety}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              <MdAdd /> เพิ่มสายพันธุ์
            </button>
          </div>

          {formData.varieties.map((variety, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={variety}
                onChange={(e) => handleVarietyChange(index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder={`สายพันธุ์ที่ ${index + 1}`}
                required
              />
              {formData.varieties.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveVariety(index)}
                  className="text-red-500 hover:text-red-700"
                  title="ลบสายพันธุ์"
                >
                  <FaTrash size={20} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTypePage;