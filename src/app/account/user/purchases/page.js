'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
// Map of deliveryStatus to Thai translations
const deliveryStatusTranslations = {
  Preparing: 'กำลังเตรียมสินค้า',
  Shipped: 'ส่งให้บริษัทขนส่งแล้ว',
  OutForDelivery: 'กำลังจัดส่ง',
  Delivered: 'สำเร็จ',
  Canceled: 'ยกเลิก',
  Returned: 'ส่งคืน',
  FailedDelivery: 'การจัดส่งล้มเหลว',
  //AwaitingPickup: 'รอการรับ',
  RefundProcessed: 'คืนเงินเสร็จสิ้น',
};

function Purchases() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null); // Track the expanded order

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust based on your preference  

  // Fetch the filter status from the query parameter
  const initialFilter = searchParams.get('status') || '';

  const [selectedStatus, setSelectedStatus] = useState(initialFilter); // State for selected filter

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    // Fetch user purchases if authenticated
    if (status === 'authenticated') {
      const fetchPurchases = async () => {
        try {
          if (session?.user?.id) {
            const response = await fetch(
              `http://localhost:3000/api/users/${session.user.id}/purchases?page=${currentPage}&limit=${itemsPerPage}&status=${initialFilter}`
            );
            if (response.ok) {
              const data = await response.json();
              setPurchases(data.purchases || []);
              setFilteredPurchases(data.purchases || []);
              setTotalPages(data.totalPages || 1);
            } else if (response.status === 403) {
              setError('You are not authorized to view this content.');
            } else {
              setError('Failed to fetch purchases');
            }
          }
        } catch (error) {
          setError('An error occurred while fetching purchases');
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchPurchases();
    }
  }, [status, session, router, initialFilter, currentPage, itemsPerPage]);


  // Handle filter logic and update the URL query
  const handleFilterChange = (status) => {
    setSelectedStatus(status);

    // Update the URL query parameter without navigation
    const newParams = new URLSearchParams(window.location.search);
    if (status) {
        newParams.set('status', status);
    } else {
        newParams.delete('status');
    }
    router.replace(`/account/user/purchases?${newParams.toString()}`);
  };

  if (loading) {
    return <div className='w-full h-[90vh] bg-white p-6 rounded-xl'>Loading your purchases...</div>;
  }

  if (error) {
    return <div className='w-full h-[90vh] bg-white p-6 rounded-xl'>{error}</div>;
  }

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
      <div className='w-full h-fit bg-white p-6 rounded-xl'>
        <h1 className="text-4xl text-[#535353] pb-2 border-b-2 mb-4">คำสั่งซื้อของคุณ</h1>

        {/* Filter Buttons */}
        <p>          หมวดหมู่</p>
        <div className="mb-4 gap-x-5">

          <button
            className={`px-4 py-2 my-2 mr-2 ${selectedStatus === '' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => handleFilterChange('')}
          >
            ทั้งหมด
          </button>
          {Object.keys(deliveryStatusTranslations).map((status) => (
            <button
              key={status}
              className={`px-4 py-2 mr-2 mb-2 ${selectedStatus === status ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              onClick={() => handleFilterChange(status)}
            >
              {deliveryStatusTranslations[status]}
            </button>
          ))}
        </div>

        {filteredPurchases.length === 0 ? (
          <p className='text-[#535353]'>ยังไม่มีข้อมูลคำสั่งซื้อในตอนนี้</p>
        ) : (
          <div className="">
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='w-[100px]  text-start'> </th>
                  <th className='w-fit text-start'> </th>
                  <th className='w-fit text-right'> </th>
                  <th className='w-[100px]'></th> {/* Add this column for the details link */}
                </tr>
              </thead>
              <tbody>
  {filteredPurchases.map((order) => (
    <>
      <tr className='border-b-2'>
      
      <td className='cart-data pr-5 flex justify-start'>


        <div className=''>
        {order.orderItems[0].product.imageUrl ? (
        <Image
            src={order.orderItems[0].product.imageUrl}
            alt={order.orderItems[0].product.ProductName}
            width={0} // Adjust width as needed
            height={0} // Adjust height as needed
            sizes="100vw"
            className='w-fit h-[100px]  object-cover rounded-2xl' />
        ) : (
          <img className=" w-fit h-[90px] object-cover rounded-2xl" src="/phulae.jpg" alt="Card Image" />
        )}
        </div>




        </td>
      <td className=''>
        <div className='flex flex-col '>
        <p>สั่งซื้อเมื่อ {new Date(order.createdAt).toLocaleDateString('th-TH', {
          year: '2-digit',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}</p>
        <p className=''>{order.farmer.farmerName} Order#{order.id}</p> {/* Show farmer name */}       
        <p className='text-lg'>{order.orderItems.length} รายการ</p>
   
        </div>

        </td>
        

        <td className='cart-data text-right pr-5'>
          <p className="text-lg text-blue-500 ">{deliveryStatusTranslations[order.deliveryStatus]}</p>
          
          <p className='text-xl'>{order.totalPrice} บาท</p> {/* Assuming totalPrice is available in order */}
        </td>

        <td >
          <button
            onClick={() => router.push(`/account/user/purchases/${order.id}`)}
            className="bg-[#4eac14] text-white px-4 py-2 rounded"
          >
            ดูรายละเอียด
          </button>
        </td>
      </tr>


    </>
  ))}
</tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 disabled:bg-gray-300 rounded-xl bg-[#4eac14] text-white "
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            ย้อนกลับ
          </button>
          <span>หน้า {currentPage} / {totalPages}</span>
          <button
            className="px-4 py-2 disabled:bg-gray-300  rounded-xl bg-[#4eac14] text-white "
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            หน้าต่อไป
          </button>
        </div>        
      </div>


  );
}

export default Purchases;
