"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddressSelection({ onChange, disabled = false }) {
    const [provinces, setProvinces] = useState([]);
    const [amphoes, setAmphoes] = useState([]);
    const [tambons, setTambons] = useState([]);
    const [addressForm, setAddressForm] = useState({
      addressLine: "",
      provinceId: "",
      amphoeId: "",
      tambonId: "",
      postalCode: "",
    });
  
    useEffect(() => {
      fetchProvinces();
    }, []);
  
    const fetchProvinces = async () => {
      const res = await fetch("/api/provinces");
      const data = await res.json();
      setProvinces(data);
    };
  
    const fetchAmphoes = async (provinceId) => {
      const res = await fetch(`/api/provinces/${provinceId}/amphoes`);
      const data = await res.json();
      setAmphoes(data);
    };
  
    const fetchTambons = async (amphoeId) => {
      const res = await fetch(`/api/amphoes/${amphoeId}/tambons`);
      const data = await res.json();
      setTambons(data);
    };
  
    const handleAddressChange = (e) => {
      const { name, value } = e.target;
      setAddressForm(prev => ({
        ...prev,
        [name]: value
      }));
  
      // Find the selected location names
      let province = "", district = "", sub_district = "";
      if (name === "provinceId") {
        province = provinces.find(p => p.id === parseInt(value))?.name_th || "";
      } else if (name === "amphoeId") {
        district = amphoes.find(a => a.id === parseInt(value))?.name_th || "";
      } else if (name === "tambonId") {
        sub_district = tambons.find(t => t.id === parseInt(value))?.name_th || "";
      }
  
      // Pass the complete address data to parent
      onChange({
        ...addressForm,
        [name]: value,
        province: name === "provinceId" ? province : addressForm.province,
        district: name === "amphoeId" ? district : addressForm.district,
        sub_district: name === "tambonId" ? sub_district : addressForm.sub_district,
        address: addressForm.addressLine,
        zip_code: addressForm.postalCode
      });
    };
  
    const handleProvinceChange = async (e) => {
      const provinceId = e.target.value;
      const selectedProvince = provinces.find(p => p.id === parseInt(provinceId));
      
      setAddressForm(prev => ({
        ...prev,
        provinceId,
        amphoeId: "",
        tambonId: "",
        province: selectedProvince?.name_th || ""
      }));
  
      if (provinceId) {
        await fetchAmphoes(provinceId);
      } else {
        setAmphoes([]);
        setTambons([]);
      }
  
      handleAddressChange(e);
    };
  
    const handleAmphoeChange = async (e) => {
      const amphoeId = e.target.value;
      const selectedAmphoe = amphoes.find(a => a.id === parseInt(amphoeId));
      
      setAddressForm(prev => ({
        ...prev,
        amphoeId,
        tambonId: "",
        district: selectedAmphoe?.name_th || ""
      }));
  
      if (amphoeId) {
        await fetchTambons(amphoeId);
      } else {
        setTambons([]);
      }
  
      handleAddressChange(e);
    };
  
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <select
              name="provinceId"
              value={addressForm.provinceId}
              onChange={handleProvinceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={disabled}
            >
              <option value="">เลือกจังหวัด</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name_th}
                </option>
              ))}
            </select>
          </div>
  
          <div>
            <select
              name="amphoeId"
              value={addressForm.amphoeId}
              onChange={handleAmphoeChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={!addressForm.provinceId || disabled}
            >
              <option value="">เลือกอำเภอ</option>
              {amphoes.map((amphoe) => (
                <option key={amphoe.id} value={amphoe.id}>
                  {amphoe.name_th}
                </option>
              ))}
            </select>
          </div>
  
          <div>
            <select
              name="tambonId"
              value={addressForm.tambonId}
              onChange={handleAddressChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={!addressForm.amphoeId || disabled}
            >
              <option value="">เลือกตำบล</option>
              {tambons.map((tambon) => (
                <option key={tambon.id} value={tambon.id}>
                  {tambon.name_th}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        <div>
          <textarea
            name="addressLine"
            value={addressForm.addressLine}
            onChange={handleAddressChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="บ้านเลขที่ ซอย หมู่ ถนน"
            disabled={disabled}
            rows={2}
          />
        </div>
  
        <div>
          <input
            type="text"
            name="postalCode"
            value={addressForm.postalCode}
            onChange={handleAddressChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="รหัสไปรษณีย์"
            disabled={disabled}
          />
        </div>
      </div>
    );
  }