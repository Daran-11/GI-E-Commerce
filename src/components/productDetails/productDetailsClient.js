"use client";
import QuantityHandler from '@/components/quantityhandler';
import { useCart } from '@/context/cartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatDateToThaiBuddhist } from '../../../utils/formatDate';
import Breadcrumb from '../BreadCrumb';

export default function ProductDetailsClient({ product, totalReviewsCount }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState(product.reviews || []);
  const [reviewsToShow, setReviewsToShow] = useState(5); // Initially show 5 reviews
  const { addItemToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

  const buyNow = async () => {
    const productResponse = await fetch(`http://localhost:3000/api/product/${product.ProductID}`);
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
  };


  // Load more reviews when button is clicked
  const loadMoreReviews = async () => {
    setLoading(true);
  
    try {
      const lastReviewId = reviews.length > 0 ? reviews[reviews.length - 1].id : null;
      const res = await fetch(`/api/product/${product.ProductID}/reviews?take=${reviewsToShow + 5}&lastReviewId=${lastReviewId}`);
      const data = await res.json();
  
      if (res.ok && data.reviews) {
        // Check if there are more reviews to load
        if (data.reviews.length < reviewsToShow + 5) {
          setHasMore(false); // No more reviews to load
        }
  
        // Remove duplicates if any
        const newReviews = data.reviews.filter(review => !reviews.some(r => r.id === review.id));
        
        setReviews((prevReviews) => [...prevReviews, ...newReviews]); // Append new reviews to existing ones
        setReviewsToShow((prev) => prev + 5); // Increase the count of reviews to show
      } else {
        console.error('Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error loading more reviews:', error);
    }
  
    setLoading(false);
  };
  
  




  return (
    <>
    <div className='w-full h-[45px] bg-white rounded-2xl mb-[20px] flex items-center justify-start pl-2'>
    <Breadcrumb />
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

            <p className=' text-[#4eac14] text-[40px] mb-4'>{product.Price} บาท/กิโล</p>

            <div className="flex flex-col space-y-4 w-[600px] text-[#767676] text-xl mb-5">
              {/* Row 1 */}
              <div className="flex">
                <div className="w-[250px] ">คำอธิบาย</div>
                <div className="w-full">{product.Description}</div>
              </div>

              {/* Row 2 */}
              <div className="flex">
                <div className="w-[250px]">ช่องทางติดต่อ</div>
                <div className="w-full">{product.farmer.contactLine}</div>
              </div>
              
              {/* Row 3 */}
              <div className="flex items-center">
                <div className="w-[250px]">จำนวน(กิโล)</div>
                <div className="w-full flex items-center">              
                  <QuantityHandler
                  initialQuantity={quantity}
                  productAmount={product.Amount}
                  productId={product.ProductID}
                  onQuantityChange={handleQuantityChange}/>
                <p className='ml-3'>มีสินค้า {product.Amount} กิโลกรัม</p>  
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


        <div className='text-2xl h-fit'>
          รีวิว    
          {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className='text-xl border-2 p-2'>
            <p><strong>User:</strong> {review.user.name}</p>
            <p><strong>Rating:</strong> {review.rating} / 5</p>
            <p><strong>Review:</strong> {review.review || "No review text provided."}</p>
            <p><strong>Date:</strong> {formatDateToThaiBuddhist(review.createdAt)}</p>
          </div>
        ))
      ) : (
        <p>No reviews for this product yet.</p>
      )}
  
  {hasMore && !loading && (
      <button onClick={loadMoreReviews}>Load More Reviews</button>
    )}
        </div>


      </div>
  </div>


    </>
  );
}


