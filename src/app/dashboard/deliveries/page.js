"use client";

import Search from '@/app/ui/dashboard/search/search';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField, Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';

const deliveryStatusTranslations = {
  Preparing: 'กำลังเตรียมสินค้า',
  Shipped: 'ส่งให้บริษัทขนส่งแล้ว',
  OutForDelivery: 'กำลังจัดส่ง',
  Delivered: 'สำเร็จ',
  Canceled: 'ยกเลิก',
  Returned: 'ส่งคืน',
  FailedDelivery: 'การจัดส่งล้มเหลว',
  AwaitingPickup: 'รอการรับ',
  RefundProcessed: 'คืนเงินเสร็จสิ้น',
};

const paymentStatusTranslations = {
  Pending: 'รอการชำระเงิน',
  Completed: 'ชำระเงินเสร็จสิ้น',
  Failed: 'ชำระเงินล้มเหลว',
  Refunded: 'คืนเงินแล้ว',
  Processing: 'กำลังดำเนินการ',
};

const orderStatusTranslations = {
  Pending: 'รอดำเนินการ',
  Processing: 'กำลังดำเนินการ',
  Completed: 'เสร็จสิ้น',
};

const statusColors = {
  Preparing: 'text-white bg-yellow-500  border-2 border-yellow-500 ',
  Shipped: 'text-white bg-purple-500 border-2 blue-purple-500  ',
  OutForDelivery: 'text-white  bg-orange-500 border-2 border-orange-500  ',
  Delivered: 'text-white bg-[#4eac14] border-2 border-[#4eac14]  ',
  Canceled: 'text-white bg-red-500 border-2 border-red-500  ',
  Returned: 'text-white bg-purple-500 border-2 border-purple-500 ',
  FailedDelivery: 'text-white bg-red-600 border-2 border-red-600  ',
  AwaitingPickup: 'text-white bg-gray-500 border-2 border-gray-500  ',
  RefundProcessed: 'text-white bg-blue-600 border-2 border-blue-600 ',
};

const paymentStatusColors = {
  Pending: 'text-white bg-yellow-500  border-2 border-yellow-500 ',
  Completed: 'text-white bg-[#4eac14] border-2 border-[#4eac14]  ',
  Failed: 'text-white bg-red-600 border-2 border-red-600  ',
  Refunded: 'text-white bg-purple-500 border-2 border-purple-500',
  Processing: 'text-white bg-blue-600 border-2 border-blue-600 ',
}


const orderStatuses = Object.keys(orderStatusTranslations); // Array of order statuses for filtering
const paymentStatuses = Object.keys(paymentStatusTranslations); // Array of payment statuses for filtering
const deliveryStatuses = Object.keys(deliveryStatusTranslations); // Array of delivery statuses for filtering

