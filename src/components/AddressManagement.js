"use client";

import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AddressManagement({session , onSave, onLoad, onSuccess }) {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    id: "",
    addressLine: "",
    provinceId: "",
    amphoeId: "",
    tambonId: "",
    postalCode: "",
    isDefault: false,
  });

  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const userId = session?.user?.id
  console.log("user id ",userId)

  // Fetch addresses using SWR
  const { data: addresses, mutate: mutateAddresses, isLoading, error } = useSWR(
    session && session?.user?.id ? `/api/users/${session.user.id}/addresses` : null,
    fetcher,
    { revalidateOnFocus: false } // ป้องกันการ re-fetch ขณะเปลี่ยนแท็บ
  );



    // Effect to trigger refetch when session status changes
    useEffect(() => {
      if ( session) {
        // Refetch addresses when session becomes authenticated
        mutateAddresses();
      }
    }, [ session, mutateAddresses]); // Re-run the effect when status or session changes

  useEffect(() => {
    // เรียก onLoad เมื่อ component โหลดเสร็จ
    if (onLoad) {
      onLoad();
    }
  }, []); // [] หมายถึงเรียกแค่ครั้งเดียวเมื่อ component โหลดเสร็จ






  const { data: provinces = [], error: provincesError } = useSWR(
    "/api/provinces",
    fetcher
  );

  const { data: amphoes = [], error: amphoesError } = useSWR(
    addressForm.provinceId ? `/api/provinces/${addressForm.provinceId}/amphoes` : null,
    fetcher
  );

  const { data: tambons = [], error: tambonsError } = useSWR(
    addressForm.amphoeId ? `/api/amphoes/${addressForm.amphoeId}/tambons` : null,
    fetcher
  );

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setAddressForm((prev) => ({
      ...prev,
      provinceId,
      amphoeId: "",
      tambonId: "",
    }));
  };

  const handleAmphoeChange = (e) => {
    const amphoeId = e.target.value;
    setAddressForm((prev) => ({
      ...prev,
      amphoeId,
      tambonId: "",
    }));
  };

  const handleSave = async (onSuccess, onSave) => {
    if (onSave) {
      onSave(); // Trigger the checkout page refetch
    }

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
      await mutateAddresses(); // Refetch addresses after save
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


  const handleSetDefault = async (addressId, onSave) => {
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
        mutateAddresses(); // Refresh the list of addresses
        if (onSave) {
          onSave(); // Trigger onSave หลังจากลบเสร็จ
        }
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
    setIsFormVisible(true); // Show form for editing
  };

  const handleDelete = async (addressId, onSave) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this address?');

    if (confirmDelete && session?.user?.id) {
      const userId = session.user.id;

      try {
        const response = await fetch(`/api/users/${userId}/addresses/${addressId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('Response:', await response.json()); // ดูว่า API ตอบอะไรกลับมา
          mutateAddresses((prevAddresses) => prevAddresses.filter((addr) => addr.id !== addressId));
          toast.success('ลบที่อยู่จัดส่งสำเร็จ');
          if (onSave) {
            onSave(); // Trigger onSave หลังจากลบเสร็จ
          }

        } else {
          const errorData = await response.json();
          console.error('Failed to delete address:', response.status, errorData.message);
          toast.error('ไม่สามารถลบที่อยู่ได้ โปรดลองอีกครั้ง');
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('ไม่สามารถลบได้ โปรดลองอีกครั้ง');
      }
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen fixed top-0 left-0 bg-white bg-opacity-80 z-50">
        <CircularProgress />
      </div>
    );

  }

  if (error) {
    console.error(error); // Log error to debug the issue
    return <div>เกิดข้อผิดพลาดในการโหลดข้อมูล</div>;
  }

  
  if (!addresses) {
    console.log("Addresses not fetched yet");
  }

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
            <label className="ml-1">
              <input
                type="checkbox"
                className="w-7"
                name="default"
                checked={addressForm.isDefault}
                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
              />
              เลือกเป็นที่อยู่ตั้งต้น
            </label>
          </div>

          <div className="border-b-2 pb-3 mb-3">


            <button
              className="px-6 mt-4 mr-5 p-2  w-fit bg-blue-500 text-white  rounded-lg hover:outline hover:outline-2 hover:outline-blue-500  hover:bg-white  hover:text-blue-500"
              type="button"
              onClick={() => handleSave(onSave)} // Pass onSave to handleSave
            >
              {addressForm.id ? "อัปเดตที่อยู่" : "บันทึกที่อยู่"}
            </button>

            {isFormVisible ?
              <button
                className="px-4 text-gray-700 w-fit rounded-lg  bg-gray-200 hover:bg-white hover:outline hover:outline-0 hover:underline   mt-4 mr-5 p-2"
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

          </div>

        </form>
      )}


      <ul>
        <div className="">
          {!isLoading &&
            addresses?.length > 0 &&
            addresses.map((address) => (
              <li
                className="flex justify-between bg-slate-100 rounded-xl px-2 py-2 my-2"
                key={address.id}
              >
                <div className="text-sm md:text-base flex justify-start space-x-2">
                  {/* Loading is gone when data is loaded */}
                  <div className="text-start ">
                    {address.addressLine}, {address.province.name_th},{" "}
                    {address.amphoe.name_th}, {address.tambon.name_th},{" "}
                    {address.postalCode}, {address.isDefault}
                  </div>
                  {address.isDefault && (
                    <div className="text-center w-fit  px-2 bg-[#4eac14] text-white rounded-xl">
                      ที่อยู่หลัก
                    </div>
                  )}
                </div>

                <div className="flex justify-end items-center gap-x-4 md:gap-x-8 text-sm md:text-base">
                  <button
                    disabled={address.isDefault}
                    className={`${address.isDefault
                      ? "text-gray-500 hidden sm:flex"
                      : "text-[#4eac14] hover:text-[#7ddb43] hidden sm:flex"
                      }`}
                    onClick={() => handleSetDefault(address.id, onSave)}
                  >
                    {address.isDefault ? "ที่อยู่จัดส่งหลัก" : "เลือกเป็นที่อยู่จัดส่งหลัก"}
                  </button>
                  <button
                    className="flex w-15 text-blue-500"
                    onClick={() => {
                      handleEdit(address);
                      {/*add trigger onsave function*/ }

                    }}
                  >
                    แก้ไข
                  </button>

                  <button
                    className="flex w-15 text-red-700"
                    onClick={() => {

                      handleDelete(address.id, onSave)
                    }


                    }
                  >
                    ลบ
                  </button>

                </div>
              </li>
            ))}
        </div>

        <li>
          {isFormVisible ? "" :
            <button
              className={isFormVisible ? "text-gray-400" : "rounded-lg px-5 py-2 bg-blue-500 text-white hover:outline hover:outline-2 hover:outline-blue-500 hover:text-blue-500 hover:bg-white "}
              onClick={() => {

                setIsFormVisible(!isFormVisible)
              }}>
              เพิ่มที่อยู่ใหม่
            </button>}
        </li>
      </ul>
    </div>
  );
}
