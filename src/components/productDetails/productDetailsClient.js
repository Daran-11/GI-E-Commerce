"use client";
import { useCart } from "@/context/cartContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { formatDateToThaiBuddhist } from "../../../utils/formatDate";
import Breadcrumb from "../BreadCrumb";
import EmblaCarousel from "../emblaCarousel";

export default function ProductDetailsClient({ product, totalReviewsCount, ProductID }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewsToShow, setReviewsToShow] = useState(5);
  const { addItemToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);



  const addToCart = async () => {
    try {
      const productResponse = await fetch(`/api/product/${product.ProductID}`);
      const productData = await productResponse.json();

      const item = {
        productId: productData.ProductID,
        quantity,
        productName: productData.ProductName,
        productType: productData.ProductType,
        productPrice: productData.Price,
        productAmount: productData.Amount,
        farmerId: productData.farmerId,
        farmerName: productData.farmer.farmerName,
        Description: productData.Description,
        imageUrl: productData.images?.[0]?.imageUrl,
      };

      await addItemToCart(item);
      alert("Product added to cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart");
    }
  };

  const buyNow = async () => {
    if (status === "authenticated" && session) {
      try {
        const productResponse = await fetch(`/api/product/${ProductID}`);
        const productData = await productResponse.json();

        const item = {
          productId: productData.ProductID,
          quantity,
          productName: productData.ProductName,
          productType: productData.ProductType,
          productPrice: productData.Price,
          productAmount: productData.Amount,
          farmerId: productData.farmerId,
          imageUrl: productData.images?.[0]?.imageUrl || "/defaultImage.jpg",
        };

        localStorage.setItem("selectedItems", JSON.stringify([item]));
        router.push("/checkout");
      } catch (error) {
        console.error("Error during buy now:", error);
        alert("Failed to proceed to checkout");
      }
    } else {
      router.push("/login");
    }
  };

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/product/${product.ProductID}/reviews?take=${reviewsToShow}`);
      const data = await res.json();

      if (res.ok) {
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setHasMore(data.reviews.length >= reviewsToShow);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  }, [product.ProductID, reviewsToShow]);

  useEffect(() => {
    fetchReviews();
    fetchTotalOrderAmount();
  }, [fetchReviews, product.ProductID]);

  const fetchTotalOrderAmount = async () => {
    try {
      const response = await fetch(`/api/product/${product.ProductID}/totalAmount`);
      const data = await response.json();

      if (response.ok) {
        setTotalOrderAmount(data.totalAmount);
      } else {
        console.error("Error fetching total order amount:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const loadMoreReviews = () => {
    setReviewsToShow((prev) => prev + 5);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= product.Amount)
    console.log('newQuantity',newQuantity);
    setQuantity(newQuantity);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity('');
    } else {
      let newQuantity = parseInt(value, 10);
      if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
      } else if (newQuantity > product.Amount) {
        newQuantity = product.Amount;
      }
      handleQuantityChange(newQuantity);
    }
  };

  const handleBlur = () => {
    if (quantity === '' || quantity < 1) {
      setQuantity(1);
    }
  };

  const increment = () => {
    if (quantity < product.Amount) {
      console.log("+ triggered")
      handleQuantityChange(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="flex flex-col w-[95%] sm:w-[85%] lg:w-[60%] ml-auto mr-auto mt-[120px]">
      <div className="w-full h-[45px] bg-white rounded-2xl mb-[20px] pl-2 flex items-center">
        <Breadcrumb />
      </div>

      <div className="detail flex justify-center md:justify-start">
        <div className="hidden lg:flex">
        <EmblaCarousel images={product.images || []} />        
        </div>

          {/*replace with Embla carousel here*/}


        <div className="w-full h-fit  bg-white lg:ml-[15px] rounded-2xl p-6">
          <div className="text-[#535353]">
            <div className="lg:hidden flex justify-center">
            <EmblaCarousel images={product.images || []} />
            </div>
            <div className="flex justify-start">
              <p className="mt-3 text-4xl lg:text-5xl">{product.ProductName} {product.ProductType}</p>
            </div>
            <div className="flex w-full text-[#767676] text-xl">
              <div>
              {product.certificates.length > 0 ? (
                product.certificates.map((certificate) => {

                
                  const standards = JSON.parse(certificate.standards); 
                  return (
                  <div key={certificate.id}>
                    {/* Ensure certificate.standards is an array before mapping */}
                    {Array.isArray(standards) && standards.length > 0 ? (
                      standards.map((standard, index) => (
                        <div key={index}>
                      <Image
                        key={index}
                        src={standard.logo}
                        alt={standard.name}
                        width={50}
                        height={50}
                      />
                        </div>
                      ))
                    ) : (
                      <p>No standards information available</p>
                    )}
                  </div>
                  );

})
              ) : (
                <p>No certificates available</p>
              )}
              </div>
              <div className="mr-5 flex justify-start items-center">
                <Rating
                  readonly
                  initialValue={avgRating}
                  size={20}
                  iconsCount={5}
                  allowFraction="true"
                />
                <p className="text-sm">{avgRating} / 5</p>
              </div>
              <p className="hidden md:flex"> ขายแล้ว {totalOrderAmount} กิโลกรัม</p>
            </div>
            <p className="text-[#4eac14] text-[35px] lg:mb-2 lg:mt-2">
              {Number(product.Price).toLocaleString()} บาท/กิโล
            </p>
            <div className="space-y-2 md:space-y-4 w-full  text-[#767676] text-[20px] mb-5">
              <div className="lg:w-fit">
                <div>
                {product.certificates.length > 0 ? (
                product.certificates.map((certificate) => {

                
                  const standards = JSON.parse(certificate.standards); 
                  return (
                  <div key={certificate.id}>
                    {/* Ensure certificate.standards is an array before mapping */}
                    {Array.isArray(standards) && standards.length > 0 ? (
                      standards.map((standard, index) => (
                        <div className=" " key={index}>
                          
                          <p>ทะเบียนเลขที่: {standard.certNumber}</p>
                          <p>วันที่รับรอง {standard.certDate}</p>
                        </div>
                      ))
                    ) : (
                      <p>No standards information available</p>
                    )}
                  </div>
                  );
                  })
              ) : (
                <p>No certificates available</p>
              )}
                </div>
                <div className="w-[250px]">คำอธิบาย</div>
                <div className="w-full text-[#535353]">{product.Description}</div>
                
              </div>
              <div className="w-fit">
                <div className="w-[250px]">ช่องทางติดต่อ</div>
                <div className="w-full text-[#535353]">{product.farmer.contactLine}</div>
              </div>
              <div className="w-fit">
                <div className="w-fit">จำนวน(กิโล)</div>
                <div className="w-fit flex items-center">


              <div className='flex items-center w-fit '>
                <button className='btn w-10 h-10 text-3xl md:text-2xl md:border-2  rounded-full  text-center' onClick={decrement}>
                  -
                </button>
                <div className='items-center justify-center'>
                <input
                  type="number"
                  className="w-4 h-5 lg:w-8 lg:h-10 lg:mx-1 text-center appearance-none"
                  value={quantity}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  min="1"
                  max={product.Amount}
                />
                </div>
                <button className='btn w-10 h-10 text-3xl md:text-2xl md:border-2 rounded-full' onClick={increment}>
                  +
                </button>
              </div>

                  
                  
                  <p className="ml-3 text-[#535353]">มีสินค้า {product.Amount} กิโลกรัม</p>
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
        <p className='mt-2'>{product.Details}</p>
      </div>

      <div className="w-full h-fit bg-white mt-6 p-6 rounded-2xl">
        <div className="w-full flex justify-between items-center">
          <h3 className="text-xl">รีวิวสินค้า</h3>
        </div>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg shadow mb-4">
              
              <div className="flex items-center">
                <Rating readonly initialValue={review.rating} size={20} iconsCount={5} />
                <p className="ml-2 text-sm text-gray-500">{formatDateToThaiBuddhist(review.createdAt)}</p>
              </div>
              <p className='text-[#2b2b2b]'>{review.user.name}</p>
              <p className="mt-2">{review.review}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">ยังไม่มีรีวิว</p>
        )}
        {hasMore && (
          <button
            className="mt-4 text-[#4EAC14] text-sm hover:underline"
            onClick={loadMoreReviews}
          >
            ดูรีวิวเพิ่มเติม
          </button>
        )}
      </div>
      <style jsx>{`
        /* Chrome, Safari, Edge, Opera */
        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Firefox */
        input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}





