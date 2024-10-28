"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddressManagement({ onSave }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({
    id: "",
    addressLine: "",
    provinceId: "",
    amphoeId: "",
    tambonId: "",
    postalCode: "",
    isDefault: false,
  });

  const [provinces, setProvinces] = useState([]);
  const [amphoes, setAmphoes] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);


  useEffect(() => {
    if (status === "loading") return; // Optionally handle loading state
    if (!session) {
      router.push("/login");
    } else {
      console.log('Client Session:', session);
      console.log('Client Status:', status);
      fetchAddresses();
      fetchProvinces();
    }
  }, [session, status, router]);

  const fetchAddresses = async () => {
    if (session?.user?.id) {
      const res = await fetch(`/api/users/${session.user.id}/addresses`);
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched Addresses:', data); // Debug the response
        setAddresses(data);
      } else {
        console.error("Failed to fetch addresses:", res.statusText);
      }
    } else {
      console.error("User ID is not available.");
    }
  };


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
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setAddressForm((prev) => ({
      ...prev,
      provinceId,
      amphoeId: "",
      tambonId: ""
    }));

    if (provinceId) {
      await fetchAmphoes(provinceId);
    } else {
      setAmphoes([]);
      setTambons([]);
    }
  };

  const handleAmphoeChange = async (e) => {
    const amphoeId = e.target.value;
    setAddressForm((prev) => ({
      ...prev,
      amphoeId,
      tambonId: ""
    }));

    if (amphoeId) {
      await fetchTambons(amphoeId);
    } else {
      setTambons([]);
    }
  };

  const handleSave = async (onSuccess) => {
    const method = addressForm.id ? "PUT" : "POST";
    const url = `/api/users/${session.user.id}/addresses`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...addressForm,
        userId: session.user.id,
      }),
    });

    if (res.ok) {
      await fetchAddresses(); // Refetch addresses after save
      setAddressForm({
        id: "",
        addressLine: "",
        provinceId: "",
        amphoeId: "",
        tambonId: "",
        postalCode: "",
        isDefault: false,
      });
      setIsFormVisible(false); // Hide form after saving

      // Call the callback function if provided
      if (onSuccess) {
        onSuccess(); // Trigger the checkout page refetch
      }
    } else {
      console.error("Failed to save address");
    }
  };


  const handleSetDefault = async (addressId) => {
    if (session?.user?.id) {
      const userId = session.user.id;

      // Find the address details
      const address = addresses.find((addr) => addr.id === addressId);
      if (!address) {
        console.error('Address not found');
        return;
      }

      // Determine if the current address is already the default
      const isCurrentlyDefault = address.isDefault;

      // Validate address fields before sending
      const { addressLine, provinceId, amphoeId, tambonId, postalCode } = address;
      if (!addressLine || !provinceId || !amphoeId || !tambonId || !postalCode) {
        console.error('Invalid address data');
        return;
      }

      // If the address is already the default, simply return (do nothing)
      if (isCurrentlyDefault) {
        console.log('Address is already the default');
        return;
      }

      const response = await fetch(`/api/users/${userId}/addresses`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: addressId,
          addressLine,
          provinceId: parseInt(provinceId, 10), // Ensure these are numbers
          amphoeId: parseInt(amphoeId, 10),
          tambonId: parseInt(tambonId, 10),
          postalCode,
          isDefault: true, // Set to true or false based on the logic
        }),
      });

      if (response.ok) {
        fetchAddresses(); // Refresh the list of addresses
      } else {
        console.error('Failed to set default address');
      }
    }
  };



  const handleEdit = (address) => {
    setAddressForm({
      id: address.id,
      addressLine: address.addressLine,
      provinceId: address.province.id,
      amphoeId: address.amphoe.id,
      tambonId: address.tambon.id,
      postalCode: address.postalCode,
      isDefault: address.isDefault || false,
    });
    fetchAmphoes(address.province.id);
    fetchTambons(address.amphoe.id);
    setIsFormVisible(true); // Show form for editing
  };

  const handleDelete = async (addressId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this address?');

    if (confirmDelete && session?.user?.id) {
      const userId = session.user.id;

      // Ensure that there are at least 2 addresses before allowing deletion


      try {
        const response = await fetch(`/api/users/${userId}/addresses/${addressId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Remove the deleted address from the state to refresh the UI
          setAddresses((prevAddresses) => prevAddresses.filter((addr) => addr.id !== addressId));
          alert('Address deleted successfully');
        } else {
          const errorData = await response.json();
          console.error('Failed to delete address:', errorData.message);
          alert('Failed to delete address. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('An error occurred while deleting the address. Please try again.');
      }
    }
  };

  return (
    <div>

      {isFormVisible && (
        <form>

          <div className="md:flex  gap-x-2">

            <div className="">
              <select
                name="provinceId"
                value={addressForm.provinceId}
                onChange={handleProvinceChange}
                className="input-address p-2 w-full md:w-[200px] h-15"
              >
                <option value="" >เลือกจังหวัด</option>
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
                className="input-address p-2 w-full md:w-[200px] h-15"
              >
                <option value="">เลือกอำเภอ</option>
                {amphoes.map((amphoe) => (
                  <option key={amphoe.id} value={amphoe.id}>
                    {amphoe.name_th}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden md:flex">
              <select
                name="tambonId"
                value={addressForm.tambonId}
                onChange={handleAddressChange}
                className="input-address p-2 w-full md:w-[150px] h-15"
              >
                <option value="" className="">เลือกตำบล</option>
                {tambons.map((tambon) => (
                  <option key={tambon.id} value={tambon.id}>
                    {tambon.name_th}
                  </option>
                ))}
              </select>
            </div>

          </div>



          <div className="md:hidden">
            <select
              name="tambonId"
              value={addressForm.tambonId}
              onChange={handleAddressChange}
              className="input-address p-2 w-full md:w-[150px] h-15"
            >
              <option value="" className="">เลือกตำบล</option>
              {tambons.map((tambon) => (
                <option key={tambon.id} value={tambon.id}>
                  {tambon.name_th}
                </option>
              ))}
            </select>
          </div>

          <div className="">
            <textarea
              type="text"
              name="addressLine"
              className="input-address p-2 w-full  md:w-[500px]"
              value={addressForm.addressLine}
              onChange={handleAddressChange}
              placeholder="บ้านเลขที่ ซอย หมู่ ถนน/แขวง ตำบล"
            />
          </div>

          <div>
            <input
              type="text"
              name="postalCode"
              value={addressForm.postalCode}
              onChange={handleAddressChange}
              className="input-address p-2 w-full md:w-[200px] h-15"
              placeholder="รหัสไปรษณีย์"
            />
          </div>

          <div className="">

            <input
              type="checkbox"
              className=""
              name="default"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
            />
            <label className="ml-1"> เลือกเป็นที่อยู่ตั้งต้น
            </label>
          </div>

          <div className="border-b-2 pb-3 mb-3">
            {isFormVisible ?
              <button
                className="text-gray-400 w-fit rounded-lg bg-gray-200 hover:bg-gray-300 h-fit  mt-4 mr-5 p-2"
                onClick={() => {
                  setIsFormVisible(false);
                  setAddressForm({
                    id: "",
                    addressLine: "",
                    provinceId: "",
                    amphoeId: "",
                    tambonId: "",
                    postalCode: "",
                    isDefault: false,
                  });
                }}
              >
                ยกเลิก
              </button> : ""
            }

            <button
              className="w-fit h-fit p-2 text-blue-500 border-2 border-blue-400 rounded-lg hover:bg-blue-500 hover:text-white"
              type="button"
              onClick={() => handleSave(onSave)} // Pass onSave to handleSave
            >
              {addressForm.id ? "อัปเดตที่อยู่" : "บันทึกที่อยู่"}
            </button>

          </div>

        </form>
      )}


      <ul>
        <div className="">
          {addresses.length > 0 && addresses.map((address) => (
            <li className="flex justify-between bg-slate-100 rounded-xl px-2 py-2 my-2" key={address.id}>

              <div className="text-sm md:text-base flex justify-start space-x-3">
                <div>
                  {address.addressLine}, {address.province.name_th}, {address.amphoe.name_th}, {address.tambon.name_th}, {address.postalCode}, {address.isDefault}
                </div>
                {address.isDefault && (<div className="px-2 bg-[#4eac14] text-white rounded-xl"> Default </div>)}
              </div>

              <div className="flex justify-end items-center gap-x-4 md:gap-x-8 text-sm md:text-base">
                <button disabled={address.isDefault} className={`text-[#4eac14]  ${address.isDefault ? 'text-gray-500' : 'text-[#4eac14] hover:text-[#7ddb43]'}`} onClick={() => handleSetDefault(address.id)}>
                  {address.isDefault ? "ที่อยู่จัดส่งหลัก" : "เลือกเป็นที่อยู่จัดส่งหลัก"}
                </button>
                <button className="hidden sm:flex w-15 text-blue-500" onClick={() => handleEdit(address)}>แก้ไข</button>
                <button className="hidden sm:flex w-15 text-red-700" onClick={() => handleDelete(address.id)}>ลบ</button>

              </div>

            </li>
          ))}
        </div>

        <li>
          {isFormVisible ? "" :
            <button
              className={isFormVisible ? "text-gray-400" : "text-blue-500"}
              onClick={() => setIsFormVisible(!isFormVisible)}>
              เพิ่ม
            </button>}
        </li>
      </ul>
    </div>
  );
}
