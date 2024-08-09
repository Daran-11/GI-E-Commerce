"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddressManagement() {
  const { data: session , status} = useSession();
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({
    id: "",
    addressLine: "",
    provinceId: "",
    amphoeId: "",
    tambonId: "",
    postalCode: "",
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
      const res = await fetch(`http://localhost:3000/api/users/${session.user.id}/addresses`);
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      } else {
        console.error("Failed to fetch addresses:", res.statusText);
      }
    } else {
      console.error("User ID is not available.");
    }
  };

  const fetchProvinces = async () => {
    const res = await fetch("http://localhost:3000/api/provinces");
    const data = await res.json();
    setProvinces(data);
  };

  const fetchAmphoes = async (provinceId) => {
    const res = await fetch(`http://localhost:3000/api/provinces/${provinceId}/amphoes`);
    const data = await res.json();
    setAmphoes(data);
  };

  const fetchTambons = async (amphoeId) => {
    const res = await fetch(`http://localhost:3000/api/amphoes/${amphoeId}/tambons`);
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

  const handleSave = async () => {
    const method = addressForm.id ? "PUT" : "POST";
    const url = addressForm.id ? `http://localhost:3000/api/addresses/${addressForm.id}` : "http://localhost:3000/api/addresses";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...addressForm, userId: session.user.id }),
    });

    if (res.ok) {
      fetchAddresses();
      setAddressForm({
        id: "",
        addressLine: "",
        provinceId: "",
        amphoeId: "",
        tambonId: "",
        postalCode: "",
      });
      setIsFormVisible(false); // Hide form after saving
    } else {
      console.error("Failed to save address");
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
    });
    fetchAmphoes(address.province.id);
    fetchTambons(address.amphoe.id);
    setIsFormVisible(true); // Show form for editing
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:3000/api/addresses/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchAddresses();
    } else {
      console.error("Failed to delete address");
    }
  };

  return (
    <div>
      <h1>Manage Addresses</h1>
      <button onClick={() => setIsFormVisible(!isFormVisible)}>
        {isFormVisible ? "Cancel" : "Add Address"}
      </button>
      {isFormVisible && (
        <form>
          <div>
            <label>Address Line</label>
            <input
              type="text"
              name="addressLine"
              value={addressForm.addressLine}
              onChange={handleAddressChange}
            />
          </div>
          <div>
            <label>Province</label>
            <select
              name="provinceId"
              value={addressForm.provinceId}
              onChange={handleProvinceChange}
            >
              <option value="">Select Province</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name_th}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Amphoe</label>
            <select
              name="amphoeId"
              value={addressForm.amphoeId}
              onChange={handleAmphoeChange}
            >
              <option value="">Select Amphoe</option>
              {amphoes.map((amphoe) => (
                <option key={amphoe.id} value={amphoe.id}>
                  {amphoe.name_th}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Tambon</label>
            <select
              name="tambonId"
              value={addressForm.tambonId}
              onChange={handleAddressChange}
            >
              <option value="">Select Tambon</option>
              {tambons.map((tambon) => (
                <option key={tambon.id} value={tambon.id}>
                  {tambon.name_th}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={addressForm.postalCode}
              onChange={handleAddressChange}
            />
          </div>
          <button type="button" onClick={handleSave}>
            {addressForm.id ? "Update Address" : "Save Address"}
          </button>
        </form>
      )}

      <h2>Saved Addresses</h2>
      <ul>
        {addresses.length > 0 && addresses.map((address) => (
          <li key={address.id}>
            {address.addressLine}, {address.province.name_th}, {address.amphoe.name_th}, {address.tambon.name_th}, {address.postalCode}
            <button onClick={() => handleEdit(address)}>Edit</button>
            <button onClick={() => handleDelete(address.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
