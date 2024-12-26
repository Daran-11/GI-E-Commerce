"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSession } from "next-auth/react";
import AddressRegisterFarmer from "@/components/AddressRegisterFarmer";

export default function RegisterFarmer() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    contactLine: "",
    userId: "",
    address: "",
    sub_district: "",
    district: "",
    province: "",
    zip_code: "",
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isAddressComplete, setIsAddressComplete] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notFoundError, setNotFoundError] = useState(false);

  const handleAddressChange = (addressData, isComplete) => {
    setIsAddressComplete(isComplete);
    setFormData(prev => ({
      ...prev,
      address: addressData.address,
      sub_district: addressData.sub_district,
      district: addressData.district,
      province: addressData.province,
      zip_code: addressData.zip_code,
    }));
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const session = await getSession();
      if (session) {
        setFormData((prev) => ({
          ...prev,
          userId: session.user.id,
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
    if (!firstName.trim() || !lastName.trim()) {
      setError("กรุณากรอกชื่อและนามสกุล");
      return false;
    }
  
    if (!isAddressComplete) {
      setError("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
      return false;
    }
  
    if (!formData.phone || !formData.contactLine) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }
  
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ตัวเลข 10 หลัก)");
      return false;
    }
  
    const zipCodeRegex = /^[0-9]{5}$/;
    if (!zipCodeRegex.test(formData.zip_code)) {
      setError("กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง (ตัวเลข 5 หลัก)");
      return false;
    }
  
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setNotFoundError(false);
  
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
    try {
      const submitData = {
        farmerName: `${firstName} ${lastName}`.trim(),
        userId: formData.userId,
        phone: formData.phone,
        contactLine: formData.contactLine,
        address: formData.address,
        sub_district: formData.sub_district,
        district: formData.district,
        province: formData.province,
        zip_code: formData.zip_code
      };
  
      if (!submitData.address || !submitData.sub_district || 
          !submitData.district || !submitData.province || 
          !submitData.zip_code) {
        setError("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
        setLoading(false);
        return;
      }
  
      const response = await fetch("/api/register_farmer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else if (response.status === 404) {
        setNotFoundError(true);
      } else {
        setError(data.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ลงทะเบียนเกษตรกร
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Success Message */}
            {success && (
              <div className="rounded-md bg-green-50 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      สมัครเป็นเกษตรกรสำเร็จ
                    </p>
                    <p className="mt-2 text-sm text-green-700">
                      ระบบจะพาคุณกลับไปยังหน้าหลักในอีก 3 วินาที
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Not Found Error */}
            {notFoundError && (
              <div className="rounded-md bg-yellow-50 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-800">
                      ไม่พบข้อมูลในฐานข้อมูลเทศบาล
                    </p>
                    <p className="mt-2 text-sm text-yellow-700">
                      ไม่พบข้อมูลของผู้ใช้ในฐานข้อมูลของเทศบาล โปรดติดต่อเทศบาล
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* General Error */}
            {error && !notFoundError && (
              <div className="rounded-md bg-red-50 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ส่วนชื่อ-นามสกุล */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* ส่วนที่อยู่ */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ที่อยู่ <span className="text-red-500">*</span>
                </label>
                <AddressRegisterFarmer
                  onChange={(data, isComplete) => handleAddressChange(data, isComplete)}
                  disabled={loading}
                />
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