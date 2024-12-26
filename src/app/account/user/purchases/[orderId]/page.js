'use client';

import ConfirmDeliveryButton from '@/components/ConfirmDeliveryButton';
import { Box, Button, Modal, TextField } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { toast } from "react-toastify";
const deliveryStatusTranslations = {
  Preparing: 'เตรียมสินค้า',
  Shipped: 'การจัดส่ง',
  //OutForDelivery: 'นำส่งพัสดุ',
  Delivered: 'สำเร็จ',
  Canceled: 'ยกเลิก',
  Returned: 'ส่งคืน',
  FailedDelivery: 'การจัดส่งล้มเหลว',
  RefundProcessed: 'คืนเงินเสร็จสิ้น',
};

const deliveryStatuses = ['Preparing', 'Shipped', 'Delivered'];

function OrderDetails({ params }) {
  const { orderId } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [userReviews, setUserReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);



   
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`/api/users/${session.user.id}/purchases/${orderId}`);
          if (response.ok) {
            const data = await response.json();
            setOrderDetails(data.order);

            // Fetch user reviews for each product in the order
            const reviewResponse = await fetch(`/api/users/${session.user.id}/reviews-rating/${orderId}`);
            if (reviewResponse.ok) {
              const reviewData = await reviewResponse.json();

              // Set reviewed product IDs
              setUserReviews(reviewData.reviewedProductIds || []);
            } else {
              console.error('Failed to fetch user reviews');
            }
          } else {
            setError('Failed to fetch order details');
          }
        } catch (error) {
          setError('An error occurred while fetching order details');
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
        if (status === 'unauthenticated') {
          router.push('/login');
      }
      if (status === 'authenticated' && session?.user?.id && orderId) {

      fetchOrderDetails();
    }
  }, [status, session, router, orderId]);


  const handleDeliverySuccess = async (orderId) => {
    fetchOrderDetails();
  }

  const submitReview = async () => {
    try {
      const response = await fetch('/api/rating-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          productId: selectedProductId,
          orderId,
          rating,
          review,  // Optional review text field
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('ได้รับรีวิวแล้ว ขอบคุณครับ/ค่ะ');
      } else {
        toast.error('พบข้อผิดพลาด' + data.error);
      }
    } catch (error) {
      console.error('พบข้อผิดพลาดในการยืนยันเขียนรีวิว', error);
      toast.error('ไม่สามารถส่งรีวิวได้');
    } finally {
      closeReviewModal();

    }
  };

  const handleRating = (rate) => {
    setRating(rate);
  };

  const openReviewModal = (product) => {
    setSelectedProductId(product.ProductID);
    setSelectedProduct(product); // เก็บข้อมูลผลิตภัณฑ์ใน state
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setRating(0);
  };

  if (status === 'loading' || loading) {
    return  <div className='w-full h-screen bg-white rounded-xl p-6'>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-500 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>;

    </div>

  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!orderDetails) {
    return <div>No order details found.</div>;
  }

  // Calculate current step based on delivery status, ensuring it only uses the defined deliveryStatuses array
  const currentStepIndex = deliveryStatuses.includes(orderDetails.deliveryStatus)
    ? deliveryStatuses.indexOf(orderDetails.deliveryStatus)
    : deliveryStatuses.length - 1; // Default to the last step if the status is not found

  return (
    <div className="w-full h-screen p-6 rounded-xl space-y-7 ">

      <div className='bg-white p-6 rounded-xl'>
        <div className='flex justify-between border-b-2 items-center'>       
          <h1 className=' text-2xl md:text-4xl text-[#535353] pb-1  mb-1'>ข้อมูลคำสั่งซื้อ</h1>
          <p className='text-xl'>รหัสคำสั่งซื้อ: {orderDetails.id}</p>
        </div>

        <div className="progress-bar-container my-4   ">
          <div className='relative '>
            {/* Progress Bar Line */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2  w-[69%]   h-2  bg-gray-300 rounded-full"></div>

            <div
              className={` absolute top-3 left-0  h-2 rounded-full progress-pulse`}
              style={{
                width: `${((currentStepIndex + 1) / deliveryStatuses.length) * 100}%`,
                maxWidth: `83%`,
                backgroundColor: '#4eac14',
              }}
            ></div>
          </div>
          {/* Circles */}
          <div className="relative z-10 flex justify-between items-between mb-4">
            {deliveryStatuses.map((status, index) => (
              <div key={status} className="flex-1  text-center relative ">
                <div
                  className={` w-8 h-8 rounded-full flex mx-auto   ${index <= currentStepIndex ? 'bg-[#4eac14]' : 'bg-gray-300'
                    }`}
                >
                </div>
                <p className=" mt-5 text-sm">{deliveryStatusTranslations[status]}</p>
              </div>
            ))}
          </div>
        </div>


        <p><a className='text-lg'>ผู้ขาย:</a> {orderDetails.farmer.farmerName}</p>
        <p><a className='text-lg'>สถานะ:</a> {deliveryStatusTranslations[orderDetails.deliveryStatus]}</p>
      </div>

        <div className="bg-white w-full h-fit p-6 rounded-xl">
          <p className="text-3xl border-b-2 pb-2 mb-3 text-[#535353]">การขนส่ง</p>
          <p className='pb-2'><a className='text-lg'>ที่อยู่สำหรับจัดส่ง: </a>{orderDetails.addressText}</p>
          <p><a className='text-lg'>ชื่อผู้ให้บริการขนส่ง: </a> {orderDetails.delivery?.deliveryService?.name  || (
                <span className="text-gray-300">อยู่ระหว่างดำเนินการ</span>
              )} </p>
          <p><a className='text-lg'>รหัสพัสดุ: </a> {orderDetails.delivery?.trackingNum || (
                <span className="text-gray-300">อยู่ระหว่างดำเนินการ</span>
              )} </p>

        </div>


    
        <div className='bg-white w-full h-fit p-6  rounded-xl '>
        <p className="text-3xl border-b-2 pb-2 mb-3 text-[#535353]">รายละเอียดสินค้า</p>
        <table className="min-w-full table-auto border-collapse border border-gray-200 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-2">ชื่อสินค้า</th>
              <th className="border border-gray-300 px-2 py-2">ประเภทสินค้า</th>
              <th className="border border-gray-300 px-4 py-2">จำนวน</th>
              <th className="border border-gray-300 px-4 py-2 ">ราคา (บาท)</th>
              <th className="border border-gray-300 px-4 py-2 text-right">ราคารวม (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.orderItems.map((item) => (

              <tr key={item.id} className="text-center">
                <td className="border border-gray-300 px-2 py-2 text-start">
                  {item.product.ProductName}
                  {item.product.ProductType}
                  
                  <p>ผู้ขาย{orderDetails.farmer.farmerName}</p>
                  {orderDetails.deliveryStatus === 'Delivered' && !userReviews.includes(item.product.ProductID) && (
                    <div>
                      <button onClick={() => openReviewModal(item.product)} className="text-blue-600 underline">
                        เขียนรีวิว
                      </button>
                    </div>

                  )}

                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {item.product.ProductType} 

                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.price.toFixed(2)} บาท
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {(item.quantity * item.price).toFixed(2)} บาท
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 text-right">
              <td colSpan="4" className="border border-gray-300 px-4 py-2 font-bold">
                รวม:
              </td>
              <td className="border border-gray-300 px-4 py-2 font-bold">
                {orderDetails.totalPrice.toFixed(2)} บาท
              </td>
            </tr>
          </tfoot>
        </table>  
        {/* Conditionally render the button based on deliveryStatus */}
        {orderDetails.deliveryStatus === 'Shipped' && (
          <div className='w-full h-fit flex justify-end mt-5'>
            <ConfirmDeliveryButton 
            orderId={orderDetails.id}
            userId={session.user.id} 
            onDeliverySuccess={handleDeliverySuccess} 
             />
          </div>
        )}                       
        </div>




        {/* Review Modal */}
        <Modal open={isReviewModalOpen} onClose={closeReviewModal}>
          <Box className="p-6 bg-white rounded-lg shadow-lg mx-auto mt-20 max-w-md">
            <h2 className="text-3xl mb-4">ให้คะแนนสินค้า</h2>
            {selectedProduct && (
              <div className="mb-4">
                
                <p><strong>ชื่อสินค้า:</strong> {selectedProduct.ProductName}</p>
                <p><strong>ประเภทสินค้า:</strong> {selectedProduct.ProductType}</p>
                <p><strong>ผู้ขาย:</strong> {orderDetails.farmer.farmerName}</p>
              </div>
            )}
            <Rating onClick={handleRating} ratingValue={rating} allowHover={true} size={30} />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="เขียนรีวิว (ไม่บังคับ)"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              sx={{ mt: 2 }}
            />
            <div className="mt-4 w-full flex justify-end">
              <Button variant="contained" color="primary" onClick={submitReview}>ยืนยัน</Button>
            </div>
          </Box>
        </Modal>
      </div>
   
  );
}

export default OrderDetails;
