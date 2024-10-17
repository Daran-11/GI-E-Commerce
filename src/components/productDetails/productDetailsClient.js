"use client";
import QuantityHandler from '@/components/quantityhandler';
import { useCart } from '@/context/cartContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { formatDateToThaiBuddhist } from '../../../utils/formatDate';
import Breadcrumb from '../BreadCrumb';



export default function ProductDetailsClient({ product, totalReviewsCount, ProductID }) {

  const router = useRouter();
  const { data: session, status } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState(product.reviews || []);
  const [reviewsToShow, setReviewsToShow] = useState(5); // Initially show 5 reviews
  const { addItemToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantity(newQuantity);
  };

  const addToCart = async () => {
    const productResponse = await fetch(`/api/product/${product.ProductID}`);
    const productData = await productResponse.json();


    const item = {
      productId: productData.ProductID,
      quantity: quantity,
      productName: productData.ProductName,
      productType: productData.ProductType,
      productPrice: productData.Price,
      productAmount: productData.Amount,
      farmerId: productData.farmerId,
      Description: productData.Description,
      imageUrl: productData.images.imageUrl,
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

    if (status === 'authenticated' && session) {
      console.log("Product Id", ProductID)
      const productResponse = await fetch(`/api/product/${ProductID}`);
      const productData = await productResponse.json();

      const item = {
        productId: productData.ProductID,
        quantity: quantity,
        productName: productData.ProductName,
        productType: productData.ProductType,
        productPrice: productData.Price,
        productAmount: productData.Amount,
        farmerId: productData.farmerId,
        imageUrl: productData.images.imageUrl,
      };

      try {
        localStorage.setItem('selectedItems', JSON.stringify([item]));
        console.log('Buy:', item);
        router.push('/checkout');

      } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart');
      }
    }
    else {
      router.push('/login');
    }


  };

  const fetchTotalOrderAmount = async () => {
    try {
      const response = await fetch(`/api/product/${product.ProductID}/totalAmount`);
      const data = await response.json();

      if (response.ok) {
        setTotalOrderAmount(data.totalAmount);
      } else {
        console.error('Error fetching total order amount:', data.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(`/api/product/${product.ProductID}/reviews`);
      const data = await res.json();

      if (res.ok) {
        setAvgRating(data.avgRating);
      }
    };

    fetchReviews();


    fetchTotalOrderAmount();
  }, [product.ProductID]);


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
    <div className='flex flex-col w-[95%] md:w-[60%] ml-auto mr-auto mt-[120px]'>
      <div className='w-full h-[45px] bg-white rounded-2xl mb-[20px] pl-2 flex items-center'>
        <Breadcrumb />
      </div>
      
      <div className='detail  flex justify-center md:justify-start '> 
        <div className='hidden md:flex w-full h-[500px] bg-white  rounded-2xl items-center justify-center text-center '>
              {product.images?.[0]?.imageUrl ? (
                    <Image
                      src={product.images[0].imageUrl}
                      alt={product.ProductName}
                      width={0} // Adjust width as needed
                      height={0} // Adjust height as needed
                      loading="lazy"                      
                      sizes="100vw"
                      className='w-full h-full object-cover rounded-2xl'
                    />
                  ) : (
                    <img className="w-full h-full object-cover rounded-2xl" src="/phulae.jpg" alt="Card Image" />
                  )}
        </div>

        <div className=' w-full h-fit lg:h-[500px]  bg-white lg:ml-[25px] rounded-2xl p-6'>
          <div className=' text-[#535353]'>
            <div className='lg:hidden flex justify-center'>
                      {product.images?.[0]?.imageUrl ? (
                            <Image
                              src={product.images[0].imageUrl}
                              alt={product.ProductName}
                              width={0} // Adjust width as needed
                              height={0} // Adjust height as needed
                              sizes="100vw"
                              className='w-full h-[30vh] object-center rounded-2xl'
                            />
                          ) : (
                            <img className="w-full h-full object-cover rounded-2xl" src="/phulae.jpg" alt="Card Image" />
                          )}
            </div>
            <div className='flex justify-start'>
              <p className='mt-3 text-4xl lg:text-5xl'>{product.ProductName} {product.ProductType}</p>
            </div>

            <div className='flex w-full text-[#767676] text-xl'>

              <div className=' mr-5  flex justify-start items-center'>
                <Rating
                  readonly
                  initialValue={avgRating} // Pass the average rating value
                  size={20} // Set star size
                  iconsCount={5}
                  allowFraction='true'
                />
                <p className='text-sm'>{avgRating} / 5</p> {/* Display avg rating */}
              </div>

              <p className='hidden md:flex'> ขายแล้ว {totalOrderAmount} กิโลกรัม</p>
            </div>


            <p className=' text-[#4eac14] text-[35px] lg:mb-4 lg:mt-2'>{Number(product.Price).toLocaleString()} บาท/กิโล</p>

            <div className=" space-y-2  md:space-y-4 w-fit lg:w-[600px] text-[#767676] text-[20px] mb-5">
              {/* Row 1 */}
              <div className="w-fit">
                <div className="w-[250px] ">คำอธิบาย</div>
                <div className="w-full text-[#535353]">{product.Description}</div>
              </div>

              {/* Row 2 */}
              <div className="w-fit">
                <div className="w-[250px]">ช่องทางติดต่อ</div>
                <div className="w-full text-[#535353]">{product.farmer.contactLine}</div>
              </div>

              {/* Row 3 */}
              <div className="w-fit">
                <div className="w-fit">จำนวน(กิโล)</div>
                <div className="w-fit flex items-center">
                  <QuantityHandler
                    initialQuantity={quantity}
                    productAmount={product.Amount}
                    productId={product.ProductID}
                    onQuantityChange={handleQuantityChange} />
                  <p className='ml-3   text-[#535353]'>มีสินค้า {product.Amount} กิโลกรัม</p>
                </div>
              </div>
            </div>
            <div className='flex justify-between md:justify-start'>
              <button
                className='action-button bg-[#4EAC14] rounded-xl text-white w-[150px] h-[50px] font-light plausible-event-name=Addcart'
                onClick={buyNow}>
                ซื้อเลย
              </button>

              <button
                className='action-button ml-4 text-[#4EAC14] border-2  border-gray-500 rounded-xl plausible-event-name=Addcart '
                onClick={addToCart}>
                เพิ่มในตะกร้า
              </button>
            </div>

          </div>


        </div>
      </div>


      <div className='text-[#535353] bg-white rounded-2xl mt-5 p-4'>
        <p className='text-2xl'>รายละเอียด</p>
        <p className='mt-2'>{product.Description}</p>
      </div>

      <div className='text-[#535353] bg-white rounded-2xl mt-5 p-4'>
        <p className='text-2xl'>รีวิว ({totalReviewsCount})</p>
        {reviews.length > 0 ? (
          reviews.slice(0, reviewsToShow).map((review) => (
            <div key={review.id} className='flex border-b border-gray-300 py-2'>
              <div className='mr-4'>
                <Image
                  src={review.userImage || '/defaultUserImage.jpg'} // Use a default image if none is provided
                  alt={review.username}
                  width={50}
                  height={50}
                  className='rounded-full'
                />
              </div>
              <div>
                <p className='font-semibold'>{review.username}</p>
                <Rating readonly initialValue={review.rating} size={20} iconsCount={5} />
                <p className='text-sm'>{formatDateToThaiBuddhist(review.createdAt)}</p>
                <p>{review.review}</p>
              </div>
            </div>
          ))
        ) : (
          <p className='text-sm text-gray-600'>ยังไม่มีรีวิว</p>
        )}
        {hasMore && (
          <button onClick={loadMoreReviews} className='mt-4 text-[#4eac14]'>โหลดรีวิวเพิ่มเติม</button>
        )}
        {loading && <p>กำลังโหลด...</p>}
      </div>
    </div>
  );
}


