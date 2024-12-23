
import { useCart } from "@/context/cartContext";
import { toast } from "react-toastify";


export default function AddToCartButton({ product, ProductID }) {
  const { addItemToCart } = useCart();

  const addToCart = async () => {

    const productResponse = await fetch(`/api/product/${ProductID}`);
    const productData = await productResponse.json();

    const item = {
      productId: productData.ProductID,
      quantity: 1,
      productName: productData.ProductName,
      productType: productData.ProductType,
      productPrice: productData.Price,
      productAmount: productData.Amount,
      Description: productData.Description,
      farmerId: productData.farmerId,
      farmerName: productData.farmer.farmerName,
      imageUrl: productData.images?.[0]?.imageUrl,
    };

    try {
      await addItemToCart(item);
      toast.success('สินค้าได้ถูกเพิ่มไปยังตะกร้า');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('ไม่สามารถเพิ่มสินค้าไปยังตะกร้าได้');
    }
  };

  return (

    <button
      className="w-full h-[35px] text-white bg-[#4eac14] rounded-md hover:bg-[#316b0c] "
      onClick={addToCart}>
      เพิ่มในตะกร้า
    </button>
  )
}
