"use client";
import { useCallback, useState } from "react";

const AddProductDialog = ({ open, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    plotCode: "",
    ProductName: "",
    ProductType: "",
    Price: "",
    Amount: "",
    status: "",
    imageUrl: null,  // New field for image file
  });

  // Format price with commas
  const formatPrice = (value) => {
    const cleanValue = value.replace(/[^0-9.]/g, "");
    const [integerPart, decimalPart] = cleanValue.split(".");
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );
    return decimalPart
      ? `${formattedIntegerPart}.${decimalPart}`
      : formattedIntegerPart;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Handle file input for imageUrl
    if (name === "imageUrl") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, imageUrl: file }));
    } else if (name === "Price") {
      const formattedValue = formatPrice(value);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  

    const handleSubmit = async (e) => {
      e.preventDefault();

       // Convert price with commas to float
    const formattedData = {
      ...formData,
      Price: parseFloat(formData.Price.replace(/,/g, "")).toFixed(2),
    };
    
      // Create a FormData object to handle both text fields and file upload
      const formDataToSend = new FormData();
    
      // Append form fields to FormData
      formDataToSend.append("plotCode", formData.plotCode);
      formDataToSend.append("ProductName", formData.ProductName);
      formDataToSend.append("ProductType", formData.ProductType);
      
      // Convert price to correct format before appending
      const priceWithoutCommas = formData.Price.replace(/,/g, "");
      formDataToSend.append("Price", parseFloat(priceWithoutCommas).toFixed(2));
    
      formDataToSend.append("Amount", formData.Amount);
      formDataToSend.append("status", formData.status);
    
      // Append the image file if one was selected
      if (formData.imageUrl) {
        formDataToSend.append("imageUrl", formData.imageUrl);  // Assuming your backend expects the field "imageUrl"
      }

      
    
      // Submit the form data via POST request
      try {
        const response = await fetch("/api/product/add", {
          method: "POST",
          body: formDataToSend,  // Send FormData in the request body
        });
    
        if (!response.ok) {
          throw new Error("Error creating product");
         
        }
    
        const result = await response.json();
        console.log("Product added:", result);
        handleClose();  // Close the dialog after successful submission
      } catch (error) {
        console.error("Failed to add product:", error);
      }
    };
    

  // Handle dialog close and reset form
  const handleClose = useCallback(() => {
    setFormData({
      plotCode: "",
      ProductName: "",
      ProductType: "",
      Price: "",
      Amount: "",
      status: "",
      imageUrl: null,
    });
    onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="dialog">
      <div className="dialog-title">
        <h2>เพิ่มสินค้า</h2>
      </div>
      <div className="dialog-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="plotCode">รหัสแปลงปลูก</label>
            <input
              id="plotCode"
              name="plotCode"
              type="text"
              value={formData.plotCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ProductName">ชื่อสินค้า</label>
            <input
              id="ProductName"
              name="ProductName"
              type="text"
              value={formData.ProductName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ProductType">สายพันธุ์</label>
            <input
              id="ProductType"
              name="ProductType"
              type="text"
              value={formData.ProductType}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Price">ราคา</label>
            <input
              id="Price"
              name="Price"
              type="text"
              value={formData.Price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Amount">จำนวน</label>
            <input
              id="Amount"
              name="Amount"
              type="number"
              value={formData.Amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">สถานะ</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Status --</option>
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Upload Image</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit">เพิ่มสินค้า</button>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductDialog;
