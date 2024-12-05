"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdAdd, MdDelete } from "react-icons/md";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">แก้ไขชนิด</h1>

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
                value={variety.name}
                onChange={(e) => handleVarietyChange(index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder={`สายพันธุ์ที่ ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveVariety(index)}
                className="text-red-500 hover:text-red-700"
                title="ลบสายพันธุ์"
              >
                <MdDelete size={24} />
              </button>
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
            disabled={isSaving}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTypePage;