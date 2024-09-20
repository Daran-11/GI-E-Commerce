
import { useCart } from "@/context/cartContext";


export default function AddToCartButton({product}) {
    const { addItemToCart } = useCart();

    const addToCart = async () => {
        const productResponse = await fetch(`http://localhost:3000/api/product/${product.ProductID}`);
        const productData = await productResponse.json();
    
    
        const item = {
          productId: productData.ProductID,
          quantity: 1,
          productName: productData.ProductName,
          productType: productData.ProductType,
          productPrice: productData.Price,
          productAmount: productData.Amount,
          Description: productData.Description,
          farmerId: productData.farmerId
        };
    
        try {
          await addItemToCart(item);
          alert('Product added to cart');
        } catch (error) {
          console.error('Error adding product to cart:', error);
          alert('Failed to add product to cart');
        }
      };
    
  return (
      
        <button 
        className="w-[100px] h-[35px] text-white bg-[#4eac14] rounded-xl hover:bg-[#316b0c]"
        onClick={addToCart}>
            เพิ่มในตะกร้า
        </button>
  )
}