export default function IncomingOrders() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryService, setDeliveryService] = useState('');
  const [trackingNum, setTrackingNum] = useState('');
  const [deliveryServices, setDeliveryServices] = useState([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(''); // State for selected order status
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(''); // State for selected payment status
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState(''); // State for selected delivery status
  const [minPrice, setMinPrice] = useState(''); // State for minimum price
  const [maxPrice, setMaxPrice] = useState(''); // State for maximum price
  const query = searchParams.get("query") || ""; // Get the search query
  const router = useRouter();

  const userId = session.user.id;

  useEffect(() => {
    if (status === 'authenticated' && userId ) {
      fetchOrders(userId);
      fetchDeliveryServices(); 
    }
  }, [session, status,query]);

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}/farmer/orders/?query=${query}`);
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryServices = async () => {
    try {
      const response = await fetch('/api/delivery_service');
      if (!response.ok) {
        throw new Error('Failed to fetch delivery services');
      }
      const data = await response.json();
      setDeliveryServices(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeliveryService('');
    setTrackingNum('');
  };

  const handleServiceChange = (event) => {
    setDeliveryService(event.target.value);
  };

  const handleSubmit = async () => {
    if (!deliveryService || !trackingNum) {
      alert("Please fill out both fields.");
      return;
    }
    const orderId = selectedOrder.id;
    try {
      const res = await fetch(`/api/users/${session.user.id}/farmer/orders/delivery/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryService,
          trackingNum,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit delivery details');
      }

      handleClose();
      fetchOrders(session.user.id);
      alert('Delivery details submitted successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  const resetFilters = () => {
    setSelectedOrderStatus('');
    setSelectedPaymentStatus('');
    setSelectedDeliveryStatus('');
    setMinPrice('');
    setMaxPrice('');
  };

  // Filter orders based on selected statuses
  const filteredOrders = orders.filter(order => {
    const matchesOrderStatus = selectedOrderStatus ? order.status === selectedOrderStatus : true;
    const matchesPaymentStatus = selectedPaymentStatus ? order.paymentStatus === selectedPaymentStatus : true;
    const matchesDeliveryStatus = selectedDeliveryStatus ? order.deliveryStatus === selectedDeliveryStatus : true;
    const matchesMinPrice = minPrice ? order.totalPrice >= Number(minPrice) : true;
    const matchesMaxPrice = maxPrice ? order.totalPrice <= Number(maxPrice) : true;

    return matchesOrderStatus && matchesPaymentStatus && matchesDeliveryStatus && matchesMinPrice && matchesMaxPrice;
  });

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push("/login");
    return null;
  }

  return (
    <div className=" h-fit space-y-5 ">

      <div className='w-full h-fit  bg-white px-6 pt-6 pb-2 rounded-xl'> 
      <h1 className='page-header '>จัดการคำสั่งซื้อ</h1>          
      {/* Dropdown for filtering orders by status */}
      <div className="grid grid-cols md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7  gap-[5px]   ">
        <div className=''>
        <Search placeholder="ค้นหาจากรหัสคำสั่งซื้อ..."/>
        </div>     
        <div>
          <label htmlFor="order-status-select">สถานะคำสั่งซื้อ</label>
          <select
            id="order-status-select"
            value={selectedOrderStatus}
            onChange={(e) => setSelectedOrderStatus(e.target.value)}
            className='text-[#4eac14]'
          >
            <option value="" >
              ทั้งหมด
            </option>
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {orderStatusTranslations[status]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="payment-status-select">สถานะการชำระเงิน</label>
          <select
            id="payment-status-select"
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className='text-[#4eac14]'
          >
            <option value="">
              ทั้งหมด
            </option>
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {paymentStatusTranslations[status]}
              </option>
            ))}
          </select>


        </div>

        <div>
          <label htmlFor="delivery-status-select">สถานะการจัดส่ง</label>
          <select
            id="delivery-status-select"
            value={selectedDeliveryStatus}
            onChange={(e) => setSelectedDeliveryStatus(e.target.value)}
            className='text-[#4eac14]'
          >
            <option value="">
              ทั้งหมด
            </option>
            {deliveryStatuses.map((status) => (
              <option key={status} value={status}>
                {deliveryStatusTranslations[status]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="min-price">มูลค่าต่ำสุด</label>
          <input
          className='text-[#4eac14] w-full'
            type="number"
            id="min-price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="max-price">มูลค่าสูงสุด</label>
          <input
          className='text-[#4eac14] w-full'
            type="number"
            id="max-price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="1000"
          />
        </div>
      
        {/* Button to reset all filters */}
        <Button variant="outlined" onClick={resetFilters}>
          ล้าง Filter
        </Button>
        
      </div>      
      </div>
           
      



      <div className='relative overflow-x-auto rounded-xl'>
  <table className=" min-w-full h-fit border-separate border-spacing-0 bg-white p-6 ">
  <thead>
    <tr className='text-xs 2xl:text-base  bg-gray-100'>
      <th scope="col" className="w-[50px] px-2 pt-5 pb-3 border-b border-r text-start font-normal rounded-tl-lg">รหัส</th>
      <th scope="col" className="w-[150px] px-2 pt-5 pb-3 border-b border-r text-start font-normal">สถานะคำสั่งซื้อ</th>
      <th scope="col" className="w-[150px] border-b px-2 pt-5 pb-3 border-r text-start font-normal">วันที่สั่งซื้อ</th>
      <th scope="col" className="w-[100px] border-b px-2 pt-5 pb-3 border-r text-start font-normal">รวม</th>
      <th scope="col" className="w-[200px] border-b px-2 pt-5 pb-3 border-r text-start font-normal">ทีอยู่</th>
      <th scope="col" className="w-[200px] border-b px-2 pt-5 pb-3 border-r text-start font-normal">ผู้ซื้อ</th>
      <th scope="col" className="w-[150px] border-b px-2 pt-5 pb-3 border-r text-start font-normal">บริการขนส่ง</th>
      <th scope="col" className="w-[100px] border-b px-2 pt-5 pb-3 border-r text-start font-normal">เลขพัสดุ</th>
      <th scope="col" className="w-[180px] border-b px-2 pt-5 pb-3 border-r text-start font-normal">สถานะการชำระเงิน</th>
      <th scope="col" className="w-[180px] border-b px-2 pt-5 pb-3 border-r text-start font-normal">สถานะการจัดส่ง</th>
      <th scope="col" className="w-[350px] border-b px-2 pt-5 pb-3 border-r text-start font-normal  rounded-tr-lg">แอ็คชั่น</th>
    </tr>
  </thead>
  {filteredOrders.length === 0 ? (
    <p>No incoming orders at the moment</p>
  ) : (
    <tbody>
      {filteredOrders.map((order) => (
        <tr key={order.id} className="hover:bg-gray-100 text-sm">
          <td className=" border-b border-r px-2  md:py-2">{order.id}</td>
          <td className="border-b border-r  px-2 md:py-2">{orderStatusTranslations[order.status]}</td>
          <td className="border-b border-r px-2  md:py-2">{new Date(order.createdAt).toLocaleDateString('th-TH')}</td>
          <td className="border-b border-r px-2 ">{order.totalPrice} บาท</td>
          <td className="border-b border-r px-2  md:py-2">{order.addressText}</td>
          <td className='border-b border-r px-2  md:py-2'>  
            <div className='flex flex-col'>
              <div className='mb-1'>{order.user?.name || 'User not found'} </div>
              <div>{order.user?.phone || 'phone not found'}</div>
            </div>
          </td>
          <td className="border-b border-r px-2  md:py-2">
            {order.delivery?.deliveryService?.name || (
              <span className="text-gray-300">โปรดใส่บริการขนส่ง</span>
            )}
          </td>
          <td className="border-b border-r px-2  md:py-2">
            {order.delivery?.trackingNum || (
              <span className="text-gray-300">โปรดใส่เลขพัสดุ</span>
            )}
          </td>
          <td className="border-b border-r px-2   md:py-2">
            <div className={`${paymentStatusColors[order.paymentStatus]}   text-center border-2 border-transparent py-1  rounded-3xl`}>
              {paymentStatusTranslations[order.paymentStatus]}
            </div>
            
          </td>
          <td className="border-b border-r px-2  md:py-2">
            <div className={`${statusColors[order.deliveryStatus]} text-center border-2 border-transparent py-1  rounded-3xl `}>
            {deliveryStatusTranslations[order.deliveryStatus]}
            </div>

          </td>
          <td className="border-b border-r px-2  md:py-2">
            <Tooltip title="ดูรายละเอียด" arrow>
              <IconButton
                aria-label="view"
                color="primary"
                onClick={() => router.push(`/dashboard/orders/${order.id}`)}
              >
                <div className="border-2 text-sm md:px-2 py-1 rounded-xl">
                  <VisibilityRoundedIcon /> ดูเพิ่มเติม
                </div>
              </IconButton>
            </Tooltip>

            <Tooltip title="เพิ่มเลขพัสดุ" arrow>
              <IconButton
                aria-label="add-tracking"
                color="primary"
                onClick={() => handleOpen(order)}
              >
                <div className="border-2 text-sm md:px-2 py-1 rounded-xl">
                  <LocalShippingIcon /> จัดส่ง
                </div>
              </IconButton>
            </Tooltip>
          </td>
        </tr>
      ))}
    </tbody>
  )}
</table>        
      </div>




      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delivery-modal-title"
        aria-describedby="delivery-modal-description"
      >
        
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: '8px',
          }}
        >
          <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl r' id="delivery-modal-title">กรอกข้อมูลขนส่ง</h2>
          <IconButton onClick={handleClose} sx={{ color: 'gray' }}>
            <CloseRoundedIcon />
          </IconButton>
          </div>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="delivery-service-label">ผู้ให้บริการขนส่ง</InputLabel>
            <Select
              labelId="delivery-service-label"
              label="ผู้ให้บริการขนส่ง"
              value={deliveryService}
              onChange={handleServiceChange}
            >
              {deliveryServices.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="เลขพัสดุ"
            variant="outlined"
            fullWidth
            value={trackingNum}
            onChange={(e) => setTrackingNum(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSubmit} fullWidth>
            ส่งข้อมูล
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
