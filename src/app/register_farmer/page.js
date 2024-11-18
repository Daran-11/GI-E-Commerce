"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSession } from "next-auth/react";

export default function RegisterFarmer() {
  const [formData, setFormData] = useState({
    farmerName: "",
    address: "",
    sub_district: "",
    district: "",
    province: "",
    zip_dode: "",
    phone: "",
    contactLine: "",
    userId: "", // เพิ่มฟิลด์ userId
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      const session = await getSession();
      if (session) {
        setFormData((prev) => ({
          ...prev,
          userId: session.user.id, // ดึง userId จาก session และบันทึกลงใน formData
        }));
      }
    };
    fetchUserId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "farmerName", "address",
      "sub_district", "district", "province",
      "zip_code", "phone", "contactLine",
    ];

    const emptyFields = requiredFields.filter((field) => !formData[field]);
    if (emptyFields.length > 0) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ตัวเลข 10 หลัก)");
      return false;
    }

    const zip_codeRegex = /^[0-9]{5}$/;
    if (!zip_codeRegex.test(formData.zip_code)) {
      setError("กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง (ตัวเลข 5 หลัก)");
      return false;
    }

    return true;
  };

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess(false);
  
      if (!validateForm()) {
        return;
      }
  
      setLoading(true);
  
      try {
        const response = await fetch("/api/register_farmer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setSuccess(true);
          // รอ 3 วินาทีก่อน redirect
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          setError(data.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
        }
      } catch (error) {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/images/login.png"
            alt="login"
            width={200}
            height={200}
            priority
            className="h-auto w-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ลงทะเบียนเกษตรกร
        </h2>
      </div>
  
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* ส่วนข้อมูลส่วนตัว */}
            
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อ-นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="farmerName"
                  value={formData.farmerName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
          
  
            {/* ส่วนที่อยู่ */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ที่อยู่ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
  
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ตำบล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sub_district"
                    value={formData.sub_district}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    อำเภอ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
  
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    จังหวัด <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    รหัสไปรษณีย์ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    maxLength="5"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>
  
            {/* ส่วนข้อมูลการติดต่อ */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="10"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Line ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactLine"
                  value={formData.contactLine}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            {success && (
              <div className="rounded-md bg-green-50 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      ลงทะเบียนสำเร็จ กรุณารอการอนุมัติจากเทศบาล
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      ระบบจะพาคุณกลับไปยังหน้าหลักในอีก 3 วินาที
                    </div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
  
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? "กำลังดำเนินการ..." : "ลงทะเบียน"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}  