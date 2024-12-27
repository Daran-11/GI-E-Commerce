"use client";
import { useCart } from "@/context/cartContext";
import { ShoppingBasket } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { toast } from "react-toastify";
import DateComponent from "../../../utils/formatDate";
import Breadcrumb from "../BreadCrumb";
import EmblaCarousel from "../EmblaCarousel";

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
      toast.success("สินค้าได้ถูกเพิ่มไปยังตะกร้า");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("ไม่สามารถเพิ่มสินค้าไปยังตะกร้า");
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
        toast.error("ไม่สามารถไปยังหน้าชำระเงิน");
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
      console.log('newQuantity', newQuantity);
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
            <div className="text-[#535353]">
              <p className=" text-4xl lg:text-5xl">{product.ProductName} {product.ProductType}</p>
              <p className="text-xl"> ผู้ขาย {product.farmer.farmerName} </p>
            </div>
            <div className="flex w-full text-[#767676] text-xl">
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
            <p className="text-[#4eac14] text-[35px] lg:mb-1 lg:mt-2">
              {Number(product.Price).toLocaleString()} บาท/กิโลกรัม
            </p>
            <div className="space-y-2 md:space-y-4 w-full   text-[22px] mb-5">
              <div className="lg:w-full">
              <div className="w-[250px] font-medium ">คำอธิบาย</div>
                <div className="w-full text-[#535353] text-base">{product.Description}</div>
              </div>
              
              <div>
                <div className="flex items-center">
                  <div className="w-fit font-medium  text-base mr-2">ช่องทางติดต่อ:</div>
                  <div className="w-fit text-[#535353] text-base">{product.farmer.contactLine}</div>
                </div> 

                {/* แสดงวันที่เก็บเกี่ยว */}
                {product.HarvestedAt && (
                  <div className="flex items-center">
                    <span className="w-fit text-base mr-2">วันที่เก็บเกี่ยว:</span>
                    <span className="w-fit text-base ">
                      <DateComponent date={product.HarvestedAt}/>
                    </span>
                  </div>
                )}                               
              </div>




              <div className="w-full border-t-2 pt-3">
                <div className="w-fit">เลือกจำนวน(กิโลกรัม)</div>
                <div className="w-fit flex items-center">

                  <div className='flex items-center w-fit '>
                    <button className='btn w-10 h-10 text-3xl md:text-2xl  border border-gray-400 md:border-2  rounded-full  text-center focus:border-2  focus:border-[#4eac14]' onClick={decrement}>
                      -
                    </button>
                    <div className='items-center justify-center mx-2 md:mx-0'>
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
                    <button className='btn w-10 h-10 text-3xl md:text-2xl border border-gray-400 md:border-2 rounded-full  focus:border-2  focus:border-[#4eac14]' onClick={increment}>
                      +
                    </button>
                  </div>
                  <p className="ml-3 text-[#535353] text-base">มีสินค้า {product.Amount} กิโลกรัม</p>
                </div>
              </div>
            </div>

            <div className='flex justify-between md:justify-start space-x-2 md:space-x-3'>
              <button
                className='action-button btn-submit mt-2 w-[130px] h-[40px] p-2 bg-[#4eac14] text-white cursor-pointer hover:bg-[#4eac14] hover:opacity-70 transition focus:ring-2 focus:ring-offset-2 focus:ring-[#4eac14] plausible-event-name=Addcart'
                onClick={buyNow}>
                ซื้อเลย
              </button>

              <button
                className='action-button mt-2 flex items-center pr-2 !w-[200px] h-[40px] p-2 cursor-pointer border-2 rounded-3xl border-[#4eac14] text-[#4eac14]  focus:ring-2 focus:ring-offset-2 hover:opacity-70 focus:ring-[#4eac14] hover:underline plausible-event-name=Addcart '
                onClick={addToCart}>
                <ShoppingBasket/>
                <p className="pl-2">เพิ่มไปยังตะกร้า</p>
              </button>
            </div>
          </div>
        </div>
      </div>

        <div className="Certificate text-[#535353] bg-white rounded-2xl mt-5 p-4">
            <h1 className="text-2xl mb-2">มาตรฐาน</h1>
            {product.certificates.map((cert) => {
                // Ensure certificate exists and has the 'certificate' property
                if (cert.certificate && cert.certificate.standards) {
                    const standards = cert.certificate.standards; // This is the JSON field
                    try {
                    // Assuming standards is a JSON string, parse it if necessary
                        const standardsObj = JSON.parse(standards);
                    return (
                        <div className="w-full md:flex justify-start " key={cert.certificate.id}>
                            {standardsObj.map((standard, index) => (
                                <div className="flex  p-2 w-full border-2 rounded-xl space-x-3 mb-3 m-2" key={index}>
                                    <div className="flex justify-start w-fit items-center">
                                        <div>                               
                                            <Image
                                            key={index}
                                            src={standard.logo}
                                            alt={standard.name}
                                            width={80}
                                            height={80}
                                            />                          
                                        </div>
                                        <div className="pl-1  justify-between w-full text-base">
                                            <h1>มาตรฐาน: {standard.name}</h1>
                                            <div className=" w-fit">ทะเบียน: {standard.certNumber}</div>
                                            <div className="flex items-center text-base">
                                            <p className=" mr-2">วันที่รับรอง </p>         
                                            <div className="">
                                            <DateComponent date={standard.certDate}/>       
                                            </div>
                                                                        
                                            </div>

                                                                    
                                        </div>                               
                                    </div>
                                </div>
                                ))}
                        </div>
                            );
                        } catch (error) {
                        console.error('Error parsing standards:', error);
                        return <div>Invalid standards data</div>;
                        }
                    } else {
                        // If no standards found for the certificate
                        return (
                        <div key={cert.certificate ? cert.certificate.id : 'no-id'}>
                            No standards found for this certificate.
                        </div>
                        );
                    }})
            }

        </div>

      <div className='text-[#535353] bg-white rounded-2xl mt-5 p-4'>
        <p className='text-2xl mb-2'>รายละเอียด</p>
        {product.Details ? (
          <p className="mt-2">{product.Details}</p>
        ) : (
          <p className="mt-2 text-gray-500">ไม่มีข้อมูลรายละเอียดสินค้า</p>
        )}
      </div>

      <div className="text-[#535353] w-full h-fit bg-white mt-6 p-4 rounded-2xl">
        <div className="w-full flex justify-between items-center">
          <h3 className="text-2xl mb-2">รีวิวสินค้า</h3>
        </div>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg shadow mb-4">

              <div className="flex items-center">
                <Rating readonly initialValue={review.rating} size={20} iconsCount={5} />
                <p className="ml-2 text-sm text-gray-500">                      
                  <DateComponent date={review.createdAt}/>
                  </p>
              </div>
              <p className='text-[#2b2b2b]'>{review.user.name}</p>
              <p className="mt-2">{review.review}</p>
            </div>
          ))
        ) : (
          <p className=" text-gray-500">ยังไม่มีรีวิวในสินค้านี้</p>
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





