"use client";
import QuantityHandler from '@/components/quantityhandler';
import { useCart } from '@/context/cartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

<<<<<<< HEAD
export default function ProductDetailsClient({ product, totalReviewsCount ,ProductID }) {

=======
export default function ProductDetailsClient({ product }) {
>>>>>>> parent of 93831e9 (pick from 58b13bcf new)
  const router = useRouter();
  const { data: session, status } = useSession();
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantity(newQuantity);
  };

  const addToCart = async () => {
    const productResponse = await fetch(`http://localhost:3000/api/product/${product.ProductID}`);
    const productData = await productResponse.json();

    const item = {
      productId: productData.ProductID,
      quantity: quantity,
      productName: productData.ProductName,
      productType: productData.ProductType,
      productPrice: productData.Price,
      productAmount: productData.Amount,
<<<<<<< HEAD
      farmerId: productData.farmerId,
=======
>>>>>>> parent of 93831e9 (pick from 58b13bcf new)
      Description: productData.Description
    };

    try {
      await addItemToCart(item);
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const buyNow = async () => {

<<<<<<< HEAD
    if ( status === 'authenticated' && session) {
      console.log("Product Id", ProductID)
      const productResponse = await fetch(`http://localhost:3000/api/product/${ProductID}`);
      const productData = await productResponse.json();
  
      const item = {
        productId: productData.ProductID,
        quantity: quantity,
        productName: productData.ProductName,
        productType: productData.ProductType,
        productPrice: productData.Price,
        productAmount: productData.Amount,
        farmerId: productData.farmerId
      };
  
      try {
        localStorage.setItem('selectedItems', JSON.stringify([item]));
        console.log('Buy:',item);
        router.push('/checkout');
  
      } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart');
      }
=======
    const item = {
      productId: productData.ProductID,
      quantity: quantity,
      productName: productData.ProductName,
      productType: productData.ProductType,
      productPrice: productData.Price,
      productAmount: productData.Amount,
    };

    try {
      await addItemToCart(item);
      router.push('/cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart');
>>>>>>> parent of 93831e9 (pick from 58b13bcf new)
    }
    else {
      router.push('/login');
    }


  };




  return (
    <>
    <div className='w-full h-[45px] bg-white rounded-2xl mb-[20px] flex items-center justify-start pl-2'>
      <p>
        breadcrumb
      </p>
    </div>
      <div className='container-detail  w-full h-full flex justify-start '> 
        <div className='w-full h-[500px] bg-white  rounded-2xl flex items-center justify-center text-center '>
            รูป
        </div>
        <div className=' w-[700px] h-[500px]  bg-white ml-[25px] rounded-2xl '>
          <div className='product-name m-[25px] text-[#535353]'>
            <p className=' text-5xl  '>{product.ProductName} {product.ProductType}</p>

            <div className='flex w-[560px] text-[#767676] text-xl'>
              <div className='mr-5'> ดาว </div>
              <p className=''> ขายแล้ว ... กิโลกรัม</p>
            </div>

            <p className=' text-[#4eac14] text-[40px] mb-4'>{product.Price} บาท</p>

            <div className="  space-y-4 w-[600px] text-[#767676] text-[20px] mb-5">
              {/* Row 1 */}
              <div className="">
                <div className="w-[250px] ">คำอธิบาย</div>
                <div className="w-full text-[#535353]">{product.Description}</div>
              </div>

              {/* Row 2 */}
              <div className="">
                <div className="w-[250px]">ช่องทางติดต่อ</div>
<<<<<<< HEAD
                <div className="w-full text-[#535353]">{product.farmer.contactLine}</div>
=======
                <div className="w-full">เฟสบุ้ค</div>
>>>>>>> parent of 93831e9 (pick from 58b13bcf new)
              </div>
              
              {/* Row 3 */}
              <div className=" items-center">
                <div className="w-[250px]">จำนวน(กิโล)</div>
                <div className="w-full flex items-center">              
                  <QuantityHandler
                  initialQuantity={quantity}
                  productAmount={product.Amount}
                  productId={product.ProductID}
                  onQuantityChange={handleQuantityChange}/>
                <p className='ml-3  text-[#535353]'>มีสินค้า {product.Amount} กิโลกรัม</p>  
                </div>
              </div>
            </div>

              <button 
              className='action-button bg-[#4EAC14] rounded-xl text-white w-[150px] h-[50px] font-light'
              onClick={buyNow}>
                ซื้อเลย
              </button>
      
              <button 
              className='action-button ml-4 text-[#4EAC14] border-2  border-gray-500 rounded-xl  ' 
              onClick={addToCart}>
              เพิ่มในตะกร้า
              </button>              
          </div>
  

        </div>
      </div>

  
  <div className='flex items-start justify-start my-5'>
    <div className='w-[100px] h-[100px] bg-white rounded-2xl '>

    </div>
  </div>

  <div className='flex item- w-full h-fit bg-white rounded-2xl ' >

      <div className=' w-full m-[25px] text-[#535353]'>
        <div className='text-2xl h-[300px]'>
          รายละเอียดเพิ่มเติม
          <div>
            
          </div>
        </div>


<<<<<<< HEAD
        <div className='text-2xl h-fit'>
          รีวิว    
          {reviews.length > 0 ? (
          <div>
            {reviews.map((review) => (
              <div key={review.id} className="text-xl border-2 p-2">
                <p>{review.user.name}</p>
                <p>คะแนนรีวิว: {review.rating} / 5</p>
                <p>{review.review || "No review text provided."}</p>
                <p>วันที่: {formatDateToThaiBuddhist(review.createdAt)}</p>
              </div>
            ))}
            {/* Place Load More button here */}
            {hasMore && !loading && (
              <button onClick={loadMoreReviews} className="mt-4 p-2 bg-blue-500 text-white rounded">
                Load More Reviews
              </button>
            )}
            {loading && <p>Loading...</p>}
          </div>
        ) : (
          <p>No reviews for this product yet.</p>
        )}

=======
        <div className='text-2xl h-[300px]'>
          รีวิว
          <div>

          </div>
>>>>>>> parent of 93831e9 (pick from 58b13bcf new)
        </div>


      </div>
  </div>


    </>
  );
}


